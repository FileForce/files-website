import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "file FORCE",
    short_name: "file FORCE",
    description: "The free, fast file manager for macOS, Windows and Linux.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b14",
    theme_color: "#4338ca",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
