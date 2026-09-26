import type { Metadata } from 'next';
import './globals.css';
import { GlobalSearchModal } from '@/components/shared/GlobalSearchModal';
import { AskTwinOSFloating } from '@/components/copilot/AskTwinOSFloating';

export const metadata: Metadata = {
  title: 'TwinOS™ — AI Digital Twin for Smarter Infrastructure',
  description:
    'TwinOS creates a live digital representation of physical infrastructure with real-time monitoring, analytics, and operational predictions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080D16] text-[#F8FAFC] antialiased min-h-screen selection:bg-[#F26A21]/30 selection:text-white">
        {children}
        <GlobalSearchModal />
        <AskTwinOSFloating />
      </body>
    </html>
  );
}
