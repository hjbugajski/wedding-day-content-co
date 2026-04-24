import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createMock, getPayloadMock, sendFallbackMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  getPayloadMock: vi.fn(),
  sendFallbackMock: vi.fn(),
}));

vi.mock('@/payload/payload.config', () => ({ default: {} }));
vi.mock('payload', () => ({ getPayload: getPayloadMock }));
vi.mock('@/services/email', () => ({ sendFallbackFormEmail: sendFallbackMock }));

import { submitForm } from '@/components/blocks/form/form.action';

const formData = [{ label: 'Name', value: 'Ada' }] as never;

describe('submitForm', () => {
  beforeEach(() => {
    createMock.mockReset();
    sendFallbackMock.mockReset();
    getPayloadMock.mockReset();
    getPayloadMock.mockResolvedValue({ create: createMock });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('returns the created document on success', async () => {
    createMock.mockResolvedValue({ id: 'sub-1' });

    const result = await submitForm('form-1', formData);

    expect(result).toEqual({ id: 'sub-1' });
    expect(createMock).toHaveBeenCalledWith({
      collection: 'form-submissions',
      data: { form: 'form-1', data: formData },
      context: { formSubmissionData: { form: 'form-1', data: formData } },
    });
    expect(sendFallbackMock).not.toHaveBeenCalled();
  });

  it('falls back to email when payload.create rejects', async () => {
    createMock.mockRejectedValue(new Error('db down'));
    sendFallbackMock.mockResolvedValue(undefined);

    const result = await submitForm('form-1', formData);

    expect(result).toBeUndefined();
    expect(sendFallbackMock).toHaveBeenCalledWith('form-1', formData);
  });

  it('falls back to email when getPayload times out', async () => {
    vi.useFakeTimers();
    // getPayload never resolves — withTimeout should reject after 10s.
    getPayloadMock.mockImplementation(() => new Promise(() => {}));
    sendFallbackMock.mockResolvedValue(undefined);

    const pending = submitForm('form-1', formData);
    await vi.advanceTimersByTimeAsync(10_000);
    const result = await pending;

    expect(result).toBeUndefined();
    expect(sendFallbackMock).toHaveBeenCalledWith('form-1', formData);
    vi.useRealTimers();
  });

  it('throws when both payload.create and fallback email fail', async () => {
    createMock.mockRejectedValue(new Error('db down'));
    sendFallbackMock.mockRejectedValue(new Error('resend down'));

    await expect(submitForm('form-1', formData)).rejects.toThrow(
      /Both form submission and fallback email failed/,
    );
  });
});
