"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { generateRecipeTitles } from "@/lib/openai"

interface RecipeSeries {
  id: string
  name: string
  description: string
  episode_number: number
}

interface TitleGeneratorProps {
  onTitlesGenerated: () => void
}

export default function TitleGenerator({ onTitlesGenerated }: TitleGeneratorProps) {
  const [series, setSeries] = useState<RecipeSeries[]>([])
  const [selectedSeries, setSelectedSeries] = useState<string>("")
  const [titleCount, setTitleCount] = useState(5)
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSeries()
  }, [])

  const loadSeries = async () => {
    try {
      const { data, error } = await supabase.from("recipe_series").select("*").order("episode_number")

      if (error) throw error
      setSeries(data || [])
    } catch (error) {
      console.error("Error loading series:", error)
    }
  }

  const handleGenerateTitles = async () => {
    if (!selectedSeries) return

    const selectedSeriesData = series.find((s) => s.id === selectedSeries)
    if (!selectedSeriesData) return

    setIsGenerating(true)
    try {
      const titles = await generateRecipeTitles(selectedSeriesData.name, titleCount)
      setGeneratedTitles(Array.isArray(titles) ? titles : [])
    } catch (error) {
      console.error("Error generating titles:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveTitles = async () => {
    if (!selectedSeries || generatedTitles.length === 0) return

    setIsSaving(true)
    try {
      const titlesToSave = generatedTitles.map((title) => ({
        series_id: selectedSeries,
        title_ko: title,
      }))

      const { error } = await supabase.from("recipe_titles").insert(titlesToSave)

      if (error) throw error

      setGeneratedTitles([])
      onTitlesGenerated()
    } catch (error) {
      console.error("Error saving titles:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const removeTitle = (index: number) => {
    setGeneratedTitles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-amber-800">
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Recipe Titles
          </CardTitle>
          <CardDescription>Create engaging makgeolli recipe titles for your selected series using AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="series">Recipe Series</Label>
              <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a series" />
                </SelectTrigger>
                <SelectContent>
                  {series.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      Ep.{s.episode_number} - {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Number of Titles</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="10"
                value={titleCount}
                onChange={(e) => setTitleCount(Number.parseInt(e.target.value) || 5)}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleGenerateTitles}
                disabled={!selectedSeries || isGenerating}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Titles
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {generatedTitles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-800">Generated Titles</CardTitle>
            <CardDescription>Review and edit the generated titles before saving</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedTitles.map((title, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-amber-900">{title}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTitle(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={handleSaveTitles} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  `Save ${generatedTitles.length} Titles`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
