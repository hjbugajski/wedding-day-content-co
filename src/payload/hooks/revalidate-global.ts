import { revalidateTag } from 'next/cache';
import type { GlobalAfterChangeHook } from 'payload';

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({
  context,
  doc,
  global: { slug },
  req: { payload },
}) => {
  if (context?.disableRevalidate) {
    return doc;
  }

  payload.logger.info(`Revalidating global: ${slug}`);
  revalidateTag(`global:${slug}`);

  return doc;
};
