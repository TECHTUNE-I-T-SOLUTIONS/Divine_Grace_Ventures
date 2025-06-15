// components/ClientLayoutWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const EmailJSInitializer = dynamic(() => import('@/components/EmailJSInitializer'), {
  ssr: false,
});

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <EmailJSInitializer />
      {children}
    </>
  );
}
