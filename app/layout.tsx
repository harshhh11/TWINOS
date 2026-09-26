import type { Metadata } from 'next';
import './globals.css';
import { GlobalSearchModal } from '@/components/shared/GlobalSearchModal';
import { AskTwinOSFloating } from '@/components/copilot/AskTwinOSFloating';
import { ScenarioControlDrawer } from '@/components/scenario/ScenarioControlDrawer';

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
    <html lang="en" className="dark" style={{ colorScheme: 'dark', backgroundColor: '#080A0D' }}>
      <body
        style={{ colorScheme: 'dark', backgroundColor: '#080A0D', color: '#F4F4F5' }}
        className="bg-[#080A0D] text-[#F4F4F5] antialiased w-screen h-screen overflow-hidden font-sans"
      >
        {children}
        <GlobalSearchModal />
        <AskTwinOSFloating />
        <ScenarioControlDrawer />
      </body>
    </html>
  );
}
