'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, File, CheckCircle } from 'lucide-react';

/**
 * File Upload Component
 * Uses ImageKit for file storage
 */
export default function FileUpload({
  onUpload,
  onRemove,
  accept = 'image/*',
  maxSize = 5, // MB
  type = 'image',
  folder = '/uploads',
  multiple = false,
  preview = true,
  className = '',
  label = 'اسحب الملفات هنا أو انقر للاختيار',
  value = null,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(value);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setError('');
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`حجم الملف يتجاوز الحد المسموح (${maxSize}MB)`);
      return;
    }

    // Validate file type
    const acceptedTypes = accept.split(',').map(t => t.trim());
    const isValidType = acceptedTypes.some(t => {
      if (t === '*/*') return true;
      if (t.endsWith('/*')) {
        return file.type.startsWith(t.replace('/*', ''));
      }
      return file.type === t;
    });

    if (!isValidType) {
      setError('نوع الملف غير مدعوم');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل رفع الملف');
      }

      setUploadedFile(data.file);
      
      if (onUpload) {
        onUpload(data.file);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  const isImage = uploadedFile?.type?.startsWith('image') || type === 'image' || type === 'logo';

  return (
    <div className={className}>
      {/* Upload Area */}
      {!uploadedFile && (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            multiple={multiple}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              <p className="text-gray-600">جاري رفع الملف...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">{label}</p>
                <p className="text-sm text-gray-500 mt-1">
                  الحد الأقصى: {maxSize}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {uploadedFile && preview && (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
          {isImage ? (
            <div className="relative aspect-video">
              <img
                src={uploadedFile.url || uploadedFile.thumbnailUrl}
                alt={uploadedFile.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <File className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </div>
          )}

          {/* Success Badge */}
          <div className="absolute top-3 left-3">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              تم الرفع
            </div>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
