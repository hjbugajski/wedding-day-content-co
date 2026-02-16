import sharp from 'sharp';

export async function createDataUrl(url: string, mimeType?: string | null): Promise<string | null> {
  const image = await fetch(url);
  const imageBuffer = await image.arrayBuffer();
  const sharpBuffer = await sharp(imageBuffer).resize(50).toBuffer();

  return `data:${mimeType || 'image/png'};base64,${sharpBuffer.toString('base64')}`;
}
