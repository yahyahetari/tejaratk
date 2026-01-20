'use client';

import { useState } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video, 
  Mail, 
  Phone,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Search
} from 'lucide-react';

const faqs = [
  {
    question: 'كيف أبدأ في إعداد متجري؟',
    answer: 'يمكنك البدء بالذهاب إلى صفحة "إعداد المتجر" من القائمة الجانبية. ستجد هناك خطوات واضحة لإضافة معلومات متجرك الأساسية، وتخصيص المظهر، وإعداد طرق الدفع والشحن.'
  },
  {
    question: 'كيف أضيف منتجات جديدة؟',
    answer: 'من لوحة التحكم، اذهب إلى "المنتجات" ثم اضغط على "إضافة منتج جديد". يمكنك إضافة صور المنتج، الوصف، السعر، والمخزون. كما يمكنك استخدام الذكاء الاصطناعي لتحليل صور المنتجات وإنشاء الوصف تلقائياً.'
  },
  {
    question: 'ما هي طرق الدفع المدعومة؟',
    answer: 'ندعم العديد من بوابات الدفع مثل Tap، PayTabs، HyperPay، Moyasar، وغيرها. يمكنك إعداد بوابة الدفع المناسبة لمنطقتك من صفحة إعداد المتجر.'
  },
  {
    question: 'كيف أتابع طلباتي؟',
    answer: 'يمكنك متابعة جميع الطلبات من صفحة "الطلبات" في لوحة التحكم. ستجد هناك قائمة بجميع الطلبات مع حالتها، ويمكنك تحديث حالة كل طلب وإرسال إشعارات للعملاء.'
  },
  {
    question: 'كيف أستخدم كود التفعيل؟',
    answer: 'كود التفعيل هو مفتاح فريد يمكنك استخدامه لربط متجرك مع تطبيقات خارجية أو للتحقق من صحة اشتراكك. يمكنك العثور على كود التفعيل الخاص بك في صفحة "كود التفعيل".'
  },
  {
    question: 'ما الفرق بين الخطط المختلفة؟',
    answer: 'نقدم ثلاث خطط: الأساسية للمتاجر الصغيرة، الاحترافية للمتاجر المتوسطة مع ميزات إضافية مثل التقارير المتقدمة، والمؤسسية للمتاجر الكبيرة مع دعم مخصص وميزات حصرية.'
  },
];

const resources = [
  {
    title: 'دليل البدء السريع',
    description: 'تعلم أساسيات إعداد متجرك في دقائق',
    icon: Book,
    link: '#',
    type: 'guide'
  },
  {
    title: 'فيديوهات تعليمية',
    description: 'شاهد شروحات مفصلة لجميع الميزات',
    icon: Video,
    link: '#',
    type: 'video'
  },
  {
    title: 'مركز المساعدة',
    description: 'ابحث في قاعدة المعرفة الشاملة',
    icon: HelpCircle,
    link: '#',
    type: 'docs'
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.includes(searchQuery) || faq.answer.includes(searchQuery)
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">مركز المساعدة</h1>
        <p className="text-gray-600">كيف يمكننا مساعدتك اليوم؟</p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن سؤالك..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Resources */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <a
              key={index}
              href={resource.link}
              className="p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-lg hover:border-blue-200 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                <Icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
              <p className="text-sm text-gray-600">{resource.description}</p>
            </a>
          );
        })}
      </div>

      {/* FAQs */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">الأسئلة الشائعة</h2>
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-right hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">هل تحتاج مساعدة إضافية؟</h2>
        <p className="text-gray-600 mb-6">فريق الدعم الفني متاح لمساعدتك</p>
        
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="mailto:support@tejaratk.com"
            className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">البريد الإلكتروني</p>
              <p className="text-sm text-gray-500">support@tejaratk.com</p>
            </div>
          </a>
          
          <a
            href="https://wa.me/96812345678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">واتساب</p>
              <p className="text-sm text-gray-500">دردشة مباشرة</p>
            </div>
          </a>
          
          <a
            href="tel:+96812345678"
            className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Phone className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">الهاتف</p>
              <p className="text-sm text-gray-500">+968 1234 5678</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
