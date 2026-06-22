export const getServerSideUrl = () => {
  // Preview deployments: the stable per-branch host (constant across re-deploys, unlike VERCEL_URL).
  if (process.env.VERCEL_TARGET_ENV === 'preview' && process.env.VERCEL_BRANCH_URL) {
    return `https://${process.env.VERCEL_BRANCH_URL}`;
  }

  // Production: the canonical custom domain.
  if (process.env.VERCEL_TARGET_ENV === 'production' && process.env.NEXT_PUBLIC_DOMAIN) {
    return `https://${process.env.NEXT_PUBLIC_DOMAIN}`;
  }

  // Fallback to Vercel's generated production url when no custom domain is configured.
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return 'http://localhost:3000';
};
