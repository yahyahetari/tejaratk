// config/plans.js - تكوين باقات الاشتراك (نفس البيانات من مكون Pricing)

export const plans = [
  {
    id: 'BASIC',
    name: 'الباقة الأساسية',
    nameEn: 'Basic Plan',
    monthlyPrice: 49,
    annualPrice: 490,
    iconName: 'ShoppingCart', // اسم الأيقونة كـ string
    iconBg: 'from-cyan-400 via-cyan-500 to-blue-500',
    glowColor: 'cyan',
    description: 'مثالية للمتاجر الصغيرة',
    subtitle: 'ابدأ رحلتك في التجارة الإلكترونية',
    popular: false,
    features: [
      'قالب جاهز احترافي ✨',
      '50 منتج 📦',
      'استضافة سريعة وآمنة ⚡',
      'شهادة SSL مجانية 🔒',
      'دعم فني متواصل 💬',
    ],
    allFeatures: [
      { text: 'قالب جاهز احترافي', highlight: false, icon: '✨' },
      { text: '50 منتج', highlight: true, icon: '📦' },
      { text: 'استضافة سريعة وآمنة', highlight: false, icon: '⚡' },
      { text: 'شهادة SSL مجانية', highlight: false, icon: '🔒' },
      { text: 'دعم فني متواصل', highlight: false, icon: '💬' },
      { text: 'ذكاء اصطناعي لتوصيف المنتجات', highlight: true, icon: '🤖' },
      { text: 'تحسين محركات البحث SEO', highlight: false, icon: '🎯' },
      { text: 'إدارة للطلبات', highlight: false, icon: '📊' },
      { text: 'تكامل بوابة الدفع الإلكتروني', highlight: false, icon: '💳' },
      { text: 'لوحة تحكم لإدارة المتجر', highlight: false, icon: '🎛️' },
    ],
    unavailableFeatures: [
      { text: 'تصميم مخصص', icon: '🎨' },
    ],
    buttonText: 'ابدأ الآن',
    buttonGradient: 'from-cyan-500 via-blue-500 to-blue-600',
    limits: {
      products: 50,
      storage: '5GB',
      bandwidth: '50GB',
    },
    paddleProductId: null,
    paddlePriceId: {
      monthly: null,
      annual: null,
    }
  },
  {
    id: 'PREMIUM',
    name: 'الباقة الاحترافية',
    nameEn: 'Premium Plan',
    monthlyPrice: 99,
    annualPrice: 999,
    iconName: 'Crown',
    iconBg: 'from-blue-500 via-indigo-500 to-purple-600',
    glowColor: 'blue',
    description: 'الأنسب للمتاجر المتوسطة',
    subtitle: 'حلول متقدمة لنمو أسرع',
    popular: true,
    features: [
      'كل مميزات الباقة الأساسية ✅',
      '200 منتج 📦',
      'تصميم احترافي مخصص 🎨',
      'استضافة فائقة السرعة 🚀',
      'بوابة دفع متكاملة 💰',
    ],
    allFeatures: [
      { text: 'كل مميزات الباقة الأساسية', highlight: false, icon: '✅' },
      { text: '200 منتج', highlight: true, icon: '📦' },
      { text: 'تصميم احترافي مخصص', highlight: true, icon: '🎨' },
      { text: 'استضافة فائقة السرعة', highlight: false, icon: '🚀' },
      { text: 'بوابة دفع متكاملة', highlight: false, icon: '💰' },
      { text: 'تحسين SEO متقدم', highlight: true, icon: '📈' },
      { text: 'إدارة مخزون ذكية', highlight: true, icon: '🧠' },
      { text: 'إشعارات بريد إلكتروني تلقائية', highlight: true, icon: '📧' },
    ],
    buttonText: 'ابدأ الآن',
    buttonGradient: 'from-blue-600 via-indigo-600 to-purple-600',
    limits: {
      products: 200,
      storage: '20GB',
      bandwidth: '200GB',
    },
    paddleProductId: null,
    paddlePriceId: {
      monthly: null,
      annual: null,
    }
  },
  {
    id: 'ENTERPRISE',
    name: 'باقة الشركات',
    nameEn: 'Enterprise Plan',
    monthlyPrice: 999,
    annualPrice: 9999,
    iconName: 'Star',
    iconBg: 'from-orange-500 via-red-500 to-pink-600',
    glowColor: 'orange',
    description: 'للمتاجر الكبيرة والشركات',
    subtitle: 'حلول enterprise متكاملة',
    popular: false,
    features: [
      'كل مميزات الباقة الاحترافية ✅',
      '3000 منتج 📦',
      'تصميم مخصص بالكامل 🎨',
      'استضافة مخصصة عالية الأداء ⚡',
      'دعم فني VIP على مدار الساعة 👑',
    ],
    allFeatures: [
      { text: 'كل مميزات الباقة الاحترافية', highlight: false, icon: '✅' },
      { text: '3000 منتج', highlight: true, icon: '📦' },
      { text: 'تصميم مخصص بالكامل', highlight: true, icon: '🎨' },
      { text: 'استضافة مخصصة عالية الأداء', highlight: true, icon: '⚡' },
      { text: 'ذكاء اصطناعي متقدم', highlight: true, icon: '🤖' },
      { text: 'دعم فني VIP على مدار الساعة', highlight: true, icon: '👑' },
      { text: 'تقارير وتحليلات مخصصة', highlight: false, icon: '📊' },
      { text: 'أولوية في التحديثات', highlight: false, icon: '🚀' },
    ],
    buttonText: 'تواصل معنا',
    buttonGradient: 'from-orange-600 via-red-600 to-pink-600',
    limits: {
      products: 3000,
      storage: 'Unlimited',
      bandwidth: 'Unlimited',
    },
    paddleProductId: null,
    paddlePriceId: {
      monthly: null,
      annual: null,
    }
  },
];

// دالة مساعدة للحصول على باقة معينة بالـ ID
export function getPlanById(planId) {
  return plans.find(plan => plan.id === planId);
}

// دالة مساعدة لحساب المدخرات عند الاشتراك السنوي
export function calculateSavings(monthlyPrice, annualPrice) {
  const annualTotal = monthlyPrice * 12;
  return Math.round(annualTotal - annualPrice);
}

// دالة مساعدة لحساب السعر الشهري للاشتراك السنوي
export function getMonthlyPriceForAnnual(annualPrice) {
  return Math.round(annualPrice / 12);
}

// دالة للحصول على السعر حسب نوع الفترة
export function getPlanPrice(plan, isAnnual = false) {
  return isAnnual ? plan.annualPrice : plan.monthlyPrice;
}

// تصدير الثوابت
export const PLAN_TYPES = {
  BASIC: 'BASIC',
  PREMIUM: 'PREMIUM',
  ENTERPRISE: 'ENTERPRISE',
};

export const BILLING_CYCLES = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
};

export default plans;
// فترة السماح بالأيام
export const GRACE_PERIOD_DAYS = 7;

// تصديرات إضافية للتوافق
export const PLANS = plans;
export const getAllPlans = () => plans;

// الخصومات
export const DISCOUNTS = {
  ANNUAL: 0.17, // خصم 17% للاشتراك السنوي
  FIRST_MONTH: 0, // لا يوجد خصم للشهر الأول
};
