import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  Field,
} from 'payload';

import { env } from '@/env/server';
import { Role, hasRole } from '@/payload/access';
import type { MuxVideo as MuxVideoDoc } from '@/payload/payload-types';
import { revalidatePagesUsingCollection } from '@/payload/utils/revalidation';

// Preview/dev only: Mux's "asset ready" webhook can't reach rotating preview hosts (or localhost),
// so a client-side poller fills `playbackOptions` from the Mux API via /api/mux/refresh. Production
// relies on the webhook and omits both this field and that endpoint (see payload.config.ts). The
// field is `type: 'ui'` — no DB column — so gating it by env keeps the schema identical everywhere.
const playbackPollerField: Field = {
  name: 'playbackPoller',
  type: 'ui',
  admin: {
    components: {
      Field: '@/payload/components/mux-playback-poller.tsx#MuxPlaybackPoller',
    },
  },
};

/**
 * Hero blocks inline the Mux doc into `cacheLife('max')` page entries, and Mux's "asset ready"
 * webhook writes `playbackOptions` after the doc is first created — without this the page cache
 * keeps serving the playback-less version until an unrelated edit expires it.
 */
const revalidateMuxVideoAfterChange: CollectionAfterChangeHook<MuxVideoDoc> = async ({
  context,
  doc,
  req: { payload },
}) => {
  if (context?.disableRevalidate) {
    return doc;
  }

  const logger = (message: string) => payload.logger.info(message);

  await revalidatePagesUsingCollection({ payload, logger }, 'mux-video', doc.id);

  return doc;
};

const revalidateMuxVideoAfterDelete: CollectionAfterDeleteHook<MuxVideoDoc> = async ({
  doc,
  req: { payload },
}) => {
  const logger = (message: string) => payload.logger.info(message);

  await revalidatePagesUsingCollection({ payload, logger }, 'mux-video', doc.id);

  return doc;
};

/**
 * Base collection merged into `@oversightstudio/mux-video`'s generated collection via the plugin's
 * `extendCollection` option (its fields are concatenated onto the plugin's).
 *
 * Access: public `read` so videos render on the public site, plus role-gated writes matching the
 * rest of the CMS. The `read` here overrides the plugin's generated read, which mirrors the plugin
 * `access` option — and that option doubles as the guard for the plugin's `/mux/upload` URL-minting
 * endpoints, so it is locked to Admin/Editor in payload.config.ts rather than left public.
 */
export const MuxVideo: CollectionConfig<'mux-video'> = {
  slug: 'mux-video',
  access: {
    read: () => true,
    create: hasRole(Role.Admin, Role.Editor),
    update: hasRole(Role.Admin, Role.Editor),
    delete: hasRole(Role.Admin),
  },
  hooks: {
    afterChange: [revalidateMuxVideoAfterChange],
    afterDelete: [revalidateMuxVideoAfterDelete],
  },
  fields: env.VERCEL_TARGET_ENV === 'production' ? [] : [playbackPollerField],
};
