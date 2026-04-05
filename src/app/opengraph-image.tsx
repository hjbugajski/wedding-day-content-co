import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

export const alt = 'Wedding Day Content Co.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const [nightingale, figtree] = await Promise.all([
    readFile(join(process.cwd(), 'public/font/DTNightingale.ttf')),
    readFile(join(process.cwd(), 'public/font/Figtree-Regular.ttf')),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#3E1922',
        padding: 64,
      }}
    >
      <div
        style={{
          fontSize: 128,
          fontFamily: 'Nightingale',
          color: '#F0DAE3',
          lineHeight: 1.15,
        }}
      >
        Wedding Day Content Co.
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div
          style={{
            width: '100%',
            height: 2,
            backgroundColor: '#F0DAE3',
            opacity: 0.4,
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'Figtree',
            fontSize: 32,
            color: '#F0DAE3',
          }}
        >
          <span>Storytelling for love that inspires</span>
          <span>@weddingdaycontentco</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Nightingale', data: nightingale, style: 'normal', weight: 400 },
        { name: 'Figtree', data: figtree, style: 'normal', weight: 400 },
      ],
    },
  );
}
