import path from 'path';
import { fileURLToPath } from 'url';

import { muxVideoPlugin } from '@oversightstudio/mux-video';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { resendAdapter } from '@payloadcms/email-resend';
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs';
import {
  AlignFeature,
  BoldFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { type Endpoint, buildConfig } from 'payload';
import sharp from 'sharp';

import { env } from '@/env/server';
import { Role, hasRole } from '@/payload/access';
import { Clients } from '@/payload/collections/clients';
import { Faqs } from '@/payload/collections/faqs';
import { FormSubmissions } from '@/payload/collections/form-submissions';
import { Forms } from '@/payload/collections/forms';
import { Images } from '@/payload/collections/images';
import { MuxVideo } from '@/payload/collections/mux-video';
import { Pages } from '@/payload/collections/pages';
import { Users } from '@/payload/collections/users';
import { richTextFields } from '@/payload/fields/link';
import { Footer } from '@/payload/globals/footer';
import { Navigation } from '@/payload/globals/navigation';
import { getServerSideUrl } from '@/payload/utils/get-server-side-url';

type MuxAsset = {
  status: string;
  aspect_ratio?: string;
  duration?: number;
  playback_ids?: { id: string; policy: 'public' | 'signed' }[];
  tracks?: { type: string; max_width?: number; max_height?: number }[];
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const serverUrl = getServerSideUrl();
const whitelist = [serverUrl, ...env.WHITELIST.split(' ')].filter(Boolean);

/**
 * Preview/dev fallback for Mux's "asset ready" webhook, which cannot reach rotating preview hosts
 * (or localhost). The MuxPlaybackPoller field calls this to pull asset status from the Mux API and
 * fill `playbackOptions`. Registered only outside production (see endpoints below); production uses
 * the webhook.
 */
const muxRefreshEndpoint: Endpoint = {
  path: '/mux/refresh',
  method: 'post',
  handler: async (req) => {
    if (!req.user || req.user.collection !== req.payload.config.admin.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // The update() below runs via the Local API with overrideAccess, bypassing the collection's
    // update access control — so gate the endpoint to the same write roles.
    if (!hasRole(Role.Admin, Role.Editor)({ req })) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = (await req.json?.()) as { id?: string } | undefined;
    const id = body?.id;

    if (!id) {
      return Response.json({ error: 'Missing id' }, { status: 400 });
    }

    const doc = await req.payload.findByID({ collection: 'mux-video', id }).catch(() => null);

    if (!doc) {
      // Doc was deleted, or the id is malformed — nothing to refresh; terminal for the poller.
      return Response.json({ ready: false, status: 'no-asset' });
    }

    if (doc.playbackOptions?.length) {
      return Response.json({ ready: true });
    }

    if (!doc.assetId) {
      return Response.json({ ready: false, status: 'no-asset' });
    }

    const auth = Buffer.from(`${env.MUX_TOKEN_ID}:${env.MUX_TOKEN_SECRET}`).toString('base64');
    const response = await fetch(`https://api.mux.com/video/v1/assets/${doc.assetId}`, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (!response.ok) {
      // A 4xx from Mux (e.g. the asset was deleted on Mux's side) won't recover on retry — return a
      // terminal status so the poller stops. A 5xx is transient: surface it as 502 and let the
      // poller retry (bounded by MAX_ATTEMPTS).
      if (response.status < 500) {
        return Response.json({ ready: false, status: 'no-asset' });
      }

      return Response.json({ ready: false, status: 'error' }, { status: 502 });
    }

    const { data: asset } = (await response.json()) as { data: MuxAsset };

    if (asset.status !== 'ready') {
      return Response.json({ ready: false, status: asset.status });
    }

    const videoTrack = asset.tracks?.find((track) => track.type === 'video');

    await req.payload.update({
      collection: 'mux-video',
      id,
      data: {
        // Re-send the unchanged assetId: the plugin's beforeChange hook deletes the Mux asset when
        // the incoming assetId differs from the stored one, so omitting it (undefined !== stored)
        // would destroy the asset.
        assetId: doc.assetId,
        playbackOptions: asset.playback_ids?.map((playback) => ({
          playbackId: playback.id,
          playbackPolicy: playback.policy,
        })),
        aspectRatio: asset.aspect_ratio?.replace(':', '/'),
        duration: asset.duration,
        ...(videoTrack ? { maxWidth: videoTrack.max_width, maxHeight: videoTrack.max_height } : {}),
      },
    });

    return Response.json({ ready: true });
  },
};

export default buildConfig({
  admin: {
    components: {
      header: [
        {
          path: '@/payload/components/env-banner.tsx',
          exportName: 'EnvBanner',
        },
      ],
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
    user: Users.slug,
  },
  collections: [
    // collections
    Pages,
    Faqs,
    Images,
    MuxVideo,
    // crm
    Clients,
    Forms,
    FormSubmissions,
    // admin
    Users,
  ],
  cors: whitelist,
  csrf: whitelist,
  endpoints: [
    {
      path: '/health',
      method: 'get',
      handler: async (req) => {
        try {
          const startTime = Date.now();

          await req.payload.count({
            collection: 'users',
          });

          const responseTime = Date.now() - startTime;

          return Response.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            checks: {
              database: {
                status: 'healthy',
                responseTime,
              },
            },
          });
        } catch {
          return Response.json(
            {
              status: 'unhealthy',
              timestamp: new Date().toISOString(),
              checks: {
                database: {
                  status: 'unhealthy',
                  error: 'Database connection failed',
                },
              },
            },
            { status: 503 },
          );
        }
      },
    },
    // Preview/dev only: production fills playback data via the Mux webhook and never polls.
    ...(env.VERCEL_TARGET_ENV === 'production' ? [] : [muxRefreshEndpoint]),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: env.POSTGRES_CONNECTION_STRING,
    },
    migrationDir: path.join(dirname, 'migrations'),
    idType: 'uuid',
  }),
  editor: lexicalEditor({
    features: () => [
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
      ParagraphFeature(),
      OrderedListFeature(),
      UnorderedListFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      SuperscriptFeature(),
      SubscriptFeature(),
      AlignFeature(),
      IndentFeature(),
      HorizontalRuleFeature(),
      LinkFeature({ fields: richTextFields }),
      InlineToolbarFeature(),
    ],
  }),
  email: resendAdapter({
    defaultFromAddress: env.RESEND_FROM_ADDRESS_DEFAULT,
    defaultFromName: 'Wedding Day Content Co.',
    apiKey: env.RESEND_API_KEY,
  }),
  globals: [Navigation, Footer],
  graphQL: {
    disable: true,
  },
  onInit: async (payload) => {
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    });

    if (users.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: env.PAYLOAD_ADMIN_USER,
          password: env.PAYLOAD_ADMIN_PASSWORD,
          roles: [Role.Admin],
        },
      });
    }
  },
  plugins: [
    muxVideoPlugin({
      enabled: true,
      extendCollection: 'mux-video',
      initSettings: {
        tokenId: env.MUX_TOKEN_ID || '',
        tokenSecret: env.MUX_TOKEN_SECRET || '',
        webhookSecret: env.MUX_WEBHOOK_SIGNING_SECRET || '',
      },
      uploadSettings: {
        // Pin CORS to the canonical origin in production; preview hosts rotate and local dev has no
        // stable origin, so both use a wildcard (uploads are still gated behind admin auth).
        cors_origin: env.VERCEL_TARGET_ENV === 'production' ? serverUrl : '*',
      },
      // Guards the plugin's /mux/upload endpoints, which mint Mux direct-upload URLs — Mux warns
      // these must be authenticated or anyone could ingest assets into the account. Public read is
      // handled by the collection's own read access (see collections/mux-video.ts).
      access: (req) => hasRole(Role.Admin, Role.Editor)({ req }) === true,
    }),
    nestedDocsPlugin({
      collections: ['pages'],
      parentFieldSlug: 'parent',
      breadcrumbsFieldSlug: 'breadcrumbs',
      generateLabel: (_, doc) => doc?.title as string,
      // oxlint-disable-next-line typescript/restrict-template-expressions
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc?.slug}`, ''),
    }),
    s3Storage({
      collections: {
        [Images.slug]: true,
      },
      bucket: env.R2_BUCKET,
      config: {
        endpoint: env.R2_ENDPOINT,
        credentials: {
          accessKeyId: env.R2_ACCESS_KEY_ID,
          secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        },
        region: 'auto',
      },
      clientUploads: true,
    }),
  ],
  secret: env.PAYLOAD_SECRET,
  serverURL: serverUrl,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
