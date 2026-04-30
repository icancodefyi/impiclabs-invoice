import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Impic Invoice Studio",
    short_name: "Invoice Studio",
    description: "Impic Labs internal invoice generator",
    start_url: "/invoice",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6C5CE7",
    icons: [
      {
        src: "/assets/logowbg.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/logowbg.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
