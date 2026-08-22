import type { Payload } from 'payload';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePath, revalidateTag } = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath, revalidateTag }));

import {
  findPagesUsingCollection,
  revalidatePagesUsingCollection,
} from '@/payload/utils/revalidation';

const makePayload = (docs: unknown[], opts: { throwOnFind?: boolean } = {}) => {
  const find = vi.fn(async () => {
    if (opts.throwOnFind) throw new Error('boom');
    return { docs };
  });

  return { find } as unknown as Payload;
};

const context = (payload: Payload) => ({ payload, logger: vi.fn() });

describe('findPagesUsingCollection', () => {
  beforeEach(() => {
    revalidatePath.mockClear();
    revalidateTag.mockClear();
  });

  it('queries pages filtered to published docs and returns those that reference the item', async () => {
    const pages = [
      { path: '/a', content: { some: { relationTo: 'authors', value: 'author-1' } } },
      { path: '/b', content: { unrelated: true } },
      { path: '/c', content: [{ relationTo: 'authors', value: { id: 'author-1' } }] },
    ];
    const payload = makePayload(pages);
    const ctx = context(payload);

    const result = await findPagesUsingCollection(ctx, 'authors', 'author-1');

    expect(payload.find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'pages',
        where: { _status: { equals: 'published' } },
        pagination: false,
        depth: 0,
      }),
    );
    expect(result.pages.map((p) => p.path)).toEqual(['/a', '/c']);
    expect(result.failed).toBe(false);
    expect(ctx.logger).toHaveBeenCalledWith('Found 2 pages using authors:author-1');
  });

  it('matches references inside arrays of ids', async () => {
    const pages = [{ path: '/a', content: { relationTo: 'tags', value: ['tag-1', 'tag-2'] } }];
    const result = await findPagesUsingCollection(context(makePayload(pages)), 'tags', 'tag-2');
    expect(result.pages).toHaveLength(1);
  });

  it('matches a plain relationship id stored on a block', async () => {
    const pages = [{ path: '/a', content: [{ blockType: 'hero', video: 'mux-1' }] }];
    const result = await findPagesUsingCollection(
      context(makePayload(pages)),
      'mux-video',
      'mux-1',
    );
    expect(result.pages).toHaveLength(1);
  });

  it('reports failure and logs when payload.find throws', async () => {
    const ctx = context(makePayload([], { throwOnFind: true }));
    const result = await findPagesUsingCollection(ctx, 'tags', 'x');
    expect(result).toEqual({ pages: [], failed: true });
    expect(ctx.logger).toHaveBeenCalledWith(expect.stringContaining('Error finding pages'));
  });
});

describe('revalidatePagesUsingCollection', () => {
  beforeEach(() => {
    revalidatePath.mockClear();
    revalidateTag.mockClear();
  });

  it('calls revalidatePath once per page path', async () => {
    const pages = [
      { path: '/a', content: { relationTo: 'authors', value: 'author-1' } },
      { path: '/about', content: { relationTo: 'authors', value: 'author-1' } },
    ];
    await revalidatePagesUsingCollection(context(makePayload(pages)), 'authors', 'author-1');

    expect(revalidatePath).toHaveBeenCalledWith('/a');
    expect(revalidatePath).toHaveBeenCalledWith('/about');
    expect(revalidateTag).toHaveBeenCalledWith('pages', { expire: 0 });
  });

  it('expires the pages tag for a mux-video id referenced by a hero block', async () => {
    const pages = [{ path: '/home', content: [{ blockType: 'hero', video: 'mux-1' }] }];
    await revalidatePagesUsingCollection(context(makePayload(pages)), 'mux-video', 'mux-1');

    expect(revalidateTag).toHaveBeenCalledWith('pages', { expire: 0 });
    expect(revalidatePath).toHaveBeenCalledWith('/');
  });

  it('leaves the pages tag alone when the query succeeds with no referencing pages', async () => {
    await revalidatePagesUsingCollection(context(makePayload([])), 'authors', 'x');

    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('expires the pages tag when the query fails', async () => {
    const ctx = context(makePayload([], { throwOnFind: true }));
    await revalidatePagesUsingCollection(ctx, 'authors', 'x');

    expect(revalidateTag).toHaveBeenCalledWith('pages', { expire: 0 });
  });

  it('also revalidates "/" when a page path is "/home"', async () => {
    const pages = [{ path: '/home', content: { relationTo: 'authors', value: 'x' } }];
    await revalidatePagesUsingCollection(context(makePayload(pages)), 'authors', 'x');

    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidatePath).toHaveBeenCalledWith('/home');
  });

  it('skips pages with no path', async () => {
    const pages = [
      { path: null, content: { relationTo: 'authors', value: 'x' } },
      { content: { relationTo: 'authors', value: 'x' } },
    ];
    await revalidatePagesUsingCollection(context(makePayload(pages)), 'authors', 'x');
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
