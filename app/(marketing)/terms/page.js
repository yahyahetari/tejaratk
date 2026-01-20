import Link from 'next/link';

export const metadata = {
  title: 'الشروط والأحكام | تجارتك',
  description: 'الشروط والأحكام الخاصة باستخدام منصة تجارتك',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            &rarr; العودة للرئيسية
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الشروط والأحكام</h1>
          <p className="text-gray-600">آخر تحديث: يناير 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. القبول بالشروط</h2>
            <p className="text-gray-600 leading-relaxed">
              باستخدامك لمنصة تجارتك، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام خدماتنا.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. وصف الخدمة</h2>
            <p className="text-gray-600 leading-relaxed">
              تجارتك هي منصة للتجارة الإلكترونية تتيح للتجار إنشاء وإدارة متاجرهم الإلكترونية. نقدم أدوات لإدارة المنتجات، الطلبات، العملاء، والمدفوعات.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. حساب المستخدم</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li>يجب أن تكون بالغاً (18 سنة أو أكثر) لإنشاء حساب</li>
              <li>أنت مسؤول عن الحفاظ على سرية معلومات حسابك</li>
              <li>يجب تقديم معلومات دقيقة وصحيحة عند التسجيل</li>
              <li>يحق لنا تعليق أو إنهاء حسابك في حالة مخالفة الشروط</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. الاشتراكات والدفع</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li>تتوفر خطط اشتراك مختلفة بأسعار محددة</li>
              <li>يتم تجديد الاشتراكات تلقائياً ما لم يتم إلغاؤها</li>
              <li>يمكن إلغاء الاشتراك في أي وقت من لوحة التحكم</li>
              <li>لا يتم استرداد المبالغ المدفوعة للفترات المستخدمة</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. الاستخدام المقبول</h2>
            <p className="text-gray-600 leading-relaxed mb-4">يُحظر استخدام المنصة لـ:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li>بيع منتجات غير قانونية أو محظورة</li>
              <li>انتهاك حقوق الملكية الفكرية للآخرين</li>
              <li>نشر محتوى مسيء أو تمييزي</li>
              <li>محاولة اختراق أو تعطيل الخدمة</li>
              <li>إرسال رسائل غير مرغوب فيها (سبام)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. الملكية الفكرية</h2>
            <p className="text-gray-600 leading-relaxed">
              جميع حقوق الملكية الفكرية للمنصة (بما في ذلك الشعارات، التصميم، والكود) مملوكة لنا. يحتفظ التجار بملكية المحتوى الذي يضيفونه إلى متاجرهم.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. إخلاء المسؤولية</h2>
            <p className="text-gray-600 leading-relaxed">
              نقدم الخدمة &quot;كما هي&quot; دون أي ضمانات صريحة أو ضمنية. لا نتحمل المسؤولية عن أي خسائر ناتجة عن استخدام الخدمة، بما في ذلك فقدان البيانات أو الأرباح.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. التعديلات</h2>
            <p className="text-gray-600 leading-relaxed">
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. القانون الحاكم</h2>
            <p className="text-gray-600 leading-relaxed">
              تخضع هذه الشروط لقوانين سلطنة عمان، وأي نزاع ينشأ عنها يخضع للاختصاص القضائي للمحاكم العمانية.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">10. التواصل</h2>
            <p className="text-gray-600 leading-relaxed">
              للاستفسارات حول هذه الشروط، تواصل معنا عبر: <a href="mailto:legal@tejaratk.com" className="text-blue-600 hover:underline">legal@tejaratk.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
