import Link from 'next/link';

export const metadata = {
  title: 'سياسة ملفات تعريف الارتباط | تجارتك',
  description: 'سياسة استخدام ملفات تعريف الارتباط (Cookies) في منصة تجارتك',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            &rarr; العودة للرئيسية
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">سياسة ملفات تعريف الارتباط</h1>
          <p className="text-gray-600">آخر تحديث: يناير 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">ما هي ملفات تعريف الارتباط؟</h2>
            <p className="text-gray-600 leading-relaxed">
              ملفات تعريف الارتباط (Cookies) هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة موقعنا. تساعدنا هذه الملفات في تحسين تجربتك وتقديم خدمات أفضل.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">أنواع ملفات تعريف الارتباط التي نستخدمها</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">ملفات تعريف الارتباط الضرورية</h3>
                <p className="text-gray-600 text-sm">
                  هذه الملفات ضرورية لعمل الموقع بشكل صحيح، مثل تسجيل الدخول والحفاظ على جلسة المستخدم. لا يمكن تعطيلها.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">ملفات تعريف الارتباط التحليلية</h3>
                <p className="text-gray-600 text-sm">
                  تساعدنا في فهم كيفية استخدام الزوار للموقع، مما يمكننا من تحسين الأداء والمحتوى.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">ملفات تعريف الارتباط الوظيفية</h3>
                <p className="text-gray-600 text-sm">
                  تتيح لنا تذكر تفضيلاتك مثل اللغة والمنطقة الزمنية لتقديم تجربة مخصصة.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">ملفات تعريف الارتباط التسويقية</h3>
                <p className="text-gray-600 text-sm">
                  تُستخدم لعرض إعلانات ذات صلة باهتماماتك. يمكنك إلغاء الاشتراك في هذه الملفات.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">ملفات تعريف الارتباط من جهات خارجية</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              قد نستخدم خدمات من جهات خارجية تضع ملفات تعريف ارتباط خاصة بها، مثل:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li>Google Analytics - لتحليل حركة المرور</li>
              <li>بوابات الدفع - لمعالجة المدفوعات بشكل آمن</li>
              <li>خدمات الدردشة - لتقديم الدعم الفني</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">كيفية إدارة ملفات تعريف الارتباط</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li><strong>Chrome:</strong> الإعدادات &gt; الخصوصية والأمان &gt; ملفات تعريف الارتباط</li>
              <li><strong>Firefox:</strong> الخيارات &gt; الخصوصية والأمان &gt; ملفات تعريف الارتباط</li>
              <li><strong>Safari:</strong> التفضيلات &gt; الخصوصية &gt; إدارة بيانات الموقع</li>
              <li><strong>Edge:</strong> الإعدادات &gt; ملفات تعريف الارتباط وأذونات الموقع</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">تأثير تعطيل ملفات تعريف الارتباط</h2>
            <p className="text-gray-600 leading-relaxed">
              قد يؤدي تعطيل ملفات تعريف الارتباط إلى عدم عمل بعض ميزات الموقع بشكل صحيح، مثل تسجيل الدخول أو حفظ تفضيلاتك.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">التواصل معنا</h2>
            <p className="text-gray-600 leading-relaxed">
              إذا كانت لديك أسئلة حول سياسة ملفات تعريف الارتباط، تواصل معنا عبر: <a href="mailto:privacy@tejaratk.com" className="text-blue-600 hover:underline">privacy@tejaratk.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
