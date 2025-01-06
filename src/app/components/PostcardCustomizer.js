'use client'

import React, { useState, useRef } from 'react';

export default function PostcardCustomizer() {
  const [currentSide, setCurrentSide] = useState('front');

  const handleFlip = () => {
    setCurrentSide(currentSide === 'front' ? 'back' : 'front');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Title */}
      <h1 className="text-slate-900 text-4xl font-bold mb-8 text-center">Design your own postcard and send it to anyone!</h1>

      {/* Postcard Canvas */}
      <div className="relative w-[879.04px] h-[591.04px] perspective">
        <div
          className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            currentSide === 'back' ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Side */}
          <div className="absolute w-full h-full backface-hidden bg-white shadow-md border rounded-lg flex items-center justify-center">
            <p className="text-xl font-medium">Front Side</p>
          </div>

          {/* Back Side */}
          <div className="absolute w-full h-full rotate-y-180 backface-hidden bg-gray-200 shadow-md border rounded-lg flex items-center justify-center">
            <p className="text-xl font-medium">Back Side</p>
          </div>
        </div>
      </div>

      {/* Flip Button */}
      <button
        onClick={handleFlip}
        className="mt-6 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Flip to {currentSide === 'front' ? 'Back' : 'Front'}
      </button>
    </div>
  );
}
