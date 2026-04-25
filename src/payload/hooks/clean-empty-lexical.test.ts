import { describe, expect, it } from 'vitest';

import {
  cleanEmptyLexicalAfterRead,
  cleanEmptyLexicalBeforeChange,
} from '@/payload/hooks/clean-empty-lexical';

const emptyEditor = {
  root: {
    type: 'root',
    children: [{ type: 'paragraph', children: [] }],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
};

const nonEmptyEditor = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'hi', version: 1 }],
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
};

describe('cleanEmptyLexicalBeforeChange', () => {
  it('returns null for a lexical editor whose only paragraph is empty', () => {
    expect(cleanEmptyLexicalBeforeChange({ value: emptyEditor } as never)).toBeNull();
  });

  it('returns the value unchanged for a non-empty editor', () => {
    expect(cleanEmptyLexicalBeforeChange({ value: nonEmptyEditor } as never)).toBe(nonEmptyEditor);
  });

  it('returns primitive values unchanged', () => {
    expect(cleanEmptyLexicalBeforeChange({ value: undefined } as never)).toBeUndefined();
    expect(cleanEmptyLexicalBeforeChange({ value: null } as never)).toBeNull();
    expect(cleanEmptyLexicalBeforeChange({ value: 'string' } as never)).toBe('string');
  });

  it('returns the value unchanged when root type is not "root"', () => {
    const v = { root: { type: 'other', children: [] } };
    expect(cleanEmptyLexicalBeforeChange({ value: v } as never)).toBe(v);
  });

  it('returns the value unchanged when children length is not 1', () => {
    const v = {
      root: {
        type: 'root',
        children: [
          { type: 'paragraph', children: [] },
          { type: 'paragraph', children: [] },
        ],
      },
    };
    expect(cleanEmptyLexicalBeforeChange({ value: v } as never)).toBe(v);
  });
});

describe('cleanEmptyLexicalAfterRead', () => {
  it('mirrors the beforeChange behaviour', () => {
    expect(cleanEmptyLexicalAfterRead({ value: emptyEditor } as never)).toBeNull();
    expect(cleanEmptyLexicalAfterRead({ value: nonEmptyEditor } as never)).toBe(nonEmptyEditor);
  });
});
