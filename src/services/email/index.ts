'use server';

import { nanoid } from 'nanoid';
import { Resend } from 'resend';

import { env } from '@/env/server';
import type { PayloadFormSubmissionsCollection } from '@/payload/payload-types';

export async function sendFallbackFormEmail(
  formId: string,
  data: PayloadFormSubmissionsCollection['data'],
) {
  const resend = new Resend(env.RESEND_API_KEY);
  const textContent = [
    `Form Submission (Database Unavailable)`,
    `Form ID: ${formId}`,
    `Timestamp: ${new Date().toISOString()}`,
    `---`,
    ...data.map((field) => `${field.label}: ${field.value}`),
    `---`,
    `Note: Database was unavailable. Please save this information manually.`,
  ].join('\n');
  const { error } = await resend.emails.send({
    from: `Wedding Day Content Co. <${env.RESEND_FROM_ADDRESS_PAYLOAD}>`,
    to: env.RESEND_TO_ADDRESS_DEFAULT,
    subject: `Form Submission - Database Unavailable - ${formId}`,
    text: textContent,
    headers: {
      'X-Entity-Ref-ID': nanoid(32),
    },
  });

  if (error) {
    throw new Error(`Failed to send fallback email: ${JSON.stringify(error)}`);
  }
}
