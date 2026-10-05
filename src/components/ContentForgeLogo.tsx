import React, { useState } from 'react';

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1UguF0Nh_xsrWuIjRmByWs3n27X-OhcVuVAQiTr7USncoSg67p8gxEeO7j9vJ7IBGDYOhapKaMZDhDyyErICNDS1-RSfpt5MQ46-7niDjKYwlQvc9kB43sXxbCytdmCmnzolJkpsMQRgJzwdfC64GPq45wuH_HqD2ZOzkZLPaVZxChOi0xwUaA1qxDvEJt61hMR3IoKCFjZ__sJyqc8vCyRozKtazXnbQ_rJOCnEcXAd9roIbcK2nwD';

interface ContentForgeLogoProps {
  className?: string;
}

export const ContentForgeLogo: React.FC<ContentForgeLogoProps> = ({ className = 'h-8 w-auto' }) => {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        alt="ContentForge Logo"
        className={`${className} object-contain`}
        src={LOGO_URL}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  // High-precision SVG fallback matching the exact ContentForge emerald squircle icon in Image 1.png
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ContentForge Logo"
    >
      <rect width="36" height="36" rx="8" fill="#006948" />
      <path
        d="M11 12.5C11 11.3954 11.8954 10.5 13 10.5H19.5L25 16V23.5C25 24.6046 24.1046 25.5 23 25.5H13C11.8954 25.5 11 24.6046 11 23.5V12.5Z"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 10.5V16.5H25"
        stroke="#85F8C4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 19.5H21.5M14.5 22.5H18.5"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};
