import type { MetadataRoute } from "next";

const BASE = "https://hair2harvest-commercial-website.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/system`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/network`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/impact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/partner`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
}
