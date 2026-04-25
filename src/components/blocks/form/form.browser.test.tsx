import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

vi.mock('@/components/ui/toasts', () => ({
  toast: { add: vi.fn() },
}));

import { submitForm } from '@/components/blocks/form/form.action';
import { FormClient } from '@/components/blocks/form/form.client';
import { toast } from '@/components/ui/toasts';
import type {
  PayloadCheckboxBlock,
  PayloadEmailBlock,
  PayloadFormsCollection,
  PayloadPhoneNumberBlock,
  PayloadRadioBlock,
  PayloadSelectBlock,
  PayloadTextBlock,
  PayloadTextareaBlock,
} from '@/payload/payload-types';

const textField: PayloadTextBlock = {
  blockType: 'text',
  id: 'text-1',
  name: 'firstName',
  label: 'First Name',
  width: 'half',
  required: true,
};

const emailField: PayloadEmailBlock = {
  blockType: 'email',
  id: 'email-1',
  name: 'email',
  label: 'Email',
  width: 'half',
  required: true,
};

const phoneField: PayloadPhoneNumberBlock = {
  blockType: 'phoneNumber',
  id: 'phone-1',
  name: 'phone',
  label: 'Phone Number',
  width: 'half',
  required: true,
};

const textareaField: PayloadTextareaBlock = {
  blockType: 'textarea',
  id: 'textarea-1',
  name: 'notes',
  label: 'Notes',
  width: 'full',
  required: false,
};

const selectField: PayloadSelectBlock = {
  blockType: 'select',
  id: 'select-1',
  name: 'tier',
  label: 'Tier',
  width: 'half',
  required: true,
  options: [
    { label: 'Starter', value: 'starter' },
    { label: 'Pro', value: 'pro' },
  ],
} as PayloadSelectBlock;

const radioField: PayloadRadioBlock = {
  blockType: 'radio',
  id: 'radio-1',
  name: 'contactMethod',
  label: 'Contact Method',
  width: 'half',
  required: true,
  options: [
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
  ],
} as PayloadRadioBlock;

const checkboxField: PayloadCheckboxBlock = {
  blockType: 'checkbox',
  id: 'checkbox-1',
  name: 'perks',
  label: 'Perks',
  width: 'full',
  required: true,
  options: [
    { label: 'Photo', value: 'photo' },
    { label: 'Video', value: 'video' },
  ],
} as PayloadCheckboxBlock;

const makeFormDoc = (fields: PayloadFormsCollection['fields']): PayloadFormsCollection =>
  ({
    id: 'form-1',
    title: 'Contact',
    submitButtonLabel: 'Send',
    confirmationMessage: 'Thanks, we got it.',
    fields,
  }) as PayloadFormsCollection;

const renderForm = (fields: PayloadFormsCollection['fields']) =>
  render(<FormClient {...makeFormDoc(fields)} fieldDescriptions={{}} optionDescriptions={{}} />);

describe('FormClient — minimal text/email form', () => {
  beforeEach(() => {
    vi.mocked(submitForm)
      .mockReset()
      .mockResolvedValue({ id: 'stub-submission' } as never);
    vi.mocked(toast.add).mockReset();
  });

  test('renders a labelled input per field and a submit button', async () => {
    const screen = await renderForm([textField, emailField]);

    await expect.element(screen.getByLabelText('First Name')).toBeVisible();
    await expect.element(screen.getByLabelText('Email')).toBeVisible();
    await expect.element(screen.getByRole('button', { name: 'Send' })).toBeVisible();
  });

  test('shows required errors on submit when fields are empty', async () => {
    const screen = await renderForm([textField, emailField]);

    await screen.getByRole('button', { name: 'Send' }).click();

    await expect.element(screen.getByText('Field is required').first()).toBeVisible();
    await expect
      .element(screen.getByLabelText('First Name'))
      .toHaveAttribute('aria-invalid', 'true');
    await expect.element(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    await expect.element(screen.getByRole('alert').first()).toBeVisible();
    expect(submitForm).not.toHaveBeenCalled();
  });

  test('submits formatted values when fields are valid', async () => {
    const screen = await renderForm([textField, emailField]);

    await screen.getByLabelText('First Name').fill('Ada');
    await screen.getByLabelText('Email').fill('ada@example.com');
    await screen.getByRole('button', { name: 'Send' }).click();

    await vi.waitFor(() => {
      expect(submitForm).toHaveBeenCalledTimes(1);
      expect(submitForm).toHaveBeenCalledWith('form-1', [
        { blockType: 'text', label: 'First Name', name: 'firstName', value: 'Ada' },
        { blockType: 'email', label: 'Email', name: 'email', value: 'ada@example.com' },
      ]);
    });

    await vi.waitFor(() => {
      expect(toast.add).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success', description: 'Thanks, we got it.' }),
      );
    });
  });
});

describe('FormClient — mixed field types', () => {
  beforeEach(() => {
    vi.mocked(submitForm)
      .mockReset()
      .mockResolvedValue({ id: 'stub-submission' } as never);
    vi.mocked(toast.add).mockReset();
  });

  test('phone: rejects a malformed number on submit and does not call the action', async () => {
    const screen = await renderForm([phoneField]);

    await screen.getByLabelText('Phone Number').fill('not-a-phone');
    await screen.getByRole('button', { name: 'Send' }).click();

    await expect.element(screen.getByText('Must be a valid phone number').first()).toBeVisible();
    expect(submitForm).not.toHaveBeenCalled();
  });

  test('textarea: optional field accepts an empty value and submits the rest of the payload', async () => {
    const screen = await renderForm([textField, textareaField]);

    await screen.getByLabelText('First Name').fill('Ada');
    await screen.getByRole('button', { name: 'Send' }).click();

    await vi.waitFor(() => {
      expect(submitForm).toHaveBeenCalledWith('form-1', [
        { blockType: 'text', label: 'First Name', name: 'firstName', value: 'Ada' },
        { blockType: 'textarea', label: 'Notes', name: 'notes', value: '' },
      ]);
    });
  });

  test('submits a rich payload with phone, select, radio, and checkbox values', async () => {
    const screen = await renderForm([
      textField,
      phoneField,
      selectField,
      radioField,
      checkboxField,
    ]);

    await screen.getByLabelText('First Name').fill('Ada');
    await screen.getByLabelText('Phone Number').fill('+12024561111');

    await screen.getByRole('combobox').click();
    await screen.getByRole('option', { name: 'Pro' }).click();

    await screen.getByText('Email').click();

    await screen.getByText('Photo').click();
    await screen.getByText('Video').click();

    await screen.getByRole('button', { name: 'Send' }).click();

    await vi.waitFor(() => {
      expect(submitForm).toHaveBeenCalledTimes(1);
      expect(submitForm).toHaveBeenCalledWith('form-1', [
        { blockType: 'text', label: 'First Name', name: 'firstName', value: 'Ada' },
        { blockType: 'phoneNumber', label: 'Phone Number', name: 'phone', value: '+12024561111' },
        { blockType: 'select', label: 'Tier', name: 'tier', value: 'Pro' },
        {
          blockType: 'radio',
          label: 'Contact Method',
          name: 'contactMethod',
          value: 'Email',
        },
        { blockType: 'checkbox', label: 'Perks', name: 'perks', value: 'Photo, Video' },
      ]);
    });
  });

  test('fires an error toast when submitForm rejects', async () => {
    vi.mocked(submitForm).mockRejectedValueOnce(new Error('network down'));

    const screen = await renderForm([textField]);

    await screen.getByLabelText('First Name').fill('Ada');
    await screen.getByRole('button', { name: 'Send' }).click();

    await vi.waitFor(() => {
      expect(toast.add).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          description: 'Something went wrong. Please try again.',
        }),
      );
    });
  });
});
