import { revalidatePath } from 'next/cache';
import type { Payload } from 'payload';

import type { PayloadPagesCollection } from '@/payload/payload-types';

interface RevalidationContext {
  payload: Payload;
  logger?: (message: string) => void;
}

export async function findPagesUsingCollection(
  { payload, logger }: RevalidationContext,
  collection: string,
  itemId: string,
): Promise<PayloadPagesCollection[]> {
  try {
    const pages = await payload.find({
      collection: 'pages',
      where: {
        _status: { equals: 'published' },
      },
      pagination: false,
      depth: 0,
      select: {
        path: true,
        content: true,
      },
    });

    const referencingPages = pages.docs.filter((page) =>
      hasReferenceInContent(page.content, collection, itemId),
    );

    logger?.(`Found ${referencingPages.length} pages using ${collection}:${itemId}`);

    return referencingPages as PayloadPagesCollection[];
  } catch (error) {
    logger?.(
      `Error finding pages using ${collection}:${itemId}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );

    return [];
  }
}

function hasReferenceInContent(content: unknown, collection: string, itemId: string): boolean {
  if (typeof content === 'string') {
    return content === itemId;
  }

  if (!content || typeof content !== 'object') {
    return false;
  }

  if (Array.isArray(content)) {
    return content.some((item) => hasReferenceInContent(item, collection, itemId));
  }

  const obj = content as Record<string, unknown>;

  if (obj.relationTo === collection) {
    const v = obj.value;

    if (typeof v === 'string') {
      return v === itemId;
    }

    if (Array.isArray(v)) {
      return v.some((val) =>
        typeof val === 'string'
          ? val === itemId
          : typeof val === 'object' &&
            val !== null &&
            'id' in (val as Record<string, unknown>) &&
            typeof (val as Record<string, unknown>).id === 'string' &&
            (val as Record<string, unknown>).id === itemId,
      );
    }

    if (typeof v === 'object' && v !== null) {
      const vObj = v as Record<string, unknown>;

      if (typeof vObj.id === 'string' && vObj.id === itemId) {
        return true;
      }
    }
  }

  if ('id' in obj && typeof obj.id === 'string' && obj.id === itemId) {
    return true;
  }

  return Object.values(obj).some((value) => hasReferenceInContent(value, collection, itemId));
}

export async function revalidatePagesUsingCollection(
  context: RevalidationContext,
  collection: string,
  itemId: string,
): Promise<void> {
  const pages = await findPagesUsingCollection(context, collection, itemId);

  for (const page of pages) {
    if (page.path) {
      context.logger?.(`Revalidating page: ${page.path}`);

      if (page.path === '/home') {
        revalidatePath('/');
      }

      revalidatePath(page.path);
    }
  }
}
