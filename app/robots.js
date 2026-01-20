import site from "@/config/site";

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/dashboard", "/admin", "/account", "/subscription"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
