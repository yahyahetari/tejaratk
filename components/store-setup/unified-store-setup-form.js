'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Store,
  User,
  Mail,
  Phone,
  FileText,
  CreditCard,
  Palette,
  Upload,
  Check,
  Loader2,
  Save,
  Shield,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

/**
 * مكون القسم القابل للطي - مُعرّف خارج المكون الرئيسي لمنع فقدان التركيز
 */
function Section({ id, icon: Icon, title, description, children, badge, isExpanded, onToggle }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              {badge && (
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-100 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * نموذج إعداد المتجر الموحد - جميع الخطوات في صفحة واحدة
 */
export default function UnifiedStoreSetupForm({ merchantId, initialData = {}, isUpdate = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // حالة الأقسام المفتوحة/المغلقة
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    license: false,
    payment: false,
    store: false,
    brand: false
  });

  // بيانات النموذج
  const [formData, setFormData] = useState({
    // المعلومات الأساسية
    fullName: initialData.fullName || '',
    brandName: initialData.brandName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',

    // الترخيص
    hasLicense: initialData.hasLicense || false,
    licenseNumber: initialData.licenseNumber || '',
    country: initialData.country || '',

    // بوابات الدفع
    paymentGateways: initialData.paymentGateways || [],
    gatewayConfigs: initialData.gatewayConfigs || {},

    // إعدادات المتجر
    address: initialData.address || '',
    city: initialData.city || '',
    currency: initialData.currency || 'SAR',
    taxRate: initialData.taxRate || 0,
    shippingCost: initialData.shippingCost || 0,

    // الهوية البصرية
    logo: initialData.logo || '',
    primaryColor: initialData.primaryColor || '#3B82F6',
    secondaryColor: initialData.secondaryColor || '#10B981'
  });

  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(initialData.logo || null);
  const [savedData, setSavedData] = useState({ ...formData });

  // هل تم تعديل البيانات؟
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(savedData);

  // بوابات الدفع المتاحة
  const paymentGateways = [
    { id: 'moyasar', nameAr: 'مُيسر', description: 'بوابة دفع سعودية', recommended: true },
    { id: 'tap', nameAr: 'تاب', description: 'بوابة دفع خليجية', popular: true },
    { id: 'paypal', nameAr: 'باي بال', description: 'دفع عالمي' },
    { id: 'stripe', nameAr: 'سترايب', description: 'دفع دولي' },
    { id: 'cod', nameAr: 'الدفع عند الاستلام', description: 'نقداً عند التسليم' }
  ];

  // الألوان الجاهزة
  const colorPresets = [
    { name: 'أزرق', primary: '#3B82F6', secondary: '#10B981' },
    { name: 'أخضر', primary: '#10B981', secondary: '#3B82F6' },
    { name: 'بنفسجي', primary: '#8B5CF6', secondary: '#EC4899' },
    { name: 'برتقالي', primary: '#F97316', secondary: '#EAB308' },
    { name: 'أحمر', primary: '#EF4444', secondary: '#F59E0B' },
    { name: 'رمادي', primary: '#6B7280', secondary: '#3B82F6' }
  ];

  // الدول
  const countries = [
    { code: 'SA', nameAr: 'السعودية', flag: '🇸🇦' },
    { code: 'AE', nameAr: 'الإمارات', flag: '🇦🇪' },
    { code: 'KW', nameAr: 'الكويت', flag: '🇰🇼' },
    { code: 'BH', nameAr: 'البحرين', flag: '🇧🇭' },
    { code: 'QA', nameAr: 'قطر', flag: '🇶🇦' },
    { code: 'OM', nameAr: 'عمان', flag: '🇴🇲' },
    { code: 'EG', nameAr: 'مصر', flag: '🇪🇬' },
    { code: 'JO', nameAr: 'الأردن', flag: '🇯🇴' }
  ];

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
    setError('');
  }, []);

  const togglePaymentGateway = useCallback((gatewayId) => {
    setFormData(prev => {
      const gateways = prev.paymentGateways.includes(gatewayId)
        ? prev.paymentGateways.filter(id => id !== gatewayId)
        : [...prev.paymentGateways, gatewayId];
      return { ...prev, paymentGateways: gateways };
    });
  }, []);

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('حجم الملف يجب أن يكون أقل من 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    }

    if (!formData.brandName.trim()) {
      newErrors.brandName = 'اسم العلامة التجارية مطلوب';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    }

    if (formData.hasLicense && !formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'رقم الترخيص مطلوب';
    }

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validate();
    if (!isValid) {
      // تحديد أول حقل به خطأ وتوسيع القسم الخاص به
      const errorFields = Object.keys(validationErrors);
      if (errorFields.length > 0) {
        const firstErrorField = errorFields[0];

        // خريطة الحقول للأقسام
        const fieldToSection = {
          fullName: 'basic',
          brandName: 'basic',
          email: 'basic',
          phone: 'basic',
          licenseNumber: 'license'
        };

        const sectionToExpand = fieldToSection[firstErrorField];
        if (sectionToExpand) {
          setExpandedSections(prev => ({ ...prev, [sectionToExpand]: true }));

          // التمرير إلى الحقل بعد وقت قصير للتأكد من توسيع القسم
          setTimeout(() => {
            const element = document.getElementsByName(firstErrorField)[0] ||
              document.getElementById(firstErrorField) ||
              document.querySelector(`[data-field="${firstErrorField}"]`);
            if (element) {
              // التمرير ليكون الحقل في المنتصف العلوي قليلاً
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });

              // وضع مؤشر الكتابة
              element.focus();

              // تأكيد إضافي لرفع السكرول قليلاً لو كان في الأسفل
              if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
                element.style.outline = '2px solid #3B82F6';
                setTimeout(() => {
                  element.style.outline = '';
                }, 2000);
              }
            }
          }, 300);
        }
      }
      return;
    }

    // ✅ تحديث متفائل: عرض النجاح فوراً وإخفاء الزر
    setSavedData({ ...formData });
    setSuccess(true);
    setError('');
    setLoading(false);

    // إرسال الشعار فقط إذا تغيّر
    const dataToSend = { ...formData, merchantId };
    if (formData.logo === initialData.logo) {
      delete dataToSend.logo;
    }

    // حفظ في الخلفية
    fetch('/api/store-setup', {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        setSuccess(false);
        setSavedData(prev => prev); // إرجاع الحالة السابقة
        setError(data.error || 'حدث خطأ أثناء الحفظ - يرجى المحاولة مرة أخرى');
      }
    }).catch(() => {
      setSuccess(false);
      setError('فشل الاتصال بالخادم - يرجى المحاولة مرة أخرى');
    });

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30 mb-4">
          <Store className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          {isUpdate ? 'تحديث إعدادات المتجر' : 'إعداد متجرك الإلكتروني'}
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          أكمل المعلومات التالية لإعداد متجرك. يمكنك تعديل هذه المعلومات لاحقاً.
        </p>
      </div>

      {/* رسائل النجاح والخطأ */}
      {success && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <Check className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-emerald-800">تم الحفظ بنجاح!</p>
            <p className="text-sm text-emerald-600">تم حفظ جميع معلومات متجرك</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-red-800">حدث خطأ</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* القسم 1: المعلومات الأساسية */}
        <Section
          id="basic"
          icon={User}
          title="المعلومات الأساسية"
          description="معلوماتك الشخصية ومعلومات المتجر"
          isExpanded={expandedSections.basic}
          onToggle={toggleSection}
        >
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {/* الاسم الكامل */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                placeholder="أدخل اسمك الكامل"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={`input-premium ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
            </div>

            {/* اسم العلامة التجارية */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Store className="h-4 w-4 text-gray-400" />
                اسم المتجر / العلامة التجارية <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="brandName"
                id="brandName"
                placeholder="اسم متجرك أو علامتك التجارية"
                value={formData.brandName}
                onChange={(e) => handleChange('brandName', e.target.value)}
                className={`input-premium ${errors.brandName ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.brandName && <p className="text-sm text-red-500">{errors.brandName}</p>}
            </div>

            {/* البريد الإلكتروني */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="input-premium bg-gray-100 text-gray-500 cursor-not-allowed"
                dir="ltr"
              />
              <p className="text-xs text-gray-400">لا يمكن تعديل البريد الإلكتروني</p>
            </div>

            {/* رقم الهاتف */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="+966 5X XXX XXXX"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`input-premium ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                dir="ltr"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
          </div>
        </Section>

        {/* القسم 2: الترخيص التجاري */}
        <Section
          id="license"
          icon={FileText}
          title="الترخيص التجاري"
          description="معلومات الترخيص التجاري (اختياري)"
          badge="اختياري"
          isExpanded={expandedSections.license}
          onToggle={toggleSection}
        >
          <div className="space-y-6 mt-4">
            {/* هل يوجد ترخيص */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleChange('hasLicense', true)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${formData.hasLicense
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <Check className={`h-5 w-5 mx-auto mb-2 ${formData.hasLicense ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-semibold">نعم، لدي ترخيص</span>
              </button>
              <button
                type="button"
                onClick={() => handleChange('hasLicense', false)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${!formData.hasLicense
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <span className="font-semibold">لا، ليس لدي ترخيص</span>
              </button>
            </div>

            {formData.hasLicense && (
              <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    رقم الترخيص <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    id="licenseNumber"
                    placeholder="أدخل رقم الترخيص التجاري"
                    value={formData.licenseNumber}
                    onChange={(e) => handleChange('licenseNumber', e.target.value)}
                    className={`input-premium ${errors.licenseNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.licenseNumber && <p className="text-sm text-red-500">{errors.licenseNumber}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    الدولة
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="input-premium"
                  >
                    <option value="">اختر الدولة</option>
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>ملاحظة:</strong> الترخيص التجاري يساعد في زيادة مصداقية متجرك والحصول على مميزات إضافية.
              </p>
            </div>
          </div>
        </Section>

        {/* القسم 3: بوابات الدفع */}
        <Section
          id="payment"
          icon={CreditCard}
          title="بوابات الدفع"
          description="اختر طرق الدفع المتاحة في متجرك"
          badge="اختياري"
          isExpanded={expandedSections.payment}
          onToggle={toggleSection}
        >
          <div className="space-y-4 mt-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {paymentGateways.map(gateway => {
                const isSelected = formData.paymentGateways.includes(gateway.id);
                return (
                  <button
                    key={gateway.id}
                    type="button"
                    onClick={() => togglePaymentGateway(gateway.id)}
                    className={`p-4 rounded-xl border-2 text-right transition-all ${isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{gateway.nameAr}</span>
                          {gateway.recommended && (
                            <span className="px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded">موصى به</span>
                          )}
                          {gateway.popular && (
                            <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">شائع</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{gateway.description}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                        {isSelected && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {formData.paymentGateways.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-sm text-emerald-800">
                  <strong>تم اختيار {formData.paymentGateways.length} بوابة دفع.</strong> يمكنك إعداد مفاتيح API لاحقاً من الإعدادات.
                </p>
              </div>
            )}
          </div>
        </Section>

        {/* القسم 4: إعدادات المتجر */}
        <Section
          id="store"
          icon={Store}
          title="إعدادات المتجر"
          description="العنوان والعملة والضريبة والشحن"
          badge="اختياري"
          isExpanded={expandedSections.store}
          onToggle={toggleSection}
        >
          <div className="space-y-6 mt-4">
            {/* العنوان والمدينة */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  📍 العنوان
                </label>
                <input
                  type="text"
                  placeholder="مثال: شارع الملك فهد، حي الورود"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="input-premium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  🏙️ المدينة
                </label>
                <input
                  type="text"
                  placeholder="مثال: الرياض"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="input-premium"
                />
              </div>
            </div>

            {/* العملة */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                💰 العملة
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="input-premium"
              >
                <option value="SAR">🇸🇦 ريال سعودي (SAR)</option>
                <option value="AED">🇦🇪 درهم إماراتي (AED)</option>
                <option value="KWD">🇰🇼 دينار كويتي (KWD)</option>
                <option value="BHD">🇧🇭 دينار بحريني (BHD)</option>
                <option value="QAR">🇶🇦 ريال قطري (QAR)</option>
                <option value="OMR">🇴🇲 ريال عماني (OMR)</option>
                <option value="EGP">🇪🇬 جنيه مصري (EGP)</option>
                <option value="JOD">🇯🇴 دينار أردني (JOD)</option>
                <option value="YER">🇾🇪 ريال يمني (YER)</option>
                <option value="USD">🇺🇸 دولار أمريكي (USD)</option>
                <option value="EUR">🇪🇺 يورو (EUR)</option>
              </select>
            </div>

            {/* الضريبة والشحن */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  🧾 نسبة الضريبة (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={formData.taxRate}
                  onChange={(e) => handleChange('taxRate', e.target.value)}
                  className="input-premium"
                  dir="ltr"
                />
                <p className="text-xs text-gray-400">مثال: 15 للضريبة 15%</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  🚚 تكلفة الشحن الافتراضية
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  value={formData.shippingCost}
                  onChange={(e) => handleChange('shippingCost', e.target.value)}
                  className="input-premium"
                  dir="ltr"
                />
                <p className="text-xs text-gray-400">بالعملة المختارة، 0 = شحن مجاني</p>
              </div>
            </div>
          </div>
        </Section>

        {/* القسم 5: الهوية البصرية */}
        <Section
          id="brand"
          icon={Palette}
          title="الهوية البصرية"
          description="الشعار والألوان الخاصة بمتجرك"
          badge="اختياري"
          isExpanded={expandedSections.brand}
          onToggle={toggleSection}
        >
          <div className="space-y-6 mt-4">
            {/* رفع الشعار */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">شعار المتجر</label>
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                    <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-gray-700">اضغط لرفع الشعار</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG (حتى 2MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">معاينة الشعار</label>
                <div className="border-2 border-gray-200 rounded-xl p-8 h-[168px] flex items-center justify-center bg-gray-50">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">معاينة الشعار</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* الألوان */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">ألوان العلامة التجارية</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, primaryColor: preset.primary, secondaryColor: preset.secondary }));
                    }}
                    className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${formData.primaryColor === preset.primary
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200'
                      }`}
                  >
                    <div className="flex gap-1 mb-2 justify-center">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.primary }} />
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.secondary }} />
                    </div>
                    <p className="text-xs text-gray-600">{preset.name}</p>
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">اللون الأساسي</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="h-10 w-16 rounded-lg border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">اللون الثانوي</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="h-10 w-16 rounded-lg border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* زر الحفظ */}
        {(hasChanges || success || error) && (
          <div className="sticky bottom-4 z-10 animate-fade-in">
            <div className={`backdrop-blur-lg rounded-2xl border shadow-xl p-4 transition-colors ${success ? 'bg-emerald-50/90 border-emerald-200' : error ? 'bg-red-50/90 border-red-200' : 'bg-white/80 border-gray-200'}`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {success ? (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Check className="h-5 w-5" />
                      <span className="text-sm font-bold">تم الحفظ بنجاح! ✅</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-sm font-bold">{error}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-amber-600">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-sm font-bold">لديك تغييرات غير محفوظة</span>
                    </div>
                  )}
                </div>
                {hasChanges && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto btn-primary px-8 py-3 text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    <span>{isUpdate ? 'حفظ التغييرات' : 'حفظ وإنشاء المتجر'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
