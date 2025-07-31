export function generateCardImage(title: string, language: string): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    // Set canvas size (square format)
    canvas.width = 800
    canvas.height = 800

    // Beige background
    ctx.fillStyle = "#F5F5DC"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Brand colors and styling
    ctx.fillStyle = "#8B4513"
    ctx.font = "bold 48px Arial, sans-serif"
    ctx.textAlign = "center"

    // Add brand name
    ctx.fillText("Hayansool", canvas.width / 2, 100)

    // Add series indicator
    ctx.font = "24px Arial, sans-serif"
    ctx.fillStyle = "#A0522D"
    ctx.fillText("Custom Makgeolli 101", canvas.width / 2, 140)

    // Add main title (with text wrapping)
    ctx.font = "bold 36px Arial, sans-serif"
    ctx.fillStyle = "#654321"

    const words = title.split(" ")
    const lines: string[] = []
    let currentLine = ""

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? " " : "") + word
      const metrics = ctx.measureText(testLine)

      if (metrics.width > canvas.width - 100 && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    })

    if (currentLine) {
      lines.push(currentLine)
    }

    // Draw title lines
    const startY = canvas.height / 2 - lines.length * 25
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * 50)
    })

    // Add language indicator
    ctx.font = "20px Arial, sans-serif"
    ctx.fillStyle = "#8B4513"
    const langMap: Record<string, string> = {
      ko: "한국어",
      en: "English",
      ja: "日本語",
      zh: "中文",
    }
    ctx.fillText(langMap[language] || language, canvas.width / 2, canvas.height - 50)

    // Convert to blob URL
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        resolve(url)
      }
    }, "image/png")
  })
}
