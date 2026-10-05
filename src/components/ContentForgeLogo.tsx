import React from 'react';

interface ContentForgeLogoProps {
  className?: string;
}

export const ContentForgeLogo: React.FC<ContentForgeLogoProps> = ({ className = 'h-8 w-8' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      fill="none"
      className={`${className} shrink-0`}
      aria-label="ContentForge Logo"
    >
      <rect width="40" height="40" rx="10" fill="#064E3B" />
      <path
        d="M12 28L12 14C12 12.8954 12.8954 12 14 12H20C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28H12Z"
        fill="#10B981"
        fillOpacity="0.25"
      />
      <path
        d="M14 26V15C14 13.8954 14.8954 13 16 13H19.5C23.0899 13 26 15.9101 26 19.5C26 23.0899 23.0899 26 19.5 26H14Z"
        stroke="#34D399"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 20H24" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
      <circle cx="21" cy="20" r="2.5" fill="#10B981" />
      <path d="M26 14L28 12" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
