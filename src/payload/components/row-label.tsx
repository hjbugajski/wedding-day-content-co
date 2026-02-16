'use client';

import { useRowLabel } from '@payloadcms/ui';
import type { Data } from 'payload';

function getNestedValue(data: Data, path: string): unknown {
  return path.split('.').reduce<unknown>((value, part) => {
    if (value !== null && typeof value === 'object') {
      return (value as Record<string, unknown>)[part];
    }

    return undefined;
  }, data);
}

export function RowLabel({
  path,
  fallback,
  fallbackPath,
}: {
  path: string;
  fallback: string;
  fallbackPath?: string;
}) {
  const { data, rowNumber } = useRowLabel<Data>();
  const fieldValue = getNestedValue(data, path);
  const fallbackValue = fallbackPath ? getNestedValue(data, fallbackPath) : undefined;

  return <>{fieldValue || fallbackValue || `${fallback} ${rowNumber}`}</>;
}
