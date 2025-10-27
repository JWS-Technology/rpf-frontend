// app/components/Navbar.jsx
'use client';

import React from 'react';
import { TrainFront, ShieldCheck } from 'lucide-react';

export default function Navbar({
  title = 'RPF TOUCH SCREEN TAB',
  subtitle = 'Passenger Safety Complaint System',
}) {
  return (
    <header className="w-full bg-[#002b5c] text-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Left logo / Indian Railways */}
          <div className="flex items-center space-x-3 min-w-[160px]">
            <div className="bg-white/10 p-2 rounded-md flex items-center justify-center">
              <TrainFront className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold">INDIAN RAILWAYS</div>
              <div className="text-[11px] text-white/80">भारतीय रेल</div>
            </div>
          </div>

          {/* Center title */}
          <div className="flex-1 text-center px-4">
            <div className="text-lg sm:text-2xl font-extrabold tracking-tight">{title}</div>
            <div className="text-xs sm:text-sm text-white/80 mt-1">{subtitle}</div>
          </div>

          {/* Right logo / RPF */}
          <div className="flex items-center justify-end space-x-3 min-w-[160px]">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold">RPF</div>
              <div className="text-[11px] text-white/80">रेलवे सुरक्षा बल</div>
            </div>
            <div className="bg-white/10 p-2 rounded-md flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
