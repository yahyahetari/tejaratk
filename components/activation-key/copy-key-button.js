'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

/**
 * مكون زر نسخ كود التفعيل
 * @param {Object} props
 * @param {string} props.keyValue - قيمة الكود المراد نسخه
 * @param {string} props.variant - نوع الزر (default, outline, ghost)
 * @param {string} props.size - حجم الزر (sm, md, lg)
 * @param {string} props.className - CSS classes إضافية
 * @param {boolean} props.showText - إظهار النص (افتراضي: true)
 */
export default function CopyKeyButton({ 
  keyValue, 
  variant = 'default',
  size = 'default',
  className = '',
  showText = true
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(keyValue);
      setCopied(true);

      // إعادة تعيين الحالة بعد 2 ثانية
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('فشل النسخ:', err);
      // Fallback للمتصفحات القديمة
      const textArea = document.createElement('textarea');
      textArea.value = keyValue;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (err) {
        console.error('فشل النسخ (fallback):', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size={size}
      className={`transition-all ${className} ${copied ? 'bg-green-600 hover:bg-green-700' : ''}`}
    >
      {copied ? (
        <>
          <Check className={showText ? 'ml-2 h-5 w-5' : 'h-5 w-5'} />
          {showText && 'تم النسخ!'}
        </>
      ) : (
        <>
          <Copy className={showText ? 'ml-2 h-5 w-5' : 'h-5 w-5'} />
          {showText && 'نسخ الكود'}
        </>
      )}
    </Button>
  );
}
