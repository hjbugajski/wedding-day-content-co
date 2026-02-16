'use client';

import { useRowLabel } from '@payloadcms/ui';
import type { Data } from 'payload';

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
  const fieldValue: unknown = path
    .split('.')
    .reduce<Record<string, unknown> | undefined>(
      (value, part) => value?.[part] as Record<string, unknown> | undefined,
      data as Record<string, unknown>,
    );
  const fallbackValue: unknown = fallbackPath
    ?.split('.')
    ?.reduce<Record<string, unknown> | undefined>(
      (value, part) => value?.[part] as Record<string, unknown> | undefined,
      data as Record<string, unknown>,
    );

  return <>{fieldValue || fallbackValue || `${fallback} ${rowNumber}`}</>;
}
