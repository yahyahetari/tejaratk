// lib/auth/verification.js
// ملف موحد لجميع دوال التحقق

export {
  generateVerificationCode,
  generateCode,
  saveVerificationCode,
  createVerificationCode,
  verifyCode,
  sendVerificationCode,
} from './verification-code';
