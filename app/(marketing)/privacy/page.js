import Link from 'next/link';

export const metadata = {
  title: 'سياسة الخصوصية | تجارتك',
  description: 'سياسة الخصوصية وحماية البيانات الشخصية في منصة تجارتك - التزامنا بحماية بياناتك وفقاً للمعايير الدولية',
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
          <p className="text-gray-600">آخر تحديث: فبراير 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. مقدمة</h2>
            <p className="text-gray-600 leading-relaxed">
              نحن في منصة تجارتك (&quot;المنصة&quot;، &quot;نحن&quot;، &quot;لنا&quot;) نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وتخزين وحماية المعلومات التي تقدمها لنا عند استخدام خدماتنا. باستخدامك للمنصة، فإنك توافق على الممارسات الموضحة في هذه السياسة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. المعلومات التي نجمعها</h2>
            <p className="text-gray-600 leading-relaxed mb-4">نقوم بجمع الأنواع التالية من المعلومات:</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">أ. معلومات تقدمها مباشرة:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4 mb-4">
              <li>معلومات الحساب: الاسم الكامل، البريد الإلكتروني، رقم الهاتف، كلمة المرور (مشفرة)</li>
              <li>معلومات النشاط التجاري: اسم المتجر، العلامة التجارية، العنوان، السجل التجاري</li>
              <li>معلومات الدفع: تفاصيل الدفع تُعالج بشكل آمن عبر بوابات دفع معتمدة (مثل Moyasar، Tap) ولا نخزن بيانات بطاقتك على خوادمنا</li>
              <li>المحتوى: المنتجات، الصور، الأوصاف، والشعارات التي ترفعها على متجرك</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">ب. معلومات نجمعها تلقائياً:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li>بيانات الاستخدام: سجلات الدخول، الصفحات المزارة، مدة الجلسة، التفاعلات</li>
              <li>معلومات الجهاز: نوع المتصفح، نظام التشغيل، عنوان IP، دقة الشاشة</li>
              <li>ملفات تعريف الارتباط (Cookies) والتقنيات المشابهة</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. كيفية استخدام المعلومات</h2>
            <p className="text-gray-600 leading-relaxed mb-4">نستخدم المعلومات المجمعة للأغراض التالية حصراً:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li>تقديم وتشغيل وتحسين خدماتنا</li>
              <li>معالجة المدفوعات وإدارة الاشتراكات</li>
              <li>التواصل معك بشأن حسابك والتحديثات الأمنية</li>
              <li>إرسال العروض والتحديثات التسويقية (يمكنك إلغاء الاشتراك في أي وقت)</li>
              <li>تحليل أنماط الاستخدام لتحسين تجربة المستخدم</li>
              <li>منع الاحتيال وضمان أمان المنصة</li>
              <li>الامتثال للالتزامات القانونية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. الأساس القانوني لمعالجة البيانات</h2>
            <p className="text-gray-600 leading-relaxed mb-4">نعالج بياناتك بناءً على الأسس القانونية التالية:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li><strong>تنفيذ العقد:</strong> لتقديم الخدمات التي اشتركت فيها</li>
              <li><strong>الموافقة:</strong> للتسويق والاتصالات الاختيارية</li>
              <li><strong>المصلحة المشروعة:</strong> لتحسين خدماتنا ومنع الاحتيال</li>
              <li><strong>الالتزام القانوني:</strong> للامتثال للقوانين واللوائح المعمول بها</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. حماية البيانات</h2>
            <p className="text-gray-600 leading-relaxed">
              نتخذ إجراءات أمنية صارمة لحماية بياناتك تشمل: تشفير البيانات أثناء النقل (TLS/SSL) وفي حالة السكون، جدران حماية متقدمة، مراقبة أمنية مستمرة، تشفير كلمات المرور باستخدام خوارزمية bcrypt، والوصول المحدود للموظفين المصرح لهم فقط وفق مبدأ الحاجة للمعرفة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. مشاركة المعلومات</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة أبداً.</strong> قد نشارك بعض المعلومات مع:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li><strong>مزودي الخدمات:</strong> بوابات الدفع (Moyasar، Tap)، خدمات الاستضافة، خدمات البريد الإلكتروني - وفقاً لاتفاقيات معالجة بيانات صارمة</li>
              <li><strong>الجهات القانونية:</strong> عند الطلب بموجب أمر قضائي أو التزام قانوني</li>
              <li><strong>حالات الاندماج:</strong> في حالة بيع أو دمج المنصة، مع إخطارك مسبقاً</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. نقل البيانات دولياً</h2>
            <p className="text-gray-600 leading-relaxed">
              قد يتم تخزين بياناتك ومعالجتها على خوادم خارج بلد إقامتك (بما في ذلك خدمات سحابية دولية). نضمن أن أي نقل للبيانات يتم وفقاً لمعايير حماية مناسبة تتضمن بنوداً تعاقدية قياسية وإجراءات أمنية إضافية لحماية بياناتك.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. الاحتفاظ بالبيانات</h2>
            <p className="text-gray-600 leading-relaxed mb-4">نحتفظ ببياناتك وفقاً للمدد التالية:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li><strong>بيانات الحساب النشط:</strong> طوال فترة استخدامك للخدمة</li>
              <li><strong>بعد حذف الحساب:</strong> نحذف بياناتك الشخصية خلال 30 يوماً، مع الاحتفاط بالسجلات المالية لمدة 5 سنوات وفقاً للمتطلبات القانونية</li>
              <li><strong>سجلات الأمان:</strong> 12 شهراً لأغراض الحماية من الاحتيال</li>
              <li><strong>النسخ الاحتياطية:</strong> تُحذف تلقائياً خلال 90 يوماً من حذف الحساب</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. حقوقك</h2>
            <p className="text-gray-600 leading-relaxed mb-4">لديك الحقوق التالية بشأن بياناتك الشخصية:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li><strong>حق الوصول:</strong> طلب نسخة من بياناتك الشخصية</li>
              <li><strong>حق التصحيح:</strong> تصحيح أي معلومات غير دقيقة</li>
              <li><strong>حق الحذف:</strong> طلب حذف بياناتك (&quot;الحق في النسيان&quot;)</li>
              <li><strong>حق النقل:</strong> الحصول على بياناتك بتنسيق قابل للقراءة آلياً</li>
              <li><strong>حق الاعتراض:</strong> الاعتراض على معالجة بياناتك لأغراض التسويق</li>
              <li><strong>حق سحب الموافقة:</strong> سحب موافقتك في أي وقت عبر إعدادات حسابك أو بالتواصل معنا</li>
              <li><strong>حق تقييد المعالجة:</strong> طلب تقييد معالجة بياناتك في حالات معينة</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              لممارسة أي من هذه الحقوق، تواصل معنا عبر <a href="mailto:privacy@tejaratk.com" className="text-blue-600 hover:underline">privacy@tejaratk.com</a>. سنرد على طلبك خلال 30 يوماً كحد أقصى.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">10. ملفات تعريف الارتباط (Cookies)</h2>
            <p className="text-gray-600 leading-relaxed mb-4">نستخدم الأنواع التالية من ملفات تعريف الارتباط:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li><strong>ضرورية:</strong> لتشغيل المنصة وتسجيل الدخول (لا يمكن تعطيلها)</li>
              <li><strong>وظيفية:</strong> لتذكر تفضيلاتك واللغة المختارة</li>
              <li><strong>تحليلية:</strong> لفهم كيفية استخدامك للمنصة وتحسينها</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال إعدادات متصفحك. تعطيل بعض الملفات قد يؤثر على بعض وظائف المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">11. حماية بيانات القاصرين</h2>
            <p className="text-gray-600 leading-relaxed">
              خدماتنا موجهة للأشخاص الذين يبلغون 18 عاماً أو أكثر. لا نجمع عمداً معلومات شخصية من القاصرين دون سن 18 عاماً. إذا علمنا أننا جمعنا بيانات من قاصر، سنتخذ خطوات فورية لحذف هذه المعلومات. إذا كنت ولي أمر وتعتقد أن طفلك قدم لنا معلومات شخصية، يرجى التواصل معنا فوراً.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">12. الامتثال للقوانين الدولية</h2>
            <p className="text-gray-600 leading-relaxed mb-4">نلتزم بالمعايير الدولية لحماية البيانات:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
              <li><strong>GDPR (أوروبا):</strong> نوفر جميع حقوق البيانات المنصوص عليها في اللائحة العامة لحماية البيانات للمستخدمين في الاتحاد الأوروبي</li>
              <li><strong>CCPA (كاليفورنيا):</strong> نحترم حقوق سكان كاليفورنيا في معرفة وحذف ورفض بيع بياناتهم الشخصية</li>
              <li><strong>القوانين المحلية:</strong> نلتزم بقوانين حماية البيانات في الدول التي نعمل فيها</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">13. التغييرات على هذه السياسة</h2>
            <p className="text-gray-600 leading-relaxed">
              قد نحدّث هذه السياسة من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار بارز على المنصة قبل 30 يوماً على الأقل من سريان التغيير. استمرارك في استخدام المنصة بعد التحديث يعني موافقتك على السياسة المحدّثة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">14. التواصل معنا</h2>
            <p className="text-gray-600 leading-relaxed">
              إذا كانت لديك أي أسئلة أو مخاوف حول سياسة الخصوصية أو ممارسات حماية البيانات لدينا:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4 mt-4">
              <li>البريد الإلكتروني: <a href="mailto:privacy@tejaratk.com" className="text-blue-600 hover:underline">privacy@tejaratk.com</a></li>
              <li>الدعم الفني: <a href="mailto:support@tejaratk.com" className="text-blue-600 hover:underline">support@tejaratk.com</a></li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
