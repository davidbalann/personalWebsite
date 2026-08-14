import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'David Balan';
  const subtitle = searchParams.get('subtitle') || 'Software · AI Engineer';
  const tags = (searchParams.get('tags') || '').split(',').filter(Boolean).slice(0, 5);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#07090f',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#4a5570', letterSpacing: 4, textTransform: 'uppercase' }}>
          DavidBalan.Dev
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, color: '#dde2f0', letterSpacing: -2 }}>
            {title}
          </div>
          <div style={{ display: 'flex', fontSize: 32, color: '#8a93b3', marginTop: 16 }}>
            {subtitle}
          </div>
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              {tags.map((t) => (
                <div
                  key={t}
                  style={{
                    display: 'flex',
                    fontSize: 22,
                    color: '#e08b3a',
                    border: '1px solid #e08b3a',
                    borderRadius: 4,
                    padding: '8px 16px',
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
