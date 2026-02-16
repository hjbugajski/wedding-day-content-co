type MultiRelationship = {
  relationTo: unknown;
  value: unknown;
};

export const isRelationshipPopulated = <T extends MultiRelationship>(item: unknown): item is T => {
  return typeof item === 'object' &&
    item !== null &&
    'value' in item &&
    typeof item.value !== 'string';
}
