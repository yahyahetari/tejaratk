import site from "@/config/site";

export function buildMetadata({ title, description, path = "/", image, noIndex = false } = {}) {
  const metaTitle = title ? `${title} | ${site.name}` : site.name;
  const metaDescription = description || site.description;
  const url = new URL(path, site.url).toString();
  const ogImage = image || site.ogImage;

  return {
    metadataBase: new URL(site.url),
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      title: metaTitle,
      description: metaDescription,
      siteName: site.name,
      locale: site.locale,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: site.twitter.card,
      site: site.twitter.handle,
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  };
}
