import { Body, Font, Head, Heading, Html, Preview, Tailwind } from 'react-email';

import type {
  PayloadFormSubmissionsCollection,
  PayloadFormsCollection,
} from '@/payload/payload-types';
import { tailwindEmailConfig } from '@/services/email/tailwind';
import { slugify } from '@/utils/slugify';

interface Props {
  data: PayloadFormSubmissionsCollection['data'];
  form: PayloadFormsCollection;
}

export const FormSubmissionEmailTemplate = ({ data, form }: Props) => (
  <Tailwind config={tailwindEmailConfig}>
    <Html lang="en">
      <Head>
        <Font
          fallbackFontFamily="sans-serif"
          fontFamily="Figtree"
          fontWeight={400}
          fontStyle="normal"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap',
            format: 'woff',
          }}
        />
        <title>{`New ${form.title} Submission`}</title>
      </Head>
      <Preview>You have a new {form.title.toLowerCase()} submission!</Preview>
      <Body className="font-sans text-neutral-800">
        <Heading as="h1" className="mt-10 mb-8 text-4xl first:mt-0 last:mb-0 xs:text-5xl">
          {form.title}
        </Heading>
        <dl>
          {data.map((field) => (
            <div key={field.id || slugify(field.label)} className="mb-6 last:mb-0">
              <dt className="m-0 mb-2 text-sm leading-none font-normal text-neutral-600">
                {field.label}
              </dt>
              <dd className="m-0 text-lg">{field.value}</dd>
            </div>
          ))}
        </dl>
      </Body>
    </Html>
  </Tailwind>
);

const now = new Date().toISOString();

const previewForm: PayloadFormsCollection = {
  id: 'preview-form',
  title: 'Contact',
  submitButtonLabel: 'Submit',
  confirmationMessage: 'Thanks for reaching out!',
  fields: [],
  updatedAt: now,
  createdAt: now,
};

const previewData: PayloadFormSubmissionsCollection['data'] = [
  { id: '1', name: 'name', label: 'Name', value: 'Jane Doe', blockType: 'text' },
  { id: '2', name: 'email', label: 'Email', value: 'jane@example.com', blockType: 'email' },
  { id: '3', name: 'phone', label: 'Phone', value: '(555) 123-4567', blockType: 'phoneNumber' },
  { id: '4', name: 'eventDate', label: 'Event Date', value: 'June 14, 2026', blockType: 'date' },
  {
    id: '5',
    name: 'message',
    label: 'Message',
    value: 'We would love to learn more about your wedding day packages.',
    blockType: 'textarea',
  },
];

export default () => <FormSubmissionEmailTemplate data={previewData} form={previewForm} />;
