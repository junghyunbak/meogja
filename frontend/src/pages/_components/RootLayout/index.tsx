import React from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return <div className="mx-auto h-dvh max-w-[600px]">{children}</div>;
}
