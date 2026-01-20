// config/countries.js

export const countries = [
  { code: 'SA', name: 'المملكة العربية السعودية', requiresLicense: true },
  { code: 'AE', name: 'الإمارات العربية المتحدة', requiresLicense: true },
  { code: 'KW', name: 'الكويت', requiresLicense: true },
  { code: 'QA', name: 'قطر', requiresLicense: true },
  { code: 'BH', name: 'البحرين', requiresLicense: true },
  { code: 'OM', name: 'عمان', requiresLicense: true },
  { code: 'JO', name: 'الأردن', requiresLicense: true },
  { code: 'EG', name: 'مصر', requiresLicense: true },
  { code: 'LB', name: 'لبنان', requiresLicense: true },
  { code: 'IQ', name: 'العراق', requiresLicense: true },
  { code: 'SY', name: 'سوريا', requiresLicense: false },
  { code: 'YE', name: 'اليمن', requiresLicense: false },
  { code: 'PS', name: 'فلسطين', requiresLicense: false },
  { code: 'MA', name: 'المغرب', requiresLicense: true },
  { code: 'DZ', name: 'الجزائر', requiresLicense: true },
  { code: 'TN', name: 'تونس', requiresLicense: true },
  { code: 'LY', name: 'ليبيا', requiresLicense: false },
  { code: 'SD', name: 'السودان', requiresLicense: false },
  { code: 'SO', name: 'الصومال', requiresLicense: false },
  { code: 'DJ', name: 'جيبوتي', requiresLicense: false },
  { code: 'KM', name: 'جزر القمر', requiresLicense: false },
  { code: 'MR', name: 'موريتانيا', requiresLicense: false },
];

export const getCountryByCode = (code) => {
  return countries.find(country => country.code === code);
};

export const getCountryName = (code) => {
  const country = getCountryByCode(code);
  return country ? country.name : code;
};

export const doesCountryRequireLicense = (code) => {
  const country = getCountryByCode(code);
  return country ? country.requiresLicense : false;
};
