'use client';
import React from 'react';
import { Info } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#002b5c] text-white py-8 mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Info Row */}
        <div className="flex items-start gap-3 text-sm sm:text-base leading-snug">
          <div className="mt-0.5">
            <Info className="w-5 h-5 opacity-90" aria-hidden />
          </div>

          <div className="flex-1">
            <p className="font-medium">
              System automatically alerts nearest RPF Post and DSCR for immediate action.
            </p>
            <p className="text-white/80 text-sm mt-1">
              सिस्टम स्वचालित रूप से निकटतम RPF पोस्ट और DSCR को तत्काल कार्रवाई के लिए अलर्ट करता है।
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-white/10 my-4" />

        {/* Motto */}
        <div className="text-center">
          <p className="text-lg sm:text-xl font-semibold italic">
            Safety is the Prime Duty of Security Branch
          </p>
          <p className="text-sm text-white/80 mt-1">
            सुरक्षा सुरक्षा शाखा का प्रमुख कर्तव्य है
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
