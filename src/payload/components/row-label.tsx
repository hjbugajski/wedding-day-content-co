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
  const fieldValue: any = path.split('.').reduce((value, part) => value?.[part], data);
  const fallbackValue: any = fallbackPath?.split('.')?.reduce((value, part) => value?.[part], data);

  return <>{fieldValue || fallbackValue || `${fallback} ${rowNumber}`}</>;
}
