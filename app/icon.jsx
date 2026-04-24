import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

// Route segment config
export const runtime = 'nodejs';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default async function Icon() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'images', 'WhatsApp Image 2026-04-23 at 6.58.50 AM.jpeg');
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString('base64');
    const src = `data:image/jpeg;base64,${base64}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            borderRadius: '6px',
            overflow: 'hidden'
          }}
        >
          <img
            src={src}
            style={{ width: '150%', height: '150%', objectFit: 'cover' }}
            alt="Logo"
          />
        </div>
      ),
      { ...size }
    );
  } catch (error) {
    console.error('Error generating icon:', error);
    // Return a fallback image if something goes wrong
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            color: '#1a56db',
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          T
        </div>
      ),
      { ...size }
    );
  }
}
