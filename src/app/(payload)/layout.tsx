/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import React from 'react';

import { RootLayout } from '@payloadcms/next/layouts';

import { importMap } from '@/app/(payload)/admin/importMap';
import configPromise from '@payload-config';

import '@payloadcms/next/css';

type Args = {
  children: React.ReactNode;
};

const Layout = ({ children }: Args) => (
  <RootLayout config={configPromise} importMap={importMap}>
    {children}
  </RootLayout>
);

export default Layout;
