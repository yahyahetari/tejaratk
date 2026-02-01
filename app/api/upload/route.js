import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { getSession } = await import('@/lib/auth/session');
    const { uploadToImageKit, validateFile, generateUniqueFileName } = await import('@/lib/upload/imagekit');

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || '/uploads';
    const type = formData.get('type') || 'general';

    if (!file) {
      return NextResponse.json({ error: 'لم يتم تحديد ملف' }, { status: 400 });
    }

    const validationOptions = getValidationOptions(type);
    const validation = validateFile(file, validationOptions);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueFileName = generateUniqueFileName(file.name);
    const uploadFolder = `${folder}/${session.merchant?.id || session.user?.id}`;

    const result = await uploadToImageKit(buffer, uniqueFileName, uploadFolder);

    return NextResponse.json({
      success: true,
      file: {
        id: result.fileId,
        name: result.name,
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        path: result.filePath,
        type: result.fileType,
        size: result.size,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'فشل رفع الملف' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { getSession } = await import('@/lib/auth/session');

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { getImageKitAuth } = await import('@/lib/upload/imagekit');
    const auth = await getImageKitAuth();

    return NextResponse.json(auth);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'فشل الحصول على معلومات المصادقة' }, { status: 500 });
  }
}

function getValidationOptions(type) {
  const options = {
    image: { maxSize: 5 * 1024 * 1024, allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] },
    logo: { maxSize: 2 * 1024 * 1024, allowedTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'] },
    document: { maxSize: 10 * 1024 * 1024, allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'] },
    license: { maxSize: 10 * 1024 * 1024, allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'] },
    general: { maxSize: 10 * 1024 * 1024, allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'] },
  };
  return options[type] || options.general;
}
