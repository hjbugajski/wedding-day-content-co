'use server';

import { getPayload } from 'payload';

import type { PayloadFormSubmissionsCollection } from '@/payload/payload-types';
import config from '@/payload/payload.config';
import { sendFallbackFormEmail } from '@/services/email';

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Database connection timeout')), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
};

export const submitForm = async (form: string, data: PayloadFormSubmissionsCollection['data']) => {
  try {
    const payload = await withTimeout(getPayload({ config }), 10_000);
    const result = await withTimeout(
      payload.create({
        collection: 'form-submissions',
        data: { form, data },
        context: { formSubmissionData: { form, data } },
      }),
      10_000,
    );

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isTimeout = errorMessage.includes('Database connection timeout');
    const consoleMessage = isTimeout
      ? 'Database connection timed out after 10 seconds'
      : 'Form submission failed:';

    console.error(consoleMessage, error);

    try {
      await sendFallbackFormEmail(form, data);

      const consoleMessage = isTimeout
        ? 'Fallback email sent due to database timeout'
        : 'Fallback email sent successfully';

      console.log(consoleMessage);
    } catch (emailError) {
      console.error('Failed to send fallback email:', emailError);
      throw new Error('Both form submission and fallback email failed');
    }

    return undefined;
  }
};
