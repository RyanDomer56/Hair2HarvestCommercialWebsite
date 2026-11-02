import type { MetadataRoute } from "next";

const BASE = "https://hair2harvest-commercial-website.vercel.app";

/**
 * The operations workspace is deliberately excluded. It is an internal tool
 * with no public entry point; indexing it would only invite the wrong visitors.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/dashboard/", "/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
