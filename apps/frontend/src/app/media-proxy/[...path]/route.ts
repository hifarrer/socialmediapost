import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  }
) => {
  const bucketUrl = process.env.CLOUDFLARE_BUCKET_URL;
  if (!bucketUrl) {
    return NextResponse.json(
      { error: 'Storage not configured' },
      { status: 500 }
    );
  }

  const { path } = await context.params;
  const filePath = path.join('/');
  const r2Url = `${bucketUrl}/${filePath}`;

  const r2Response = await fetch(r2Url);
  if (!r2Response.ok || !r2Response.body) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const contentType =
    r2Response.headers.get('Content-Type') || 'application/octet-stream';
  const contentLength = r2Response.headers.get('Content-Length');

  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=31536000, immutable',
  };
  if (contentLength) {
    headers['Content-Length'] = contentLength;
  }

  return new Response(r2Response.body, { headers });
};
