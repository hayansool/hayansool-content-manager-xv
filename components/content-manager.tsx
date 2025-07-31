"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Languages, FileText, Save } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { generateMultilingualContent } from "@/lib/openai"

interface RecipeTitle {
  id: string
  title_ko: string
  series: {
    name: string
    episode_number: number
  }
}

interface ContentManagerProps {
  onContentUpdated: () => void
}

export default function ContentManager({ onContentUpdated }: ContentManagerProps) {
  const [titles, setTitles] = useState<RecipeTitle[]>([])
  const [selectedTitle, setSelectedTitle] = useState<RecipeTitle | null>(null)
  const [content, setContent] = useState<Record<string, any>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadTitles()
  }, [])

  const loadTitles = async () => {
    try {
      const { data, error } = await supabase
        .from("recipe_titles")
        .select(`
          id,
          title_ko,
          series:recipe_series(name, episode_number)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setTitles(data || [])
    } catch (error) {
      console.error("Error loading titles:", error)
    }
  }

  const loadContent = async (titleId: string) => {
    try {
      const { data, error } = await supabase.from("recipe_content").select("*").eq("title_id", titleId)

      if (error) throw error

      const contentByLang: Record<string, any> = {}
      data?.forEach((item) => {
        contentByLang[item.language] = {
          content: item.content,
          ingredients: item.ingredients,
          instructions: item.instructions,
          tips: item.tips,
        }
      })

      setContent(contentByLang)
    } catch (error) {
      console.error("Error loading content:", error)
    }
  }

  const handleTitleSelect = (title: RecipeTitle) => {
    setSelectedTitle(title)
    loadContent(title.id)
  }

  const handleGenerateContent = async () => {
    if (!selectedTitle) return

    setIsGenerating(true)
    try {
      const generatedContent = await generateMultilingualContent(selectedTitle.title_ko, selectedTitle.series.name)
      setContent(generatedContent)
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveContent = async () => {
    if (!selectedTitle) return

    setIsSaving(true)
    try {
      // Delete existing content
      await supabase.from("recipe_content").delete().eq("title_id", selectedTitle.id)

      // Insert new content
      const contentToSave = Object.entries(content).map(([lang, data]) => ({
        title_id: selectedTitle.id,
        language: lang,
        content: data.content || "",
        ingredients: data.ingredients || [],
        instructions: data.instructions || [],
        tips: data.tips || "",
      }))

      const { error } = await supabase.from("recipe_content").insert(contentToSave)

      if (error) throw error

      onContentUpdated()
    } catch (error) {
      console.error("Error saving content:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateContent = (language: string, field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        [field]: value,
      },
    }))
  }

  const languages = [
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Title Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-800">Recipe Titles</CardTitle>
            <CardDescription>Select a title to manage content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {titles.map((title) => (
                <div
                  key={title.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedTitle?.id === title.id
                      ? "bg-amber-100 border-2 border-amber-300"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => handleTitleSelect(title)}
                >
                  <p className="font-medium text-sm">{title.title_ko}</p>
                  <Badge variant="secondary" className="mt-1">
                    Ep.{title.series.episode_number} - {title.series.name}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Management */}
        <div className="lg:col-span-2">
          {selectedTitle ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-amber-800">
                  <Languages className="w-5 h-5 mr-2" />
                  Multilingual Content
                </CardTitle>
                <CardDescription>Generate and edit content for: {selectedTitle.title_ko}</CardDescription>
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerateContent}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Languages className="w-4 h-4 mr-2" />
                        Generate All Languages
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleSaveContent}
                    disabled={isSaving || Object.keys(content).length === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Content
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="ko" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    {languages.map((lang) => (
                      <TabsTrigger key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {languages.map((lang) => (
                    <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Textarea
                            value={content[lang.code]?.title || ""}
                            onChange={(e) => updateContent(lang.code, "title", e.target.value)}
                            placeholder={`Title in ${lang.name}`}
                            rows={2}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Ingredients</label>
                          <Textarea
                            value={content[lang.code]?.ingredients?.join("\n") || ""}
                            onChange={(e) =>
                              updateContent(lang.code, "ingredients", e.target.value.split("\n").filter(Boolean))
                            }
                            placeholder={`One ingredient per line in ${lang.name}`}
                            rows={4}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Instructions</label>
                          <Textarea
                            value={content[lang.code]?.instructions?.join("\n") || ""}
                            onChange={(e) =>
                              updateContent(lang.code, "instructions", e.target.value.split("\n").filter(Boolean))
                            }
                            placeholder={`One step per line in ${lang.name}`}
                            rows={6}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Tips</label>
                          <Textarea
                            value={content[lang.code]?.tips || ""}
                            onChange={(e) => updateContent(lang.code, "tips", e.target.value)}
                            placeholder={`Additional tips in ${lang.name}`}
                            rows={3}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>Select a recipe title to manage its content</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
