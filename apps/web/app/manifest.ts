import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "WhiteRabbit",
    short_name: "WhiteRabbit",
    description: "Accountable, edge-first public-sector sensing",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F2F5F8",
    theme_color: "#FFFFFF",
    orientation: "any",
    categories: ["utilities", "security", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/maskable-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
