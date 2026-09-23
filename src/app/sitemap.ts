import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();

  const routes = [
    { path: "/", priority: 1 },
    { path: "/inventory", priority: 0.95 },
    { path: "/pre-order", priority: 0.85 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
    { path: "/saved", priority: 0.3 },
    { path: "/compare", priority: 0.3 },
  ];

  return routes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changefreq: route.path === "/inventory" ? "daily" : "weekly",
    priority: route.priority,
  }));
}
