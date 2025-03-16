import path from 'path';
import { fileURLToPath } from 'url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { resendAdapter } from '@payloadcms/email-resend';
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs';
import {
  AlignFeature,
  BoldFeature,
  FixedToolbarFeature,
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
import { Videos } from '@/payload/collections/videos';
import { richTextFields } from '@/payload/fields/link';
import { Footer } from '@/payload/globals/footer';
import { Navigation } from '@/payload/globals/navigation';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const whitelist = [env.SERVER_URL];

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
    Videos,
    // crm
    Clients,
    Forms,
    FormSubmissions,
    // admin
    Users,
  ],
  cors: whitelist,
  csrf: whitelist,
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
      FixedToolbarFeature(),
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
        [Videos.slug]: true,
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
    }),
  ],
  secret: env.PAYLOAD_SECRET,
  serverURL: env.SERVER_URL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
