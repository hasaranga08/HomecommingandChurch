import React from 'react';
import { GoldFlourishDivider } from './FloralDecorations';
import { Heart } from 'lucide-react';

/**
 * Section 6 – Thank You
 * - Heading: Thank You
 * - Message: “Your presence and blessings mean the world to us. We look forward to celebrating this special day with you.”
 * - Display:
 *     With love,
 *     Roshini & Chamod
 * - Elegant, romantic and minimal with subtle gold decorative details
 */
export const ThankYouSection: React.FC = () => {
  return (
    <footer
      id="thank-you"
      className="w-full mx-auto px-2 pt-10 pb-16 sm:pb-24 text-center select-none"
    >
      {/* Category Header */}
      <p className="font-display-classic text-xs tracking-[0.35em] uppercase text-[#E2BE76] font-semibold">
        WITH GRATITUDE
      </p>

      {/* Main Heading */}
      <h2 className="font-serif-luxury text-3xl font-light gold-foil-text tracking-wide mt-2 drop-shadow-md">
        Thank You
      </h2>

      {/* Suggested Wording */}
      <div className="max-w-sm sm:max-w-md mx-auto my-5 px-2">
        <p className="font-serif-luxury text-base text-[#FAF6EE] leading-relaxed italic drop-shadow-xs">
          “Your presence and blessings mean the world to us. We look forward to celebrating this special day with you.”
        </p>
      </div>

      <GoldFlourishDivider className="my-6 opacity-75" />

      {/* With love, Hasaranga & Roshini */}
      <div className="my-6 space-y-2">
        <p className="font-serif-luxury text-sm italic text-[#ECC880]/90 tracking-widest uppercase">
          With love,
        </p>
        <div className="flex items-center justify-center px-1">
          <p className="font-calligraphy text-[clamp(1.55rem,7.2vw,2.25rem)] sm:text-5xl gold-foil-text tracking-normal min-[380px]:tracking-wide whitespace-nowrap text-center px-1.5 py-1">
            Hasaranga &amp; Roshini
          </p>
        </div>
      </div>

      {/* Minimalistic Flourish */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#FAF6EE]/75 font-serif-luxury">
        <span className="h-[0.5px] w-6 bg-[#ECC880]/40" />
        <Heart className="w-3 h-3 text-[#ECC880]" />
        <span>02 · 01 · 2027</span>
        <Heart className="w-3 h-3 text-[#ECC880]" />
        <span className="h-[0.5px] w-6 bg-[#ECC880]/40" />
      </div>
    </footer>
  );
};
