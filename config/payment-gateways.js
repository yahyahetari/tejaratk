// config/payment-gateways.js

export const paymentGateways = [
  {
    id: 'tap',
    name: 'Tap Payments',
    nameAr: 'تاب للمدفوعات',
    description: 'بوابة دفع شاملة للشرق الأوسط',
    logo: '/images/gateways/tap.png',
    enabled: true,
    popular: true,
    countries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
    currencies: ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'],
    features: ['بطاقات ائتمانية', 'Apple Pay', 'مدى', 'STC Pay', 'تقسيط'],
    setupFields: [
      { name: 'publicKey', label: 'المفتاح العام', type: 'text', required: true },
      { name: 'secretKey', label: 'المفتاح السري', type: 'password', required: true },
    ]
  },
  {
    id: 'stripe',
    name: 'Stripe',
    nameAr: 'سترايب',
    description: 'بوابة دفع عالمية',
    logo: '/images/gateways/stripe.png',
    enabled: true,
    popular: true,
    countries: ['*'], // جميع الدول
    currencies: ['SAR', 'AED', 'USD', 'EUR', 'GBP'],
    features: ['بطاقات ائتمانية', 'Apple Pay', 'Google Pay', 'تقسيط'],
    setupFields: [
      { name: 'publishableKey', label: 'المفتاح القابل للنشر', type: 'text', required: true },
      { name: 'secretKey', label: 'المفتاح السري', type: 'password', required: true },
    ]
  },
  {
    id: 'paypal',
    name: 'PayPal',
    nameAr: 'باي بال',
    description: 'بوابة دفع عالمية',
    logo: '/images/gateways/paypal.png',
    enabled: true,
    popular: false,
    countries: ['*'],
    currencies: ['USD', 'EUR', 'GBP', 'SAR', 'AED'],
    features: ['حساب PayPal', 'بطاقات ائتمانية'],
    setupFields: [
      { name: 'clientId', label: 'معرف العميل', type: 'text', required: true },
      { name: 'clientSecret', label: 'السر', type: 'password', required: true },
      { name: 'mode', label: 'الوضع', type: 'select', options: [
        { value: 'sandbox', label: 'Sandbox' },
        { value: 'live', label: 'مباشر' }
      ], required: true },
    ]
  },
  {
    id: 'moyasar',
    name: 'Moyasar',
    nameAr: 'ميسر',
    description: 'بوابة دفع سعودية',
    logo: '/images/gateways/moyasar.png',
    enabled: true,
    popular: false,
    countries: ['SA'],
    currencies: ['SAR'],
    features: ['بطاقات ائتمانية', 'Apple Pay', 'مدى', 'STC Pay'],
    setupFields: [
      { name: 'apiKey', label: 'مفتاح API', type: 'password', required: true },
    ]
  },
  {
    id: 'paytabs',
    name: 'PayTabs',
    nameAr: 'باي تابس',
    description: 'بوابة دفع للشرق الأوسط',
    logo: '/images/gateways/paytabs.png',
    enabled: true,
    popular: false,
    countries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'EG', 'JO'],
    currencies: ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR', 'EGP', 'JOD'],
    features: ['بطاقات ائتمانية', 'Apple Pay', 'مدى'],
    setupFields: [
      { name: 'profileId', label: 'معرف الملف الشخصي', type: 'text', required: true },
      { name: 'serverKey', label: 'مفتاح الخادم', type: 'password', required: true },
    ]
  },
  {
    id: 'hyperpay',
    name: 'HyperPay',
    nameAr: 'هايبر باي',
    description: 'بوابة دفع للشرق الأوسط',
    logo: '/images/gateways/hyperpay.png',
    enabled: true,
    popular: false,
    countries: ['SA', 'AE', 'EG', 'JO'],
    currencies: ['SAR', 'AED', 'EGP', 'JOD'],
    features: ['بطاقات ائتمانية', 'Apple Pay', 'مدى'],
    setupFields: [
      { name: 'entityId', label: 'معرف الكيان', type: 'text', required: true },
      { name: 'accessToken', label: 'رمز الوصول', type: 'password', required: true },
    ]
  },
];

export const getGatewayById = (id) => {
  return paymentGateways.find(gateway => gateway.id === id);
};

export const getGatewayName = (id) => {
  const gateway = getGatewayById(id);
  return gateway ? gateway.nameAr : id;
};

export const getPopularGateways = () => {
  return paymentGateways.filter(gateway => gateway.popular);
};

export const getGatewaysByCountry = (countryCode) => {
  return paymentGateways.filter(gateway => 
    gateway.countries.includes('*') || gateway.countries.includes(countryCode)
  );
};

export const getGatewaysByCurrency = (currency) => {
  return paymentGateways.filter(gateway => 
    gateway.currencies.includes(currency)
  );
};
