import site from "@/config/site";

/**
 * بناء metadata احترافي لأي صفحة
 */
export function buildMetadata({ title, description, path = "/", image, noIndex = false, keywords = [], type = "website", article = null } = {}) {
  const metaTitle = title ? `${title} | ${site.name}` : `${site.name} - ${site.tagline}`;
  const metaDescription = description || site.description;
  const url = new URL(path, site.url).toString();
  const ogImage = image || site.ogImage;
  const allKeywords = [...new Set([...site.keywords, ...keywords])].join(", ");

  const metadata = {
    metadataBase: new URL(site.url),
    title: metaTitle,
    description: metaDescription,
    keywords: allKeywords,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    applicationName: site.name,
    category: "e-commerce",
    alternates: {
      canonical: url,
      languages: {
        "ar-SA": url,
      },
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    openGraph: {
      type: type,
      url,
      title: metaTitle,
      description: metaDescription,
      siteName: site.name,
      locale: site.locale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
          type: "image/jpeg",
        },
      ],
      ...(article && {
        publishedTime: article.publishedTime,
        modifiedTime: article.modifiedTime,
        authors: [site.url],
        tags: article.tags,
      }),
    },
    twitter: {
      card: site.twitter.card,
      site: site.twitter.handle,
      creator: site.twitter.handle,
      title: metaTitle,
      description: metaDescription,
      images: {
        url: ogImage,
        alt: metaTitle,
      },
    },
    verification: {
      // أضف الأكواد عند التسجيل
      // google: "your-google-verification-code",
      // yandex: "your-yandex-verification-code",
    },
    other: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "apple-mobile-web-app-title": site.shortName,
      "mobile-web-app-capable": "yes",
      "msapplication-TileColor": "#3B82F6",
      "theme-color": "#3B82F6",
    },
  };

  return metadata;
}

/**
 * بناء metadata لصفحات المنتجات أو المقالات
 */
export function buildArticleMetadata({ title, description, path, image, publishedTime, tags = [] }) {
  return buildMetadata({
    title,
    description,
    path,
    image,
    type: "article",
    article: {
      publishedTime,
      modifiedTime: new Date().toISOString(),
      tags,
    },
  });
}
