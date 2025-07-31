import { type NextRequest, NextResponse } from "next/server"
import { generateMultilingualContent } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const { koreanTitle, seriesName } = await request.json()

    if (!koreanTitle || !seriesName) {
      return NextResponse.json({ error: "Korean title and series name are required" }, { status: 400 })
    }

    const content = await generateMultilingualContent(koreanTitle, seriesName)

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
