// lib/validation/index.js

/**
 * التحقق من صحة البريد الإلكتروني
 * @param {string} email - البريد الإلكتروني
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

/**
 * التحقق من صحة رقم الهاتف
 * @param {string} phone - رقم الهاتف
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // يقبل أرقام الهاتف العمانية والخليجية
  const phoneRegex = /^(\+?968|00968)?[279]\d{7}$/;
  const cleanPhone = phone.replace(/[\s-]/g, '');
  return phoneRegex.test(cleanPhone);
}

/**
 * التحقق من قوة كلمة المرور
 * @param {string} password - كلمة المرور
 * @returns {object} - نتيجة التحقق
 */
export function validatePassword(password) {
  const result = {
    isValid: true,
    errors: [],
    strength: 0
  };

  if (!password || typeof password !== 'string') {
    result.isValid = false;
    result.errors.push('كلمة المرور مطلوبة');
    return result;
  }

  if (password.length < 8) {
    result.isValid = false;
    result.errors.push('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
  } else {
    result.strength += 1;
  }

  if (password.length >= 12) {
    result.strength += 1;
  }

  if (/[A-Z]/.test(password)) {
    result.strength += 1;
  } else {
    result.errors.push('يُفضل إضافة حرف كبير');
  }

  if (/[a-z]/.test(password)) {
    result.strength += 1;
  }

  if (/[0-9]/.test(password)) {
    result.strength += 1;
  } else {
    result.errors.push('يُفضل إضافة رقم');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.strength += 1;
  }

  return result;
}

/**
 * التحقق من صحة اسم المستخدم
 * @param {string} name - الاسم
 * @param {number} minLength - الحد الأدنى للطول
 * @param {number} maxLength - الحد الأقصى للطول
 * @returns {object}
 */
export function validateName(name, minLength = 2, maxLength = 100) {
  const result = {
    isValid: true,
    errors: []
  };

  if (!name || typeof name !== 'string') {
    result.isValid = false;
    result.errors.push('الاسم مطلوب');
    return result;
  }

  const trimmedName = name.trim();

  if (trimmedName.length < minLength) {
    result.isValid = false;
    result.errors.push(`الاسم يجب أن يكون ${minLength} أحرف على الأقل`);
  }

  if (trimmedName.length > maxLength) {
    result.isValid = false;
    result.errors.push(`الاسم يجب أن لا يتجاوز ${maxLength} حرف`);
  }

  // التحقق من عدم وجود أحرف خاصة غير مسموحة
  if (/[<>{}[\]\\\/]/.test(trimmedName)) {
    result.isValid = false;
    result.errors.push('الاسم يحتوي على أحرف غير مسموحة');
  }

  return result;
}

/**
 * التحقق من صحة الـ slug
 * @param {string} slug - الـ slug
 * @returns {boolean}
 */
export function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  // يقبل أحرف صغيرة وأرقام وشرطات فقط
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * تحويل النص إلى slug
 * @param {string} text - النص
 * @returns {string}
 */
export function generateSlug(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // استبدال المسافات بشرطات
    .replace(/[^\w\-]+/g, '')       // إزالة الأحرف غير المسموحة
    .replace(/\-\-+/g, '-')         // استبدال الشرطات المتعددة بشرطة واحدة
    .replace(/^-+/, '')             // إزالة الشرطات من البداية
    .replace(/-+$/, '');            // إزالة الشرطات من النهاية
}

/**
 * التحقق من صحة URL
 * @param {string} url - الرابط
 * @returns {boolean}
 */
export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * التحقق من صحة السعر
 * @param {number} price - السعر
 * @returns {object}
 */
export function validatePrice(price) {
  const result = {
    isValid: true,
    errors: []
  };

  if (price === undefined || price === null) {
    result.isValid = false;
    result.errors.push('السعر مطلوب');
    return result;
  }

  const numPrice = Number(price);

  if (isNaN(numPrice)) {
    result.isValid = false;
    result.errors.push('السعر يجب أن يكون رقماً');
    return result;
  }

  if (numPrice < 0) {
    result.isValid = false;
    result.errors.push('السعر لا يمكن أن يكون سالباً');
  }

  if (numPrice > 999999) {
    result.isValid = false;
    result.errors.push('السعر كبير جداً');
  }

  return result;
}

/**
 * التحقق من صحة الكمية
 * @param {number} quantity - الكمية
 * @returns {object}
 */
export function validateQuantity(quantity) {
  const result = {
    isValid: true,
    errors: []
  };

  if (quantity === undefined || quantity === null) {
    result.isValid = false;
    result.errors.push('الكمية مطلوبة');
    return result;
  }

  const numQuantity = Number(quantity);

  if (isNaN(numQuantity) || !Number.isInteger(numQuantity)) {
    result.isValid = false;
    result.errors.push('الكمية يجب أن تكون رقماً صحيحاً');
    return result;
  }

  if (numQuantity < 0) {
    result.isValid = false;
    result.errors.push('الكمية لا يمكن أن تكون سالبة');
  }

  if (numQuantity > 999999) {
    result.isValid = false;
    result.errors.push('الكمية كبيرة جداً');
  }

  return result;
}

/**
 * تنظيف وتعقيم النص
 * @param {string} text - النص
 * @returns {string}
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .trim()
    .replace(/[<>]/g, '')  // إزالة علامات HTML
    .replace(/javascript:/gi, '')  // إزالة محاولات XSS
    .replace(/on\w+=/gi, '');  // إزالة event handlers
}

/**
 * التحقق من صحة تاريخ
 * @param {string|Date} date - التاريخ
 * @returns {boolean}
 */
export function isValidDate(date) {
  if (!date) return false;
  
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
}

/**
 * التحقق من صحة رمز العملة
 * @param {string} currency - رمز العملة
 * @returns {boolean}
 */
export function isValidCurrency(currency) {
  const validCurrencies = ['OMR', 'SAR', 'AED', 'KWD', 'BHD', 'QAR', 'USD', 'EUR'];
  return validCurrencies.includes(currency?.toUpperCase());
}
