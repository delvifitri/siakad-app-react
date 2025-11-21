import React from "react";

export interface ArrowLeftIconProps {
  className?: string;
}

export const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export default ArrowLeftIcon;
