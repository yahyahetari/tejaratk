'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Store, Save, Loader2 } from 'lucide-react';

/**
 * Store Setup Form Component
 */
export default function StoreSetupForm({ merchantId, initialData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    storeName: initialData?.storeName || '',
    storeUrl: initialData?.storeUrl || '',
    description: initialData?.description || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    metaKeywords: initialData?.metaKeywords || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData 
        ? `/api/store-setup/${initialData.id}`
        : '/api/store-setup';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, merchantId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل حفظ المعلومات');
      }

      setSuccess(true);
      
      // Refresh page data
      router.refresh();
      
      // Show success message for 2 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          ✓ تم حفظ المعلومات بنجاح
        </div>
      )}

      {/* Store Name */}
      <div>
        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
          اسم المتجر <span className="text-red-500">*</span>
        </label>
        <input
          id="storeName"
          name="storeName"
          type="text"
          required
          value={formData.storeName}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="مثال: متجر الإلكترونيات"
          disabled={loading}
        />
      </div>

      {/* Store URL */}
      <div>
        <label htmlFor="storeUrl" className="block text-sm font-medium text-gray-700 mb-2">
          عنوان URL المتجر <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">yastore.com/</span>
          <input
            id="storeUrl"
            name="storeUrl"
            type="text"
            required
            value={formData.storeUrl}
            onChange={handleChange}
            className="block flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="my-store"
            pattern="[a-z0-9-]+"
            title="يُسمح فقط بالأحرف الصغيرة والأرقام والشرطات"
            disabled={loading}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          يُسمح فقط بالأحرف الصغيرة والأرقام والشرطات (-)
        </p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          وصف المتجر
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="وصف مختصر لمتجرك ومنتجاته"
          disabled={loading}
        />
      </div>

      {/* SEO Section */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          تحسين محركات البحث (SEO)
        </h3>
        
        {/* Meta Title */}
        <div className="mb-4">
          <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
            عنوان الصفحة (Meta Title)
          </label>
          <input
            id="metaTitle"
            name="metaTitle"
            type="text"
            value={formData.metaTitle}
            onChange={handleChange}
            maxLength={60}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="عنوان متجرك - أفضل المنتجات"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.metaTitle.length}/60 حرف
          </p>
        </div>

        {/* Meta Description */}
        <div className="mb-4">
          <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
            وصف الصفحة (Meta Description)
          </label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            rows={3}
            value={formData.metaDescription}
            onChange={handleChange}
            maxLength={160}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="وصف مختصر يظهر في نتائج البحث"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.metaDescription.length}/160 حرف
          </p>
        </div>

        {/* Meta Keywords */}
        <div>
          <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 mb-2">
            الكلمات المفتاحية
          </label>
          <input
            id="metaKeywords"
            name="metaKeywords"
            type="text"
            value={formData.metaKeywords}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="متجر, إلكترونيات, تسوق"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            افصل الكلمات بفواصل
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {initialData ? 'تحديث المعلومات' : 'حفظ وإنشاء المتجر'}
            </>
          )}
        </Button>
        
        {initialData && (
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/store-setup/design')}
            disabled={loading}
          >
            <Store className="h-4 w-4" />
            تخصيص التصميم
          </Button>
        )}
      </div>
    </form>
  );
}