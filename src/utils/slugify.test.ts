import { describe, expect, it } from 'vitest';

import { slugify } from '@/utils/slugify';

describe('slugify', () => {
  it('lowercases and hyphenates whitespace', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('strips punctuation and symbols', () => {
    expect(slugify("It's a Test! (v2)")).toBe('its-a-test-v2');
  });

  it('collapses consecutive whitespace to a single hyphen', () => {
    expect(slugify('multiple   spaces\tand\ttabs')).toBe('multiple-spaces-and-tabs');
  });

  it('keeps alphanumerics untouched', () => {
    expect(slugify('Route66')).toBe('route66');
  });

  it('returns undefined for an undefined input', () => {
    expect(slugify(undefined)).toBeUndefined();
  });

  it('returns empty string for an empty string input', () => {
    expect(slugify('')).toBe('');
  });
});
