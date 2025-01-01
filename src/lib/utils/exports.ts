import html2canvas from "html2canvas"
import pptxgen from "pptxgenjs"
import jsPDF from "jspdf"
import { SlideTheme } from "@/types/theme"

export async function exportToPDF(slides: string[], theme?: SlideTheme) {
  // Create a temporary container
  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.left = "-9999px"
  container.style.top = "-9999px"
  document.body.appendChild(container)

  try {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1280, 720],
    })

    for (let i = 0; i < slides.length; i++) {
      // Create slide element
      const slideElement = document.createElement("div")
      slideElement.innerHTML = slides[i]
      slideElement.className = "slide-preview"
      if (theme) {
        Object.assign(slideElement.style, theme.styles)
      }
      container.appendChild(slideElement)

      // Capture slide as canvas
      const canvas = await html2canvas(slideElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      // Add to PDF
      const imgData = canvas.toDataURL("image/png")
      if (i > 0) {
        pdf.addPage()
      }
      pdf.addImage(imgData, "PNG", 0, 0, 1280, 720)

      // Clean up
      container.removeChild(slideElement)
    }

    pdf.save("presentation.pdf")
  } finally {
    document.body.removeChild(container)
  }
}

export async function exportToPPTX(slides: string[], theme?: SlideTheme) {
  // Create a temporary container
  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.left = "-9999px"
  container.style.top = "-9999px"
  document.body.appendChild(container)

  try {
    const pptx = new pptxgen()
    pptx.layout = "LAYOUT_16x9"

    for (const slide of slides) {
      // Create slide element
      const slideElement = document.createElement("div")
      slideElement.innerHTML = slide
      slideElement.className = "slide-preview"
      if (theme) {
        Object.assign(slideElement.style, theme.styles)
      }
      container.appendChild(slideElement)

      // Capture slide as canvas
      const canvas = await html2canvas(slideElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      // Add to PPTX
      const pptxSlide = pptx.addSlide()
      const imgData = canvas.toDataURL("image/png")
      pptxSlide.addImage({ data: imgData, x: 0, y: 0, w: "100%", h: "100%" })

      // Clean up
      container.removeChild(slideElement)
    }

    pptx.writeFile({ fileName: "presentation.pptx" })
  } finally {
    document.body.removeChild(container)
  }
} 