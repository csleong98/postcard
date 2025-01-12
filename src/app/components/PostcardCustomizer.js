'use client'

import React, { useState, useRef, useEffect } from 'react';

export default function PostcardCustomizer() {
  // Existing state
  const [currentSide, setCurrentSide] = useState('front');
  const [uploadedImage, setUploadedImage] = useState('/images/default-image.png');
  const [selectedTool, setSelectedTool] = useState(null);
  const canvasRef = useRef(null);
  const staticCanvasRef = useRef(null);
  const isDrawing = useRef(false);
  const containerRef = useRef(null);
  const [isTextareaActive, setIsTextareaActive] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Roboto');
  const [textColor, setTextColor] = useState('#000000');

  const handleFlip = () => {
    setCurrentSide(currentSide === 'front' ? 'back' : 'front');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const canvas = staticCanvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(canvas.width - 120 - 16, 16, 120, 160);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 16);
    ctx.lineTo(canvas.width / 2, canvas.height - 16);
    ctx.stroke();
  }, []);

  const startDrawing = (e) => {
    if (selectedTool && currentSide === 'back') {
      isDrawing.current = true;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e) => {
    if (!isDrawing.current || currentSide !== 'back' || !selectedTool) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    if (selectedTool === 'eraser') {
      const size = 16;
      ctx.clearRect(
        e.clientX - rect.left - size / 2,
        e.clientY - rect.top - size / 2,
        size,
        size
      );
    } else {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.strokeStyle = selectedTool === 'pencil' ? '#000000' : 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = selectedTool === 'pencil' ? 2 : 8;
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.closePath();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Font options
  const fontOptions = [
    { name: 'Homemade Apple', value: 'Homemade Apple' },
    { name: 'Dancing Script', value: 'Dancing Script' },
    { name: 'Caveat', value: 'Caveat' },
    { name: 'Indie Flower', value: 'Indie Flower' },
    { name: 'Shadows Into Light', value: 'Shadows Into Light' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Title */}
      <h1 className="text-slate-900 text-4xl font-bold mb-8 text-center">
        Design your own postcard and send it to anyone!
      </h1>

      <div className="relative">
        {/* Font and Color Controls */}
        {isTextareaActive && (
          <div className="absolute -left-[calc(200px+24px)] top-0 w-[200px] flex flex-col gap-4 controls-container">
            <select 
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full p-2 border rounded-md bg-white shadow-sm"
            >
              {fontOptions.map((font) => (
                <option 
                  key={font.value} 
                  value={font.value}
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </option>
              ))}
            </select>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Text Color</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-10 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Postcard Canvas */}
        <div className="relative w-[879.04px] h-[591.04px] perspective">
          <div
            className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d ${currentSide === 'back' ? 'rotate-y-180' : ''
              }`}
          >
            {/* Front Side */}
            <div className="absolute w-full h-full backface-hidden bg-white shadow-md flex items-center justify-center">
              <img
                src={uploadedImage}
                alt="Postcard Front"
                className="w-full h-full object-cover p-4 box-border"
              />

              <div className="absolute flex items-center justify-center">
                <button
                  aria-label='Upload image'
                  className="px-4 py-2 bg-gray-300 text-gray-900 font-bold rounded-md cursor-pointer flex items-center justify-center"
                  onClick={() => document.getElementById('imageUpload').click()}
                >
                  Upload image
                </button>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Back Side */}
            <div className="absolute w-full h-full rotate-y-180 backface-hidden bg-white shadow-md flex items-center justify-center">
              {/* Static elements canvas */}
              <canvas
                ref={staticCanvasRef}
                width={879}
                height={591}
                className='absolute inset-0 pointer-events-none'
              ></canvas>

              {/* Drawing canvas */}
              <canvas
                ref={canvasRef}
                width={879}
                height={591}
                className='absolute inset-9'
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              ></canvas>

              {/* Add Message Textarea */}
              <div className="absolute inset-9 flex">
                <textarea
                  className="w-[50%] h-full resize-none p-4 bg-transparent focus:outline-none"
                  placeholder="Type your message here..."
                  style={{
                    fontFamily: selectedFont,
                    color: textColor
                  }}
                  onFocus={() => setIsTextareaActive(true)}
                  onBlur={(e) => {
                    // Add a small delay to check if the next focus target is the controls
                    setTimeout(() => {
                      const activeElement = document.activeElement;
                      const isControlsContainer = activeElement?.closest('.controls-container');
                      if (!isControlsContainer) {
                        setIsTextareaActive(false);
                      }
                    }, 0);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawing Tools */}
      <div className="absolute top-1/2 right-8 flex flex-col gap-4 transform -translate-y-1/2">
        <button
          className={`p-4 bg-gray-300 rounded-full shadow-md ${selectedTool === 'pencil' ? 'ring-4 ring-blue-500' : ''}`}
          onClick={() => setSelectedTool('pencil')}
        >
          ✏️
        </button>
        <button
          className={`p-4 bg-gray-300 rounded-full shadow-md ${selectedTool === 'marker' ? 'ring-4 ring-blue-500' : ''}`}
          onClick={() => setSelectedTool('marker')}
        >
          🖊️
        </button>
        <button
          className={`p-4 bg-gray-300 rounded-full shadow-md ${selectedTool === 'eraser' ? 'ring-4 ring-blue-500' : ''}`}
          onClick={() => setSelectedTool('eraser')}
        >
          🩹
        </button>
        <button
          className="p-4 bg-red-500 text-white rounded-full shadow-md"
          onClick={clearCanvas}
        >
          🗑️
        </button>
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