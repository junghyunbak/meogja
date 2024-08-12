import React from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return <div className="mx-auto h-screen max-w-[600px]">{children}</div>;
}
