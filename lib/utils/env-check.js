/**
 * Utility to validate required environment variables
 * to help diagnose issues in production (Vercel)
 */

const REQUIRED_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NEXT_PUBLIC_APP_URL'
];

const RECOMMENDED_VARS = [
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_FROM'
];

export function validateEnv() {
  const missing = [];
  const invalid = [];

  REQUIRED_VARS.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      missing.push(varName);
    } else if (varName === 'JWT_SECRET' && value.length < 32) {
      invalid.push(`${varName} (must be at least 32 characters)`);
    } else if (varName === 'DATABASE_URL' && !value.includes('://')) {
      invalid.push(`${varName} (invalid format)`);
    }
  });

  if (missing.length > 0 || invalid.length > 0) {
    console.error('❌ Environment Configuration Error:');
    if (missing.length > 0) console.error(`   - Missing: ${missing.join(', ')}`);
    if (invalid.length > 0) console.error(`   - Invalid: ${invalid.join(', ')}`);
    return { valid: false, missing, invalid };
  }

  // Check recommended
  const missingRecommended = RECOMMENDED_VARS.filter(v => !process.env[v]);
  if (missingRecommended.length > 0) {
    console.warn(`⚠️ Warning: Missing recommended environment variables: ${missingRecommended.join(', ')}`);
  }

  return { valid: true };
}

export function getSafeEnvSnapshot() {
  const snapshot = {};
  [...REQUIRED_VARS, ...RECOMMENDED_VARS].forEach(v => {
    const value = process.env[v];
    if (!value) {
      snapshot[v] = 'MISSING';
    } else {
      // Obfuscate sensitive values
      if (v.includes('PASS') || v.includes('SECRET') || v.includes('URL') || v.includes('KEY') || v.includes('TOKEN')) {
        snapshot[v] = value.length > 8 
          ? `${value.substring(0, 4)}...${value.substring(value.length - 4)} (${value.length} chars)`
          : `SET (${value.length} chars)`;
      } else {
        snapshot[v] = value;
      }
    }
  });
  return snapshot;
}
