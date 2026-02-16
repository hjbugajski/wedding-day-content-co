import type { CSSProperties } from 'react';

type Environment = 'local' | 'preview' | 'staging' | 'production';

const ENV_STYLES: Record<Environment, CSSProperties> = {
  local: {
    backgroundColor: 'var(--theme-elevation-100)',
    color: 'var(--theme-elevation-800)',
    borderColor: 'var(--theme-elevation-250)',
  },
  preview: {
    backgroundColor: 'var(--theme-success-100)',
    color: 'var(--theme-success-800)',
    borderColor: 'var(--theme-success-250)',
  },
  staging: {
    backgroundColor: 'var(--theme-warning-100)',
    color: 'var(--theme-warning-800)',
    borderColor: 'var(--theme-warning-250)',
  },
  production: {
    backgroundColor: 'var(--theme-error-100)',
    color: 'var(--theme-error-800)',
    borderColor: 'var(--theme-error-250)',
  },
};

const baseStyle: CSSProperties = {
  width: '100%',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  padding: '4px 0',
  textAlign: 'center',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  zIndex: 99999,
};

function getEnvironment(): Environment {
  const vercelEnv = process.env.VERCEL_TARGET_ENV;

  switch (vercelEnv) {
    case 'preview':
      return 'preview';
    case 'staging':
      return 'staging';
    case 'production':
      return 'production';
  }

  return process.env.NODE_ENV === 'development' ? 'local' : 'production';
}

export function EnvBanner() {
  const environment = getEnvironment();

  return <div style={{ ...baseStyle, ...ENV_STYLES[environment] }}>{environment}</div>;
}
