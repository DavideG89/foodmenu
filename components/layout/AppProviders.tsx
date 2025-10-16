'use client';

import * as React from 'react';
import { ToastProvider } from '@/components/ui/toast-provider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return <ToastProvider>{children}</ToastProvider>;
};
