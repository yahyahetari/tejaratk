import site from "@/config/site";

export default function sitemap() {
  const routes = ["/", "/features", "/pricing", "/about", "/contact", "/help", "/terms", "/privacy", "/login", "/register"];
  const now = new Date();
  return routes.map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
