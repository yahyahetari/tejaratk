import site from "@/config/site";

/**
 * Schema.org - المنظمة
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: site.nameEn,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/images/logo.png`,
      width: 512,
      height: 512,
    },
    email: site.contact.email,
    contactPoint: {
      "@type": "ContactPoint",
      email: site.contact.email,
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
    },
    sameAs: Object.values(site.social).filter(Boolean),
    description: site.description,
  };
}

/**
 * Schema.org - الموقع
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    alternateName: site.nameEn,
    url: site.url,
    description: site.description,
    inLanguage: "ar",
    publisher: { "@id": `${site.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/help?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Schema.org - تطبيق SaaS
 */
export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    alternateName: site.nameEn,
    description: site.description,
    url: site.url,
    applicationCategory: site.applicationCategory,
    operatingSystem: "Web",
    offers: site.pricing.plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.price,
      priceCurrency: site.pricing.currency,
      availability: "https://schema.org/InStock",
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      ratingCount: site.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    featureList: site.features.join(", "),
    screenshot: `${site.url}/images/og.jpg`,
    author: { "@id": `${site.url}/#organization` },
  };
}

/**
 * Schema.org - صفحة ويب
 */
export function webPageSchema({ title, description, path = "/" }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${site.url}${path}/#webpage`,
    url: new URL(path, site.url).toString(),
    name: title || site.name,
    description: description || site.description,
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": `${site.url}/#organization` },
    inLanguage: "ar",
  };
}

/**
 * Schema.org - FAQ
 */
export function faqSchema(questions) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

/**
 * Schema.org - Breadcrumb
 */
export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site.url).toString(),
    })),
  };
}
