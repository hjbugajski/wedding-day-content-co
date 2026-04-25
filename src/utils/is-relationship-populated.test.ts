import { describe, expect, it } from 'vitest';

import { isRelationshipPopulated } from '@/utils/is-relationship-populated';

describe('isRelationshipPopulated', () => {
  it('returns true when value is a populated object relationship', () => {
    const item = { relationTo: 'pages', value: { id: 'abc', slug: 'home' } };
    expect(isRelationshipPopulated(item)).toBe(true);
  });

  it('returns false when value is an id string (unpopulated)', () => {
    expect(isRelationshipPopulated({ relationTo: 'pages', value: 'abc' })).toBe(false);
  });

  it('returns false for null', () => {
    expect(isRelationshipPopulated(null)).toBe(false);
  });

  it('returns false for primitives', () => {
    expect(isRelationshipPopulated('abc')).toBe(false);
    expect(isRelationshipPopulated(42)).toBe(false);
    expect(isRelationshipPopulated(undefined)).toBe(false);
  });

  it('returns false when the value key is missing', () => {
    expect(isRelationshipPopulated({ relationTo: 'pages' })).toBe(false);
  });
});
