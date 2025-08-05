import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import type { FieldHook } from 'payload';

function isEmptyLexicalField(value: any): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const editorState = value as SerializedEditorState;

  if (!editorState.root || editorState.root.type !== 'root') {
    return false;
  }

  const { children } = editorState.root;

  if (!children || children.length !== 1) {
    return false;
  }

  const firstChild = children[0];

  if (
    firstChild &&
    typeof firstChild === 'object' &&
    'type' in firstChild &&
    firstChild.type === 'paragraph' &&
    'children' in firstChild &&
    Array.isArray(firstChild.children) &&
    firstChild.children.length === 0
  ) {
    return true;
  }

  return false;
}

export const cleanEmptyLexicalBeforeChange: FieldHook = ({ value }) => {
  if (isEmptyLexicalField(value)) {
    return null;
  }

  return value;
};

export const cleanEmptyLexicalAfterRead: FieldHook = ({ value }) => {
  if (isEmptyLexicalField(value)) {
    return null;
  }

  return value;
};
