const site = {
  name: "تجارتك",
  nameEn: "Tejaratk",
  shortName: "تجارتك",
  tagline: "أنشئ متجرك الإلكتروني في دقائق",
  description: "تجارتك هي المنصة العربية الأولى لإنشاء وإدارة المتاجر الإلكترونية. ابدأ البيع أونلاين بدون خبرة تقنية مع بوابات دفع متعددة وتصاميم احترافية ولوحة تحكم ذكية.",
  descriptionEn: "Tejaratk is the leading Arabic e-commerce platform for creating and managing online stores. Start selling online with no technical experience.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://tejaratk.com",
  ogImage: "/images/og.jpg",
  locale: "ar_SA",
  alternateLocale: "en_US",
  language: "ar",

  // التواصل الاجتماعي
  twitter: { handle: "@tejaratk", card: "summary_large_image" },
  social: {
    twitter: "https://twitter.com/tejaratk",
    instagram: "https://instagram.com/tejaratk",
    linkedin: "https://linkedin.com/company/tejaratk",
  },

  // معلومات الاتصال
  contact: {
    email: "support@tejaratk.com",
    phone: "+966500000000",
  },

  // الكلمات المفتاحية الرئيسية
  keywords: [
    "إنشاء متجر إلكتروني",
    "متجر إلكتروني",
    "منصة تجارة إلكترونية",
    "إنشاء متجر أونلاين",
    "بيع أونلاين",
    "متجر أونلاين",
    "منصة بيع",
    "تجارة إلكترونية",
    "SaaS",
    "e-commerce platform",
    "تجارتك",
    "Tejaratk",
    "إنشاء متجر مجاني",
    "متجر إلكتروني عربي",
    "بوابات دفع إلكترونية",
    "إدارة المتاجر",
    "تصميم متجر إلكتروني",
    "حلول التجارة الإلكترونية",
    "منصة متاجر سعودية",
    "بيع منتجات أونلاين",
  ],

  // فئة التطبيق
  applicationCategory: "BusinessApplication",

  // الأسعار
  pricing: {
    currency: "USD",
    plans: [
      { name: "الباقة الأساسية", price: 49, period: "شهرياً" },
      { name: "الباقة الاحترافية", price: 99, period: "شهرياً" },
      { name: "باقة الشركات", price: 999, period: "شهرياً" },
    ]
  },

  // التقييم
  rating: {
    value: 4.8,
    count: 1250,
  },

  // الميزات الرئيسية
  features: [
    "إنشاء متجر في دقائق",
    "بوابات دفع متعددة",
    "تصاميم احترافية",
    "لوحة تحكم ذكية",
    "دعم اللغة العربية",
    "إدارة المنتجات",
    "تقارير المبيعات",
    "إشعارات فورية",
  ],
};

export default site;
