import Link from 'next/link';

export const metadata = {
  title: 'الشروط والأحكام | تجارتك',
  description: 'الشروط والأحكام الخاصة باستخدام منصة تجارتك - اقرأ حقوقك والتزاماتك كمستخدم للمنصة',
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
          <p className="text-gray-600">آخر تحديث: فبراير 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. القبول بالشروط</h2>
            <p className="text-gray-600 leading-relaxed">
              باستخدامك لمنصة تجارتك (&quot;المنصة&quot;، &quot;الخدمة&quot;)، فإنك توافق على الالتزام بهذه الشروط والأحكام (&quot;الاتفاقية&quot;). تشكل هذه الاتفاقية عقداً ملزماً بينك وبين تجارتك. إذا كنت لا توافق على أي من هذه الشروط، يرجى التوقف فوراً عن استخدام خدماتنا. استمرارك في الاستخدام يُعد قبولاً ضمنياً بهذه الشروط.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. وصف الخدمة</h2>
            <p className="text-gray-600 leading-relaxed">
              تجارتك هي منصة للتجارة الإلكترونية (SaaS) تتيح للتجار إنشاء وإدارة متاجرهم الإلكترونية. تشمل الخدمة أدوات لإدارة المنتجات، الطلبات، العملاء، المدفوعات، الفواتير، التقارير، والتصاميم. نحتفظ بالحق في تعديل أو إضافة أو إزالة ميزات من المنصة مع إخطار مسبق.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. أهلية الاستخدام</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li>يجب أن تكون بالغاً (18 سنة أو أكثر) لإنشاء حساب</li>
              <li>يجب أن تمتلك الصلاحية القانونية لإبرام هذه الاتفاقية</li>
              <li>إذا كنت تستخدم المنصة نيابة عن شركة، فأنت تضمن أنك مخوّل بذلك</li>
              <li>أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة مرورك</li>
              <li>يجب تقديم معلومات دقيقة وصحيحة ومحدّثة عند التسجيل</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. الاشتراكات والدفع</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li>تتوفر خطط اشتراك مختلفة (أساسية، احترافية، شركات) بأسعار محددة ومعلنة على صفحة الأسعار</li>
              <li>يتم تجديد الاشتراكات تلقائياً في نهاية كل دورة فوترة ما لم يتم إلغاؤها قبل ذلك</li>
              <li>الأسعار بالدولار الأمريكي (USD) وقد تتغير مع إخطار مسبق بـ 30 يوماً</li>
              <li>يمكن إلغاء الاشتراك في أي وقت من صفحة الإعدادات، ويظل فعالاً حتى نهاية الفترة المدفوعة</li>
              <li>في حالة فشل الدفع، تُمنح فترة سماح 7 أيام قبل تعليق الخدمة</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. سياسة الاسترداد</h2>
            <p className="text-gray-600 leading-relaxed mb-4">نلتزم بسياسة استرداد عادلة:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li><strong>خلال 14 يوماً:</strong> يمكنك طلب استرداد كامل المبلغ إذا لم تكن راضياً عن الخدمة</li>
              <li><strong>بعد 14 يوماً:</strong> لا يتم استرداد المبالغ المدفوعة للفترات المستخدمة</li>
              <li><strong>الاشتراك السنوي:</strong> يُحسب الاسترداد بناءً على الأشهر غير المستخدمة بالسعر الشهري</li>
              <li><strong>الإلغاء من جانبنا:</strong> في حالة إنهاء حسابك بسبب مخالفة، لا يُسترد المبلغ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. الاستخدام المقبول</h2>
            <p className="text-gray-600 leading-relaxed mb-4">يُحظر استخدام المنصة لأي من الأغراض التالية:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li>بيع منتجات غير قانونية، محظورة، مقلدة، أو مسروقة</li>
              <li>انتهاك حقوق الملكية الفكرية أو العلامات التجارية للآخرين</li>
              <li>نشر محتوى مسيء، تمييزي، إباحي، أو يحض على الكراهية</li>
              <li>الاحتيال أو التضليل أو انتحال هوية الآخرين</li>
              <li>محاولة اختراق أو تعطيل أو إجراء هندسة عكسية للمنصة</li>
              <li>إرسال رسائل غير مرغوب فيها (سبام) أو برمجيات ضارة</li>
              <li>استخدام المنصة لغسيل الأموال أو تمويل أنشطة غير مشروعة</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              يحق لنا تعليق أو إنهاء حسابك فوراً وبدون إنذار مسبق في حالة مخالفة هذه الشروط.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. مسؤولية المحتوى</h2>
            <p className="text-gray-600 leading-relaxed">
              أنت المسؤول الوحيد عن جميع المحتويات التي تنشرها على متجرك (منتجات، صور، أوصاف، أسعار). تضمن أن المحتوى لا ينتهك حقوق الغير وأنك تمتلك جميع الحقوق اللازمة. نحتفظ بالحق في إزالة أي محتوى مخالف دون إشعار مسبق. تجارتك غير مسؤولة عن أي مطالبات ناتجة عن المحتوى الذي تنشره.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. الملكية الفكرية</h2>
            <p className="text-gray-600 leading-relaxed">
              جميع حقوق الملكية الفكرية للمنصة (بما في ذلك الشعارات، التصميم، الكود المصدري، والخوارزميات) مملوكة حصرياً لتجارتك. يُمنح التاجر ترخيصاً محدوداً وغير حصري لاستخدام المنصة خلال فترة الاشتراك. يحتفظ التجار بملكية المحتوى الذي يضيفونه إلى متاجرهم.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. مستوى الخدمة (SLA)</h2>
            <p className="text-gray-600 leading-relaxed mb-4">نلتزم بتقديم مستوى خدمة عالي الجودة:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li><strong>نسبة التوفر:</strong> نسعى لتوفير المنصة بنسبة 99.5% من الوقت (باستثناء الصيانة المجدولة)</li>
              <li><strong>الصيانة المجدولة:</strong> نخطرك مسبقاً بـ 24 ساعة على الأقل عبر البريد الإلكتروني</li>
              <li><strong>الدعم الفني:</strong> متاح خلال أيام العمل عبر البريد الإلكتروني. باقة الشركات تحصل على دعم 24/7</li>
              <li><strong>التعويض:</strong> في حالة انقطاع الخدمة لأكثر من 24 ساعة متواصلة (غير مجدولة)، يُمدد اشتراكك بعدد أيام الانقطاع</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">10. تحديد المسؤولية</h2>
            <p className="text-gray-600 leading-relaxed">
              نقدم الخدمة &quot;كما هي&quot; و&quot;حسب التوفر&quot; دون أي ضمانات صريحة أو ضمنية بشأن الملاءمة لغرض معين أو عدم الانتهاك. <strong>في جميع الأحوال، لن تتجاوز مسؤوليتنا الإجمالية تجاهك المبلغ الذي دفعته لنا خلال الـ 12 شهراً السابقة للمطالبة.</strong> لا نتحمل المسؤولية عن أي أضرار غير مباشرة أو عرضية أو تبعية، بما في ذلك فقدان الأرباح أو البيانات أو فرص العمل.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">11. القوة القاهرة</h2>
            <p className="text-gray-600 leading-relaxed">
              لا نتحمل المسؤولية عن أي تأخير أو فشل في أداء التزاماتنا ناتج عن أسباب خارجة عن سيطرتنا المعقولة، بما في ذلك: الكوارث الطبيعية، الحروب، الهجمات السيبرانية واسعة النطاق، انقطاع خدمات الإنترنت أو مزودي الخدمات السحابية، الأوبئة، القرارات الحكومية، أو أي حدث آخر لا يمكن توقعه أو منعه بشكل معقول.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">12. إنهاء الخدمة والبيانات</h2>
            <p className="text-gray-600 leading-relaxed mb-4">عند إنهاء حسابك (سواء بطلبك أو بقرارنا):</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li><strong>فترة التصدير:</strong> تُمنح 30 يوماً لتصدير بياناتك (منتجات، طلبات، عملاء) قبل الحذف النهائي</li>
              <li><strong>الحذف:</strong> تُحذف بياناتك الشخصية ومحتوى متجرك خلال 30 يوماً من انتهاء فترة التصدير</li>
              <li><strong>السجلات المالية:</strong> تُحتفظ بها لمدة 5 سنوات وفقاً للمتطلبات القانونية</li>
              <li><strong>النسخ الاحتياطية:</strong> تُزال من جميع الأنظمة خلال 90 يوماً</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">13. حل النزاعات</h2>
            <p className="text-gray-600 leading-relaxed mb-4">في حالة أي نزاع ينشأ عن هذه الاتفاقية:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li><strong>المرحلة 1 - التفاوض:</strong> يحاول الطرفان حل النزاع ودياً خلال 30 يوماً عبر التواصل المباشر</li>
              <li><strong>المرحلة 2 - الوساطة:</strong> إذا لم يُحل النزاع، يُحال إلى وسيط مستقل يتفق عليه الطرفان</li>
              <li><strong>المرحلة 3 - التحكيم:</strong> إذا فشلت الوساطة، يُحال النزاع إلى التحكيم وفقاً لقواعد التحكيم المعمول بها</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">14. التعديلات على الشروط</h2>
            <p className="text-gray-600 leading-relaxed">
              نحتفظ بالحق في تعديل هذه الشروط. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني وإشعار بارز على المنصة قبل 30 يوماً على الأقل من سريانها. التغييرات غير الجوهرية (مثل التعديلات اللغوية) تسري فوراً. استمرارك في استخدام المنصة بعد سريان التغييرات يُعد قبولاً بها.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">15. القانون الحاكم</h2>
            <p className="text-gray-600 leading-relaxed">
              تخضع هذه الشروط والأحكام وتُفسر وفقاً للقوانين المعمول بها. أي نزاع لا يُحل عبر آليات حل النزاعات المذكورة أعلاه يخضع للاختصاص القضائي للمحاكم المختصة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">16. أحكام عامة</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li><strong>الاتفاقية الكاملة:</strong> تشكل هذه الشروط مع <Link href="/privacy" className="text-blue-600 hover:underline">سياسة الخصوصية</Link> الاتفاقية الكاملة بينك وبين تجارتك</li>
              <li><strong>قابلية الفصل:</strong> إذا حُكم ببطلان أي بند، تظل باقي البنود سارية المفعول</li>
              <li><strong>عدم التنازل:</strong> عدم ممارستنا لحق من حقوقنا لا يُعد تنازلاً عنه</li>
              <li><strong>التنازل:</strong> لا يجوز لك التنازل عن حقوقك أو التزاماتك بموجب هذه الاتفاقية دون موافقتنا الخطية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">17. التواصل</h2>
            <p className="text-gray-600 leading-relaxed">
              للاستفسارات حول هذه الشروط والأحكام:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4 mt-4">
              <li>الشؤون القانونية: <a href="mailto:legal@tejaratk.com" className="text-blue-600 hover:underline">legal@tejaratk.com</a></li>
              <li>الدعم الفني: <a href="mailto:support@tejaratk.com" className="text-blue-600 hover:underline">support@tejaratk.com</a></li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
