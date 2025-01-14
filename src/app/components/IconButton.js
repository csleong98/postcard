import React from 'react';

const IconButton = ({ 
  icon: Icon, 
  isActive, 
  isDisabled,
  onClick,
  isColorIndicator,
  color = '#222222'
}) => {
  const baseStyles = "inline-flex justify-center items-center p-3 rounded-lg transition-colors";
  const stateStyles = isDisabled
    ? "opacity-50 cursor-not-allowed bg-gray-50"
    : isActive
      ? "bg-gray-100"
      : "hover:bg-gray-50";

  if (isColorIndicator) {
    return (
      <button 
        className={`${baseStyles} ${stateStyles}`}
        onClick={onClick}
        disabled={isDisabled}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
          <g filter="url(#filter0_d_35_982)">
            <circle cx="15" cy="15" r="12" fill="white"/>
          </g>
          <circle cx="15" cy="15" r="10" fill={color}/>
          <defs>
            <filter id="filter0_d_35_982" x="0" y="0" width="30" height="30" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_35_982"/>
              <feOffset/>
              <feGaussianBlur stdDeviation="1"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_35_982"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_35_982" result="shape"/>
            </filter>
          </defs>
        </svg>
      </button>
    );
  }

  return (
    <button 
      className={`${baseStyles} ${stateStyles}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      <Icon size={24} weight={isActive ? "fill" : "regular"} color="#222222" />
    </button>
  );
};

export default IconButton; 