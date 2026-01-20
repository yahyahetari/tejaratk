/**
 * ImageKit Upload Integration
 * استبدال AWS S3 بـ ImageKit لرفع الملفات
 */

// ImageKit Configuration
export const IMAGEKIT_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/your_id',
};

/**
 * Get ImageKit authentication parameters
 * Used for client-side uploads
 */
export async function getImageKitAuth() {
  const crypto = require('crypto');
  
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 3600; // 1 hour expiry
  
  const privateKey = IMAGEKIT_CONFIG.privateKey;
  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(token + expire)
    .digest('hex');
  
  return {
    token,
    expire,
    signature,
    publicKey: IMAGEKIT_CONFIG.publicKey,
    urlEndpoint: IMAGEKIT_CONFIG.urlEndpoint,
  };
}

/**
 * Upload file to ImageKit (Server-side)
 * @param {Buffer|string} file - File buffer or base64 string
 * @param {string} fileName - Name of the file
 * @param {string} folder - Folder path in ImageKit
 * @returns {Promise<Object>} Upload result
 */
export async function uploadToImageKit(file, fileName, folder = '/uploads') {
  const FormData = require('form-data');
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName);
  formData.append('folder', folder);
  
  // Create authentication signature
  const auth = await getImageKitAuth();
  formData.append('publicKey', auth.publicKey);
  formData.append('signature', auth.signature);
  formData.append('expire', auth.expire);
  formData.append('token', auth.token);
  
  try {
    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(IMAGEKIT_CONFIG.privateKey + ':').toString('base64')}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }
    
    const result = await response.json();
    
    return {
      success: true,
      fileId: result.fileId,
      name: result.name,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      filePath: result.filePath,
      fileType: result.fileType,
      size: result.size,
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw error;
  }
}

/**
 * Delete file from ImageKit
 * @param {string} fileId - ImageKit file ID
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteFromImageKit(fileId) {
  try {
    const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${Buffer.from(IMAGEKIT_CONFIG.privateKey + ':').toString('base64')}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Delete failed');
    }
    
    return { success: true };
  } catch (error) {
    console.error('ImageKit delete error:', error);
    throw error;
  }
}

/**
 * Get optimized image URL with transformations
 * @param {string} imagePath - Image path in ImageKit
 * @param {Object} options - Transformation options
 * @returns {string} Transformed image URL
 */
export function getOptimizedImageUrl(imagePath, options = {}) {
  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    blur,
    grayscale,
    crop = 'at_max',
  } = options;
  
  const transformations = [];
  
  if (width) transformations.push(`w-${width}`);
  if (height) transformations.push(`h-${height}`);
  if (quality) transformations.push(`q-${quality}`);
  if (format) transformations.push(`f-${format}`);
  if (blur) transformations.push(`bl-${blur}`);
  if (grayscale) transformations.push('e-grayscale');
  if (crop) transformations.push(`c-${crop}`);
  
  const transformString = transformations.length > 0 
    ? `tr:${transformations.join(',')}` 
    : '';
  
  const baseUrl = IMAGEKIT_CONFIG.urlEndpoint;
  
  if (transformString) {
    return `${baseUrl}/${transformString}${imagePath}`;
  }
  
  return `${baseUrl}${imagePath}`;
}

/**
 * Get thumbnail URL
 * @param {string} imagePath - Image path
 * @param {number} size - Thumbnail size (default 200)
 * @returns {string} Thumbnail URL
 */
export function getThumbnailUrl(imagePath, size = 200) {
  return getOptimizedImageUrl(imagePath, {
    width: size,
    height: size,
    crop: 'at_max',
    quality: 70,
  });
}

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  } = options;
  
  const errors = [];
  
  if (file.size > maxSize) {
    errors.push(`حجم الملف يتجاوز الحد المسموح (${Math.round(maxSize / 1024 / 1024)}MB)`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('نوع الملف غير مدعوم');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate unique file name
 * @param {string} originalName - Original file name
 * @returns {string} Unique file name
 */
export function generateUniqueFileName(originalName) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
  
  return `${baseName}_${timestamp}_${random}.${extension}`;
}

export default {
  IMAGEKIT_CONFIG,
  getImageKitAuth,
  uploadToImageKit,
  deleteFromImageKit,
  getOptimizedImageUrl,
  getThumbnailUrl,
  validateFile,
  generateUniqueFileName,
};
