import type { ReactNode } from 'react';

import type { z } from 'zod';

import type { PayloadFormsCollection } from '@/payload/payload-types';

export type FieldMeta = PayloadFormsCollection['fields'][number];

export type FieldValue<M> =
  M extends Exclude<FieldMeta['blockType'], 'date'>
    ? string
    : M extends Extract<FieldMeta['blockType'], 'date'>
      ? (Date | undefined) | Date[] | ({ from?: Date; to?: Date } | Record<string, never>)
      : never;

export interface FieldConfig<M extends FieldMeta> {
  defaultValue: (meta: M) => FieldValue<M['blockType']>;
  schema: (meta: M) => z.ZodType<FieldValue<M['blockType']>>;
  Renderer: React.FC<{ meta: M; optionDescriptions?: Record<string, ReactNode> }>;
  format: (meta: M, value: unknown) => string;
}

export type FieldConfigs = {
  [K in FieldMeta['blockType']]: FieldConfig<Extract<FieldMeta, { blockType: K }>>;
};
