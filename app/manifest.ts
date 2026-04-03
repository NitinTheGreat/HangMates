import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HangMates",
    short_name: "HangMates",
    description: "Never Hang Alone — Rent friends for any occasion",
    start_url: "/home",
    display: "standalone",
    background_color: "#0F0F1A",
    theme_color: "#0F0F1A",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
