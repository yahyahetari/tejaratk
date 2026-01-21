// lib/key-generator.js
import crypto from 'node:crypto';

/**
 * توليد كود تفعيل فريد
 * @param {string} merchantId - معرف التاجر
 * @param {string} planType - نوع الخطة
 * @returns {string} - كود التفعيل
 */
export function generateActivationKey(merchantId, planType = 'BASIC') {
  // إنشاء hash من معرف التاجر والوقت الحالي
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(16).toString('hex');

  // دمج البيانات
  const data = `${merchantId}-${planType}-${timestamp}-${randomBytes}`;

  // إنشاء hash
  const hash = crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
    .toUpperCase();

  // تنسيق الكود بشكل TEJRTK-XXXX-XXXX-XXXX-XXXX-XXXX
  const prefix = 'TEJRTK';
  const segments = [];

  // تقسيم الـ hash إلى 5 أجزاء كل جزء 4 أحرف
  for (let i = 0; i < 5; i++) {
    segments.push(hash.substr(i * 4, 4));
  }

  return `${prefix}-${segments.join('-')}`;
}

/**
 * التحقق من صحة تنسيق كود التفعيل
 * @param {string} key - كود التفعيل
 * @returns {boolean}
 */
export function isValidKeyFormat(key) {
  // التنسيق: TEJRTK-XXXX-XXXX-XXXX-XXXX-XXXX
  const pattern = /^TEJRTK-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/;
  return pattern.test(key);
}

/**
 * إنشاء كود قصير للعرض (اختياري)
 * @param {string} fullKey - الكود الكامل
 * @returns {string} - كود مختصر
 */
export function getShortKey(fullKey) {
  // عرض أول 3 أجزاء فقط
  const parts = fullKey.split('-');
  if (parts.length >= 4) {
    return `${parts[0]}-${parts[1]}-${parts[2]}-${parts[3]}...`;
  }
  return fullKey;
}

/**
 * تشفير معلومات إضافية في الكود (اختياري)
 * @param {object} data - البيانات المراد تشفيرها
 * @returns {string}
 */
export function encodeKeyData(data) {
  const jsonString = JSON.stringify(data);
  return Buffer.from(jsonString).toString('base64');
}

/**
 * فك تشفير معلومات من الكود (اختياري)
 * @param {string} encodedData - البيانات المشفرة
 * @returns {object}
 */
export function decodeKeyData(encodedData) {
  try {
    const jsonString = Buffer.from(encodedData, 'base64').toString('utf-8');
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

/**
 * توليد رمز سري للتحقق من الكود
 * @param {string} key - كود التفعيل
 * @param {string} secret - السر المشترك
 * @returns {string}
 */
export function generateKeySignature(key, secret = process.env.ACTIVATION_KEY_SECRET || 'default-secret') {
  return crypto
    .createHmac('sha256', secret)
    .update(key)
    .digest('hex');
}

/**
 * التحقق من توقيع الكود
 * @param {string} key - كود التفعيل
 * @param {string} signature - التوقيع
 * @param {string} secret - السر المشترك
 * @returns {boolean}
 */
export function verifyKeySignature(key, signature, secret = process.env.ACTIVATION_KEY_SECRET || 'default-secret') {
  const expectedSignature = generateKeySignature(key, secret);
  return signature === expectedSignature;
}
