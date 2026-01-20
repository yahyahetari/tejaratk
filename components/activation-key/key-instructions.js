'use client';

import { 
  Download, 
  Code, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Settings, 
  Save,
  Rocket,
  Shield,
  Clock,
  RefreshCw,
  BookOpen
} from 'lucide-react';

export default function KeyInstructions() {
  const handleDownloadPDF = () => {
    alert('سيتم تنفيذ تحميل ملف PDF قريباً');
  };

  const steps = [
    {
      step: 1,
      title: 'انسخ كود التفعيل',
      description: 'اضغط على زر "نسخ" لنسخ كود التفعيل الكامل إلى الحافظة.',
      icon: Copy,
    },
    {
      step: 2,
      title: 'افتح لوحة تحكم متجرك',
      description: 'انتقل إلى لوحة تحكم نظام المتجر الخاص بك (النظام الخارجي).',
      icon: Settings,
    },
    {
      step: 3,
      title: 'أدخل الكود في الإعدادات',
      description: 'ابحث عن قسم "إعدادات تجارتك" أو "Activation Key" وألصق الكود.',
      icon: Code,
    },
    {
      step: 4,
      title: 'احفظ وفعّل',
      description: 'اضغط على "حفظ" أو "تفعيل" لربط متجرك بحسابك في تجارتك.',
      icon: Save,
    },
  ];

  const tips = [
    {
      icon: Shield,
      title: 'الكود آمن',
      description: 'لا تشارك كود التفعيل مع أي شخص. هذا الكود خاص بمتجرك فقط.',
      type: 'success',
    },
    {
      icon: Clock,
      title: 'صالح حتى انتهاء الاشتراك',
      description: 'الكود يعمل طالما اشتراكك نشط.',
      type: 'success',
    },
    {
      icon: RefreshCw,
      title: 'إعادة التوليد',
      description: 'يمكنك إعادة توليد الكود في أي وقت، لكن الكود القديم سيتوقف عن العمل.',
      type: 'warning',
    },
  ];

  return (
    <div className="card-premium overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                تعليمات استخدام كود التفعيل
              </h3>
              <p className="text-gray-500 text-sm">اتبع الخطوات التالية لتفعيل متجرك</p>
            </div>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="btn-secondary flex items-center gap-2 opacity-50 cursor-not-allowed"
            disabled
          >
            <Download className="w-4 h-4" />
            تحميل PDF
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Steps */}
        <div className="space-y-4">
          {steps.map((item, i) => (
            <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                  {item.step}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-blue-600" />
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
          
          {/* Success Step */}
          <div className="flex gap-4 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Rocket className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-emerald-700 mb-1">
                ابدأ البيع! 🚀
              </h4>
              <p className="text-emerald-600 text-sm">
                بعد التفعيل، متجرك جاهز لاستقبال الطلبات والمبيعات.
              </p>
            </div>
          </div>
        </div>

        {/* API Section */}
        <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Code className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-2">
                للمطورين: API للتحقق من الكود
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                يمكنك التحقق من صحة الكود برمجياً باستخدام API:
              </p>
              <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                <code className="text-sm text-emerald-400 font-mono" dir="ltr">
                  <span className="text-blue-400">POST</span> https://api.tejaratk.com/api/activation-key/verify
                  <br />
                  <span className="text-gray-500">{'{'}</span>
                  <span className="text-amber-400"> &quot;key&quot;</span>: <span className="text-emerald-400">&quot;TEJRTK-XXXX-XXXX-XXXX-XXXX-XXXX&quot;</span>
                  <span className="text-gray-500"> {'}'}</span>
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div 
              key={i} 
              className={`flex gap-3 items-start p-4 rounded-xl ${
                tip.type === 'success' 
                  ? 'bg-emerald-50 border border-emerald-200' 
                  : 'bg-amber-50 border border-amber-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                tip.type === 'success' ? 'bg-emerald-100' : 'bg-amber-100'
              }`}>
                <tip.icon className={`w-4 h-4 ${
                  tip.type === 'success' ? 'text-emerald-600' : 'text-amber-600'
                }`} />
              </div>
              <div>
                <strong className="text-gray-900 block mb-0.5">{tip.title}</strong>
                <span className="text-sm text-gray-600">{tip.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
