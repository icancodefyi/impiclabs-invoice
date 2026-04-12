"use client"

import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

import { A4_HEIGHT_PX, A4_WIDTH_PX } from "@/lib/a4"

type ExportPdfOptions = {
  fileName: string
  marginMm?: number
}

/** Visit root + every descendant so the root node gets export ids (TreeWalker.nextNode skips root). */
function assignExportIds(root: HTMLElement, rootId: string) {
  const sourceMap = new Map<string, HTMLElement>()
  let index = 0

  const visit = (node: HTMLElement) => {
    const nodeId = `${rootId}-${index}`
    index += 1
    node.setAttribute("data-export-node-id", nodeId)
    sourceMap.set(nodeId, node)
    for (let i = 0; i < node.children.length; i += 1) {
      const child = node.children[i]
      if (child instanceof HTMLElement) {
        visit(child)
      }
    }
  }

  visit(root)
  root.setAttribute("data-export-root", rootId)

  return sourceMap
}

function clearExportIds(root: HTMLElement) {
  root.removeAttribute("data-export-root")

  const nodes = root.querySelectorAll("[data-export-node-id]")
  nodes.forEach((node) => {
    node.removeAttribute("data-export-node-id")
  })
}

/** html2canvas cannot parse modern color spaces. */
const MODERN_COLOR_SYNTAX = /oklab|oklch|color-mix|\blch\(|\blab\(|\bcolor\(\s*(?:srgb|display-p3|oklab|oklch)/i

let colorCoerceCanvas: CanvasRenderingContext2D | null = null

function getColorCoerceContext(): CanvasRenderingContext2D | null {
  if (typeof document === "undefined") {
    return null
  }
  if (!colorCoerceCanvas) {
    colorCoerceCanvas = document.createElement("canvas").getContext("2d")
  }
  return colorCoerceCanvas
}

function coerceColorForHtml2Canvas(value: string): string | null {
  const v = value.trim()
  if (!v) {
    return null
  }
  if (v === "none" || v === "transparent") {
    return v
  }
  if (!MODERN_COLOR_SYNTAX.test(v)) {
    return v
  }

  const ctx = getColorCoerceContext()
  if (!ctx) {
    return null
  }

  try {
    ctx.fillStyle = "#000000"
    ctx.fillStyle = v
    const out = String(ctx.fillStyle)
    if (MODERN_COLOR_SYNTAX.test(out)) {
      return null
    }
    return out
  } catch {
    return null
  }
}

/**
 * Last resort: replace any remaining modern color functions so html2canvas never sees them.
 * Allows limited nesting (e.g. color-mix with oklch stops).
 */
function scrubModernColorFunctions(css: string): string {
  let s = css
  for (let i = 0; i < 48; i += 1) {
    const before = s
    s = s.replace(/\boklab\([^()]*(?:\([^()]*\)[^()]*)*\)/gi, "rgb(115,115,115)")
    s = s.replace(/\boklch\([^()]*(?:\([^()]*\)[^()]*)*\)/gi, "rgb(115,115,115)")
    s = s.replace(/\bcolor-mix\([^()]*(?:\([^()]*\)[^()]*)*\)/gi, "rgb(115,115,115)")
    s = s.replace(/\blch\([^()]*(?:\([^()]*\)[^()]*)*\)/gi, "rgb(115,115,115)")
    s = s.replace(/\blab\([^()]*(?:\([^()]*\)[^()]*)*\)/gi, "rgb(115,115,115)")
    s = s.replace(/\bcolor\(\s*(?:srgb|display-p3|oklab|oklch)[^)]*\)/gi, "rgb(115,115,115)")
    if (s === before) {
      break
    }
  }
  return s
}

function inlineComputedStylesSafe(sourceNode: HTMLElement, clonedNode: HTMLElement) {
  const computed = window.getComputedStyle(sourceNode)
  let inlineStyle = ""

  for (let i = 0; i < computed.length; i += 1) {
    const prop = computed[i]
    let value = computed.getPropertyValue(prop)
    if (!value.trim()) {
      continue
    }

    if (MODERN_COLOR_SYNTAX.test(value)) {
      const coerced = coerceColorForHtml2Canvas(value)
      if (coerced === null) {
        continue
      }
      value = coerced
    }

    inlineStyle += `${prop}:${value};`
  }

  inlineStyle = scrubModernColorFunctions(inlineStyle)
  clonedNode.setAttribute("style", inlineStyle)
}

async function renderCanvasSafe(target: HTMLElement) {
  const rootId = `export-${crypto.randomUUID()}`
  const sourceMap = assignExportIds(target, rootId)

  try {
    return await html2canvas(target, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
      onclone: (clonedDocument) => {
        const clonedRoot = clonedDocument.querySelector<HTMLElement>(`[data-export-root='${rootId}']`)

        if (!clonedRoot) {
          return
        }

        const clonedNodes = clonedRoot.querySelectorAll<HTMLElement>("[data-export-node-id]")

        clonedNodes.forEach((clonedNode) => {
          const nodeId = clonedNode.getAttribute("data-export-node-id")
          if (!nodeId) {
            return
          }

          const sourceNode = sourceMap.get(nodeId)
          if (!sourceNode) {
            return
          }

          inlineComputedStylesSafe(sourceNode, clonedNode)
          clonedNode.removeAttribute("class")
        })

        const stylesheets = clonedDocument.querySelectorAll("style, link[rel='stylesheet']")
        stylesheets.forEach((stylesheet) => stylesheet.remove())

        // Attributes copied by cloneNode (e.g. SVG fill) — scrub inline style one more time.
        clonedRoot.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
          const st = el.getAttribute("style")
          if (st && MODERN_COLOR_SYNTAX.test(st)) {
            el.setAttribute("style", scrubModernColorFunctions(st))
          }
        })

        clonedRoot.querySelectorAll("[fill], [stroke]").forEach((el) => {
          const fill = el.getAttribute("fill")
          if (fill && MODERN_COLOR_SYNTAX.test(fill)) {
            el.setAttribute("fill", "#2e2e2e")
          }
          const stroke = el.getAttribute("stroke")
          if (stroke && MODERN_COLOR_SYNTAX.test(stroke)) {
            el.setAttribute("stroke", "#2e2e2e")
          }
        })
      },
    })
  } finally {
    clearExportIds(target)
  }
}

export async function exportElementToA4Pdf(element: HTMLElement, options: ExportPdfOptions) {
  /** Default 0 so the raster matches the on-screen A4 sheet edge-to-edge on the PDF page. */
  const marginMm = options.marginMm ?? 0
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  })

  const pageWidth = 210
  const pageHeight = 297
  const printableWidth = pageWidth - marginMm * 2
  const printableHeight = pageHeight - marginMm * 2

  const pageElements = Array.from(element.querySelectorAll<HTMLElement>("[data-pdf-page='true']"))
  const targets = pageElements.length > 0 ? pageElements : [element]

  for (let index = 0; index < targets.length; index += 1) {
    const target = targets[index]
    const clone = target.cloneNode(true) as HTMLElement
    clone.style.cssText = [
      "position:fixed",
      "left:-10000px",
      "top:0",
      `width:${A4_WIDTH_PX}px`,
      `height:${A4_HEIGHT_PX}px`,
      "margin:0",
      "padding:0",
      "background:#ffffff",
      "overflow:visible",
      "z-index:-1",
      "pointer-events:none",
    ].join(";")

    document.body.appendChild(clone)

    let canvas: HTMLCanvasElement
    try {
      if (document.fonts?.ready) {
        await document.fonts.ready
      }
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve())
      })
      canvas = await renderCanvasSafe(clone)
    } finally {
      document.body.removeChild(clone)
    }

    const imgData = canvas.toDataURL("image/png")
    const imageRatio = canvas.width / canvas.height
    const pageRatio = pageWidth / pageHeight
    const captureRatio = A4_WIDTH_PX / A4_HEIGHT_PX
    const matchesA4Page =
      Math.abs(imageRatio - captureRatio) < 0.02 || Math.abs(imageRatio - pageRatio) < 0.02

    let renderWidth = printableWidth
    let renderHeight = printableHeight
    let x = marginMm
    let y = marginMm

    if (!matchesA4Page) {
      renderHeight = printableWidth / imageRatio
      if (renderHeight > printableHeight) {
        renderHeight = printableHeight
        renderWidth = printableHeight * imageRatio
      } else {
        renderWidth = printableWidth
      }
      x = marginMm + (printableWidth - renderWidth) / 2
      y = marginMm + (printableHeight - renderHeight) / 2
    }

    if (index > 0) {
      pdf.addPage()
    }

    pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight, undefined, "FAST")
  }

  pdf.save(options.fileName)
}
