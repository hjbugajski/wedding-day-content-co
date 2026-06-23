'use client';

import { useEffect } from 'react';

import { useDocumentInfo, useFormFields } from '@payloadcms/ui';
import { useRouter } from 'next/navigation';

const POLL_INTERVAL_MS = 5_000;
const MAX_ATTEMPTS = 60; // ~5 minutes, then stop so a stuck encode can't poll forever
const TERMINAL_STATUSES = ['errored', 'no-asset'];

// Tracks docs already refreshed this session so that if a refresh doesn't immediately
// surface the new playback data (stale form state), we don't fire refresh() again.
const refreshedIds = new Set<string>();

/**
 * Mux's "asset ready" webhook cannot reach rotating preview hostnames, so on those deployments a
 * freshly uploaded video is saved with an `assetId` but no `playbackOptions` and never finishes.
 * This component pulls status from Mux instead: while an asset exists without playback data it
 * polls `/api/mux/refresh` until the asset is ready, then refreshes the view. It is a harmless
 * no-op once playback data is present (production keeps relying on the webhook).
 */
export function MuxPlaybackPoller() {
  const { id } = useDocumentInfo();
  const router = useRouter();

  const assetId = useFormFields(([fields]) => fields?.assetId?.value);
  const playbackRows = useFormFields(
    ([fields]) => (fields?.playbackOptions as { rows?: unknown[] } | undefined)?.rows?.length ?? 0,
  );

  useEffect(() => {
    if (!id || !assetId || playbackRows > 0) {
      return;
    }

    let active = true;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      attempts += 1;

      try {
        const response = await fetch('/api/mux/refresh', {
          method: 'post',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (!active) {
          return;
        }

        // A 4xx won't recover on retry (e.g. an expired admin session returns 401); stop.
        // 5xx is treated as transient and falls through to the bounded retry below.
        if (!response.ok && response.status < 500) {
          return;
        }

        const result = (await response.json()) as { ready?: boolean; status?: string };

        if (result.ready) {
          const key = String(id);

          if (!refreshedIds.has(key)) {
            refreshedIds.add(key);
            router.refresh();
          }

          return;
        }

        if (TERMINAL_STATUSES.includes(result.status ?? '') || attempts >= MAX_ATTEMPTS) {
          return;
        }
      } catch {
        if (!active || attempts >= MAX_ATTEMPTS) {
          return;
        }
      }

      timer = setTimeout(() => void poll(), POLL_INTERVAL_MS);
    };

    void poll();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [id, assetId, playbackRows, router]);

  if (!assetId || playbackRows > 0) {
    return null;
  }

  return <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Checking Mux for encoding status</div>;
}
