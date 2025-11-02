'use client';
import React from 'react';
import { Info } from 'lucide-react';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#002b5c] text-white py-8">
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

       {/* Motto Section */}
<div className="text-center flex flex-col items-center justify-center gap-3 mt-4">
  {/* RPF Logo */}
  <Image
    src="/rpf_logo.png"  // 🔹 Ensure this image is inside your /public folder
    alt="RPF Logo"
    width={80}
    height={60}
    className="object-contain drop-shadow-md bg-white p-1 rounded-md  "
    priority
  />

  {/* Motto Text */}
  <div>
    <p className="text-2xl sm:text-3xl font-bold italic text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.4)] tracking-wide">
      Sewa hi Sankalp
    </p>
    <p className="text-lg sm:text-xl text-white/90 font-semibold mt-1 drop-shadow-[0_0_6px_rgba(0,0,0,0.3)]">
      सेवा ही संकल्प
    </p>
  </div>
</div>


      </div>
    </footer>
  );
};

export default Footer;
