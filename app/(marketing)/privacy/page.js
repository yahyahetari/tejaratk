import Link from 'next/link';

export const metadata = {
  title: 'سياسة الخصوصية | تجارتك',
  description: 'سياسة الخصوصية وحماية البيانات في منصة تجارتك',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            &rarr; العودة للرئيسية
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">سياسة الخصوصية</h1>
          <p className="text-gray-600">آخر تحديث: يناير 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. مقدمة</h2>
            <p className="text-gray-600 leading-relaxed">
              نحن في منصة تجارتك نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية المعلومات التي تقدمها لنا عند استخدام خدماتنا.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. المعلومات التي نجمعها</h2>
            <p className="text-gray-600 leading-relaxed mb-4">نقوم بجمع المعلومات التالية:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li>معلومات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف</li>
              <li>معلومات النشاط التجاري: اسم المتجر، العنوان، السجل التجاري</li>
              <li>معلومات الدفع: تفاصيل بطاقة الائتمان (تُعالج بشكل آمن عبر بوابات الدفع)</li>
              <li>بيانات الاستخدام: سجلات الدخول، الصفحات المزارة، التفاعلات</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. كيفية استخدام المعلومات</h2>
            <p className="text-gray-600 leading-relaxed mb-4">نستخدم المعلومات المجمعة للأغراض التالية:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li>تقديم وتحسين خدماتنا</li>
              <li>معالجة المدفوعات والاشتراكات</li>
              <li>التواصل معك بشأن حسابك وخدماتنا</li>
              <li>إرسال التحديثات والعروض (يمكنك إلغاء الاشتراك في أي وقت)</li>
              <li>تحليل الاستخدام لتحسين تجربة المستخدم</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. حماية البيانات</h2>
            <p className="text-gray-600 leading-relaxed">
              نتخذ إجراءات أمنية صارمة لحماية بياناتك، بما في ذلك التشفير، وجدران الحماية، والوصول المحدود للموظفين المصرح لهم فقط. نحن نستخدم بروتوكول HTTPS لتأمين جميع الاتصالات.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. مشاركة المعلومات</h2>
            <p className="text-gray-600 leading-relaxed">
              لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك المعلومات مع مزودي الخدمات الموثوقين (مثل بوابات الدفع) لتقديم خدماتنا، وذلك وفقاً لاتفاقيات سرية صارمة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. حقوقك</h2>
            <p className="text-gray-600 leading-relaxed mb-4">لديك الحق في:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li>الوصول إلى بياناتك الشخصية</li>
              <li>تصحيح أي معلومات غير دقيقة</li>
              <li>طلب حذف بياناتك</li>
              <li>الاعتراض على معالجة بياناتك</li>
              <li>نقل بياناتك إلى خدمة أخرى</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. ملفات تعريف الارتباط (Cookies)</h2>
            <p className="text-gray-600 leading-relaxed">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك. لمزيد من المعلومات، راجع <Link href="/cookies" className="text-blue-600 hover:underline">سياسة ملفات تعريف الارتباط</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. التواصل معنا</h2>
            <p className="text-gray-600 leading-relaxed">
              إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يمكنك التواصل معنا عبر البريد الإلكتروني: <a href="mailto:privacy@tejaratk.com" className="text-blue-600 hover:underline">privacy@tejaratk.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
