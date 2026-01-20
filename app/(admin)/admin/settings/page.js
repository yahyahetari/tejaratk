import { buildMetadata } from "@/lib/seo/metadata";
import AdminSettingsForm from '@/components/admin/admin-settings-form';
import { 
  Settings, 
  Globe,
  Mail,
  CreditCard,
  Shield,
  Bell,
  Palette,
  Database
} from 'lucide-react';

export const metadata = buildMetadata({ 
  title: "إعدادات النظام", 
  path: "/admin/settings", 
  noIndex: true 
});

export default function AdminSettingsPage() {
  const settingsSections = [
    {
      id: 'general',
      title: 'الإعدادات العامة',
      description: 'إعدادات المنصة الأساسية',
      icon: Globe,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'email',
      title: 'إعدادات البريد',
      description: 'إعداد خدمة إرسال البريد الإلكتروني',
      icon: Mail,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'payment',
      title: 'بوابات الدفع',
      description: 'إعداد بوابات الدفع الافتراضية',
      icon: CreditCard,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'security',
      title: 'الأمان',
      description: 'إعدادات الأمان والحماية',
      icon: Shield,
      gradient: 'from-red-500 to-rose-600'
    },
    {
      id: 'notifications',
      title: 'الإشعارات',
      description: 'إعدادات الإشعارات والتنبيهات',
      icon: Bell,
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      id: 'appearance',
      title: 'المظهر',
      description: 'تخصيص مظهر المنصة',
      icon: Palette,
      gradient: 'from-pink-500 to-rose-600'
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg shadow-gray-500/30">
          <Settings className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900">إعدادات النظام</h1>
          <p className="text-gray-500">إدارة إعدادات المنصة والتكوينات</p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {settingsSections.map((section) => (
          <a
            key={section.id}
            href={`/admin/settings/${section.id}`}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <section.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{section.title}</h3>
            <p className="text-sm text-gray-500">{section.description}</p>
          </a>
        ))}
      </div>

      {/* Quick Settings Form */}
      <AdminSettingsForm />
    </div>
  );
}
