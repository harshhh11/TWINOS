import type { Metadata } from 'next';
import './globals.css';
import { GlobalSearchModal } from '@/components/shared/GlobalSearchModal';
import { AskTwinOSFloating } from '@/components/copilot/AskTwinOSFloating';

export const metadata: Metadata = {
  title: 'TwinOS — AI Digital Twin for Smarter Infrastructure',
  description:
    'TwinOS creates a live digital representation of physical infrastructure and uses AI to detect, predict and understand what is happening across the environment.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-twin-bg text-white antialiased w-screen h-screen overflow-hidden">
        {children}
        <GlobalSearchModal />
        <AskTwinOSFloating />
      </body>
    </html>
  );
}
