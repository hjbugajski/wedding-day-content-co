import type { ControllerRenderProps } from 'react-hook-form';
import type { z } from 'zod';

import type { PayloadFormsCollection } from '@/payload/payload-types';

export type FieldMeta = PayloadFormsCollection['fields'][number];

export type FieldValue<M> =
  M extends Exclude<FieldMeta['blockType'], 'date'>
    ? string
    : M extends Extract<FieldMeta['blockType'], 'date'>
      ? (Date | undefined) | Date[] | ({ from?: Date; to?: Date } | Record<string, never>)
      : never;

export type FieldValues<M> =
  M extends Exclude<FieldMeta['blockType'], 'date'>
    ? Record<string, string>
    : M extends Extract<FieldMeta['blockType'], 'date'>
      ? Record<
          string,
          (Date | undefined) | Date[] | ({ from?: Date; to?: Date } | Record<string, never>)
        >
      : never;

export interface FieldConfig<M extends FieldMeta> {
  defaultValue: (meta: M) => FieldValue<M['blockType']>;
  schema: (meta: M) => z.ZodType<FieldValue<M['blockType']>>;
  Renderer: React.FC<{ meta: M; field: ControllerRenderProps<FieldValues<M['blockType']>> }>;
  format: (meta: M, value: any) => string;
}

export type FieldConfigs = {
  [K in FieldMeta['blockType']]: FieldConfig<Extract<FieldMeta, { blockType: K }>>;
};
