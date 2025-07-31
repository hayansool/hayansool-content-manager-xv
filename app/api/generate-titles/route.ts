import { type NextRequest, NextResponse } from "next/server"
import { generateRecipeTitles } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const { seriesName, count } = await request.json()

    if (!seriesName || !count) {
      return NextResponse.json({ error: "Series name and count are required" }, { status: 400 })
    }

    const titles = await generateRecipeTitles(seriesName, count)

    return NextResponse.json({ titles })
  } catch (error) {
    console.error("Error generating titles:", error)
    return NextResponse.json({ error: "Failed to generate titles" }, { status: 500 })
  }
}
