/** A4 at 96 CSS px/in — stable capture size independent of viewport (210×297 mm). */
export const A4_WIDTH_PX = Math.round((210 / 25.4) * 96)
export const A4_HEIGHT_PX = Math.round((297 / 25.4) * 96)

export const A4_MM = { width: 210, height: 297 } as const
