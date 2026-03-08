import sharp from 'sharp';

export async function createDataUrl(
  data: Buffer,
  mimeType?: string | null,
): Promise<string | null> {
  try {
    const sharpBuffer = await sharp(data).resize(50).toBuffer();

    return `data:${mimeType || 'image/png'};base64,${sharpBuffer.toString('base64')}`;
  } catch {
    return null;
  }
}
