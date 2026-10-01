'use client';

import React from 'react';
import { SurfaceProvider } from '@/components/store';
import TopBar from '@/components/chrome/TopBar';
import SurfaceCanvas from '@/components/canvas/SurfaceCanvas';
import ParticipantRail from '@/components/panels/ParticipantRail';
import ContextActions from '@/components/panels/ContextActions';
import DemoSwitcher from '@/components/panels/DemoSwitcher';
import SelectionBar from '@/components/panels/SelectionBar';
import Observatory from '@/components/observatory/Observatory';

export default function Home() {
  return (
    <SurfaceProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#08080a] text-zinc-200">
        <TopBar />

        {/* canvas region */}
        <main className="flex-1 relative flex flex-col min-h-0">
          {/* faint depth behind the canvas */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,162,39,0.05), transparent 70%)',
            }}
          />
          <div className="relative flex-1 flex flex-col min-h-0">
            <SurfaceCanvas />
          </div>
          <ParticipantRail />

          {/* discreet "new surface" control */}
          <div className="absolute right-3 bottom-20 z-20">
            <DemoSwitcher />
          </div>
        </main>

        {/* selection strip */}
        <div className="shrink-0 flex justify-center px-4">
          <SelectionBar />
        </div>

        <ContextActions />
        <Observatory />
      </div>
    </SurfaceProvider>
  );
}
