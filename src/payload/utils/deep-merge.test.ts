import { describe, expect, it } from 'vitest';

import { deepClone, deepMerge } from '@/payload/utils/deep-merge';

describe('deepClone', () => {
  it('returns primitives unchanged', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hi')).toBe('hi');
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  it('clones Date instances to a new Date with the same time', () => {
    const d = new Date(2025, 0, 1);
    const c = deepClone(d);
    expect(c).not.toBe(d);
    expect(c.getTime()).toBe(d.getTime());
  });

  it('clones RegExp instances preserving source and flags', () => {
    const r = /abc/gi;
    const c = deepClone(r);
    expect(c).not.toBe(r);
    expect(c.source).toBe('abc');
    expect(c.flags).toBe('gi');
  });

  it('deep-clones nested plain objects', () => {
    const src = { a: 1, nested: { b: [1, 2] } };
    const c = deepClone(src);
    expect(c).toEqual(src);
    expect(c).not.toBe(src);
    expect(c.nested).not.toBe(src.nested);
    expect(c.nested.b).not.toBe(src.nested.b);
  });

  it('clones arrays with non-reference identity', () => {
    const src = [{ a: 1 }, { a: 2 }];
    const c = deepClone(src);
    expect(c).toEqual(src);
    expect(c[0]).not.toBe(src[0]);
  });

  it('clones Map instances', () => {
    const src = new Map<string, { v: number }>([['a', { v: 1 }]]);
    const c = deepClone(src);
    expect(c).not.toBe(src);
    expect(c.get('a')).toEqual({ v: 1 });
    expect(c.get('a')).not.toBe(src.get('a'));
  });

  it('clones Set instances', () => {
    const inner = { v: 1 };
    const src = new Set([inner]);
    const c = deepClone(src);
    expect(c).not.toBe(src);
    expect(c.size).toBe(1);
    const cloned = [...c][0];
    expect(cloned).toEqual(inner);
    expect(cloned).not.toBe(inner);
  });

  it('handles circular references without overflowing', () => {
    type Node = { name: string; self?: Node };
    const src: Node = { name: 'root' };
    src.self = src;

    const c = deepClone(src);
    expect(c.name).toBe('root');
    expect(c.self).toBe(c);
  });
});

describe('deepMerge', () => {
  it('returns {} when both sides are non-objects', () => {
    expect(deepMerge(null as unknown as object, null as unknown as object)).toEqual({});
  });

  it('returns target when source is not an object', () => {
    expect(deepMerge({ a: 1 }, null as unknown as object)).toEqual({ a: 1 });
  });

  it('returns source when target is not an object', () => {
    expect(deepMerge(null as unknown as object, { a: 1 })).toEqual({ a: 1 });
  });

  it('overwrites scalars with source values', () => {
    expect(deepMerge<{ a: number; b: number }>({ a: 1, b: 2 }, { a: 9 })).toEqual({ a: 9, b: 2 });
  });

  it('recursively merges nested objects', () => {
    type Nested = { a: Record<string, number> };
    expect(deepMerge<Nested>({ a: { x: 1, y: 2 } }, { a: { y: 20, z: 30 } })).toEqual({
      a: { x: 1, y: 20, z: 30 },
    });
  });

  it('concatenates and dedupes arrays when no filterBy is provided', () => {
    expect(deepMerge({ tags: ['a', 'b'] }, { tags: ['b', 'c'] })).toEqual({
      tags: ['a', 'b', 'c'],
    });
  });

  it('dedupes arrays of objects by the configured key', () => {
    const out = deepMerge(
      {
        items: [
          { id: '1', v: 'a' },
          { id: '2', v: 'b' },
        ],
      },
      {
        items: [
          { id: '2', v: 'B' },
          { id: '3', v: 'c' },
        ],
      },
      { items: 'id' },
    );
    expect(out.items).toEqual([
      { id: '1', v: 'a' },
      { id: '2', v: 'b' },
      { id: '3', v: 'c' },
    ]);
  });

  it('returns a new object (does not mutate target)', () => {
    type Nested = { a: Record<string, number> };
    const target: Nested = { a: { x: 1 } };
    const out = deepMerge<Nested>(target, { a: { y: 2 } });
    expect(out).not.toBe(target);
    expect(target).toEqual({ a: { x: 1 } });
  });
});
