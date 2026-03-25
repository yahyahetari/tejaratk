import site from "@/config/site";

export default function sitemap() {
  const now = new Date().toISOString();

  // الصفحات الرئيسية (أعلى أولوية)
  const mainPages = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/features", priority: 0.9, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  ];

  // صفحات المعلومات
  const infoPages = [
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/help", priority: 0.6, changeFrequency: "weekly" },
  ];

  // صفحات قانونية
  const legalPages = [
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  ];

  // صفحات التسجيل
  const authPages = [
    { path: "/login", priority: 0.5, changeFrequency: "monthly" },
    { path: "/register", priority: 0.8, changeFrequency: "monthly" },
  ];

  const allPages = [...mainPages, ...infoPages, ...legalPages, ...authPages];

  return allPages.map(({ path, priority, changeFrequency }) => ({
    url: new URL(path, site.url).toString(),
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
