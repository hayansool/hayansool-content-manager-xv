import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function generateRecipeTitles(seriesName: string, count = 5) {
  const prompt = `Generate ${count} creative makgeolli recipe titles for the "${seriesName}" series. 
  Each title should be in Korean and follow these brand guidelines:
  - Mention "one bottle" of rice brewing mix
  - Include water ratios: 350ml + 150ml
  - Reference 15~25°C fermentation for 24h, then cold storage
  - For fruit recipes (Ep.14+), use 150ml juice instead of fruit pieces
  - Keep titles engaging and educational
  
  Return as a JSON array of Korean titles only.`

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt,
  })

  try {
    return JSON.parse(text)
  } catch {
    return text.split("\n").filter((line) => line.trim())
  }
}

export async function generateMultilingualContent(koreanTitle: string, seriesName: string) {
  const languages = [
    { code: "en", name: "English" },
    { code: "ja", name: "Japanese" },
    { code: "zh", name: "Chinese (Simplified)" },
  ]

  const results: Record<string, any> = { ko: null }

  // Generate Korean content first
  const koPrompt = `Create detailed makgeolli recipe content in Korean for: "${koreanTitle}"
  
  Brand guidelines:
  - Always mention "one bottle" of rice brewing mix
  - Water ratio: 350ml + 150ml
  - Fermentation: 15~25°C for 24h, then cold storage
  - For fruit recipes (Ep.14+), use 150ml juice instead of fruit pieces
  - Series: ${seriesName}
  
  Return JSON with: title, ingredients (array), instructions (array), tips (string)`

  const { text: koText } = await generateText({
    model: openai("gpt-4o"),
    prompt: koPrompt,
  })

  try {
    results.ko = JSON.parse(koText)
  } catch {
    results.ko = { title: koreanTitle, ingredients: [], instructions: [], tips: "" }
  }

  // Generate translations
  for (const lang of languages) {
    const prompt = `Translate this Korean makgeolli recipe to ${lang.name}, maintaining the brand voice and technical accuracy:

    Korean Title: ${koreanTitle}
    Korean Content: ${JSON.stringify(results.ko)}
    
    Return JSON with translated: title, ingredients (array), instructions (array), tips (string)`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    try {
      results[lang.code] = JSON.parse(text)
    } catch {
      results[lang.code] = { title: koreanTitle, ingredients: [], instructions: [], tips: "" }
    }
  }

  return results
}
