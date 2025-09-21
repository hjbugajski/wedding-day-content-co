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
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { env } from '@/env/server';
import { Role } from '@/payload/access';
import { Clients } from '@/payload/collections/clients';
import { Faqs } from '@/payload/collections/faqs';
import { FormSubmissions } from '@/payload/collections/form-submissions';
import { Forms } from '@/payload/collections/forms';
import { Images } from '@/payload/collections/images';
import { Pages } from '@/payload/collections/pages';
import { Users } from '@/payload/collections/users';
import { richTextFields } from '@/payload/fields/link';
import { Footer } from '@/payload/globals/footer';
import { Navigation } from '@/payload/globals/navigation';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const whitelist = [env.SERVER_URL, ...env.WHITELIST.split(' ')].filter(Boolean);

export default buildConfig({
  admin: {
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

          await req.payload.find({
            collection: 'users',
            limit: 1,
            pagination: false,
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
    defaultFromName: env.RESEND_FROM_NAME_DEFAULT,
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
      initSettings: {
        tokenId: env.MUX_TOKEN_ID || '',
        tokenSecret: env.MUX_TOKEN_SECRET || '',
        webhookSecret: env.MUX_WEBHOOK_SIGNING_SECRET || '',
      },
      uploadSettings: {
        cors_origin: env.SERVER_URL,
      },
      access: () => true,
    }),
    nestedDocsPlugin({
      collections: ['pages'],
      parentFieldSlug: 'parent',
      breadcrumbsFieldSlug: 'breadcrumbs',
      generateLabel: (_, doc) => doc?.title as string,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
  serverURL: env.SERVER_URL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
