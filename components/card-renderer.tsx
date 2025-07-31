"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ImageIcon, Download } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { generateCardImage } from "@/lib/card-renderer"

interface RecipeWithContent {
  id: string
  title_ko: string
  series: {
    name: string
    episode_number: number
  }
  content: Array<{
    language: string
    content: string
  }>
  cards: Array<{
    language: string
    image_url: string
  }>
}

interface CardRendererProps {
  onCardsRendered: () => void
}

export default function CardRenderer({ onCardsRendered }: CardRendererProps) {
  const [recipes, setRecipes] = useState<RecipeWithContent[]>([])
  const [renderingCards, setRenderingCards] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadRecipesWithContent()
  }, [])

  const loadRecipesWithContent = async () => {
    try {
      const { data, error } = await supabase
        .from("recipe_titles")
        .select(`
          id,
          title_ko,
          series:recipe_series(name, episode_number),
          content:recipe_content(language, content),
          cards:recipe_cards(language, image_url)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setRecipes(data || [])
    } catch (error) {
      console.error("Error loading recipes:", error)
    }
  }

  const renderCard = async (recipeId: string, language: string, title: string) => {
    const cardKey = `${recipeId}-${language}`
    setRenderingCards((prev) => new Set(prev).add(cardKey))

    try {
      // Generate card image
      const imageUrl = await generateCardImage(title, language)

      // Save to Supabase
      const { error } = await supabase.from("recipe_cards").upsert({
        title_id: recipeId,
        language,
        image_url: imageUrl,
        image_blob_url: imageUrl,
      })

      if (error) throw error

      // Refresh data
      await loadRecipesWithContent()
      onCardsRendered()
    } catch (error) {
      console.error("Error rendering card:", error)
    } finally {
      setRenderingCards((prev) => {
        const newSet = new Set(prev)
        newSet.delete(cardKey)
        return newSet
      })
    }
  }

  const downloadCard = (imageUrl: string, title: string, language: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `${title}-${language}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const languages = [
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-amber-800">
            <ImageIcon className="w-5 h-5 mr-2" />
            Card Renderer
          </CardTitle>
          <CardDescription>Generate square card images for social media posts</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle className="text-lg">{recipe.title_ko}</CardTitle>
              <Badge variant="secondary">
                Ep.{recipe.series.episode_number} - {recipe.series.name}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {languages.map((lang) => {
                  const hasContent = recipe.content.some((c) => c.language === lang.code)
                  const existingCard = recipe.cards.find((c) => c.language === lang.code)
                  const isRendering = renderingCards.has(`${recipe.id}-${lang.code}`)

                  return (
                    <div key={lang.code} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {lang.flag} {lang.name}
                        </span>
                        {hasContent && (
                          <Badge variant={existingCard ? "default" : "secondary"}>
                            {existingCard ? "Rendered" : "Ready"}
                          </Badge>
                        )}
                      </div>

                      {existingCard ? (
                        <div className="space-y-2">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={existingCard.image_url || "/placeholder.svg"}
                              alt={`Card for ${lang.name}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => renderCard(recipe.id, lang.code, recipe.title_ko)}
                              disabled={isRendering}
                              className="flex-1"
                            >
                              {isRendering ? <Loader2 className="w-3 h-3 animate-spin" /> : "Re-render"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadCard(existingCard.image_url, recipe.title_ko, lang.code)}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ) : hasContent ? (
                        <div className="space-y-2">
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                          <Button
                            size="sm"
                            onClick={() => renderCard(recipe.id, lang.code, recipe.title_ko)}
                            disabled={isRendering}
                            className="w-full bg-amber-600 hover:bg-amber-700"
                          >
                            {isRendering ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                Rendering...
                              </>
                            ) : (
                              "Render Card"
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
                            <p className="text-xs text-gray-400 text-center">
                              No content
                              <br />
                              available
                            </p>
                          </div>
                          <Button size="sm" disabled className="w-full">
                            Need Content
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
