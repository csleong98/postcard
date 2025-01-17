'use client'

import React, { useState, useRef, useEffect } from 'react';
import Toolbar from './Toolbar';

// Add this function to compress the image
const compressImage = (base64String) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions (reduce by 50%)
      const newWidth = img.width * 0.5;
      const newHeight = img.height * 0.5;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Get compressed base64 (0.7 quality)
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

export default function PostcardCustomizer() {
  // Existing state
  const [currentSide, setCurrentSide] = useState('front');
  const [uploadedImage, setUploadedImage] = useState('/images/default-image.png');
  const [selectedTool, setSelectedTool] = useState(null);
  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);
  const staticCanvasRef = useRef(null);
  const isDrawing = useRef(false);
  const containerRef = useRef(null);
  const [isTextareaActive, setIsTextareaActive] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Caveat');
  const [textColor, setTextColor] = useState('#000000');
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [showPreview, setShowPreview] = useState(false);
  const [previewLayout, setPreviewLayout] = useState('horizontal');

  // Add useEffect to handle preview generation when layout changes
  useEffect(() => {
    if (showPreview) {
      generatePreview();
    }
  }, [previewLayout]);

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
    if (selectedTool) {
      isDrawing.current = true;
      const canvas = frontCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e) => {
    if (!isDrawing.current || !selectedTool) return;
    const canvas = frontCanvasRef.current;
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
      ctx.strokeStyle = selectedTool === 'pencil' ? drawingColor : `${drawingColor}80`;
      ctx.lineWidth = selectedTool === 'pencil' ? 2 : 8;
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      const canvas = frontCanvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.closePath();
    }
  };

  const clearCanvas = () => {
    const canvas = frontCanvasRef.current;
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

  const generatePreview = () => {
    // Create a temporary canvas for the combined preview
    const previewCanvas = document.createElement('canvas');
    
    // Set canvas dimensions based on layout
    let canvasWidth, canvasHeight;
    switch(previewLayout) {
      case 'horizontal':
        canvasWidth = 2000;
        canvasHeight = 1000;
        break;
      case 'vertical':
        canvasWidth = 1000;
        canvasHeight = 2000;
        break;
      case 'square':
        canvasWidth = 1500;
        canvasHeight = 1500;
        break;
      default:
        canvasWidth = 2000;
        canvasHeight = 1000;
        break;
    }
    
    previewCanvas.width = canvasWidth;
    previewCanvas.height = canvasHeight;
    const ctx = previewCanvas.getContext('2d');

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, '#E5FFE6');  // Light mint green
    gradient.addColorStop(1, '#FFF3D6');  // Light warm yellow
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const img = new Image();
    img.onload = () => {
      // Calculate card dimensions and positions based on layout
      const cardWidth = 879;
      const cardHeight = 591;
      let frontScale, backScale, frontX, frontY, backX, backY, frontRotation, backRotation;

      switch(previewLayout) {
        case 'horizontal':
          // Side by side layout
          frontScale = 0.8;
          backScale = 0.8;
          frontX = canvasWidth * 0.05;
          frontY = (canvasHeight - cardHeight * frontScale) / 2;
          backX = canvasWidth * 0.55;
          backY = frontY;
          frontRotation = -3; // Slight tilt left
          backRotation = 3;   // Slight tilt right
          break;
        case 'vertical':
          // Stacked vertically
          frontScale = 0.8;
          backScale = 0.8;
          frontX = (canvasWidth - cardWidth * frontScale) / 2;
          frontY = canvasHeight * 0.1;
          backX = frontX + 20; // Slight offset for depth
          backY = canvasHeight * 0.55;
          frontRotation = -2;
          backRotation = 2;
          break;
        case 'square':
          // Stacked with equal spacing
          frontScale = 1.2;
          backScale = 1.2;
          frontX = (canvasWidth - cardWidth * frontScale) / 2;
          frontY = canvasHeight * 0.1;
          backX = frontX - 20; // Offset in opposite direction
          backY = canvasHeight * 0.4;
          frontRotation = 2;
          backRotation = -2;
          break;
        default:
          // Default to horizontal layout
          frontScale = 0.9;
          backScale = 0.9;
          frontX = canvasWidth * 0.05;
          frontY = (canvasHeight - cardHeight * frontScale) / 2;
          backX = canvasWidth * 0.55;
          backY = frontY;
          frontRotation = -3;
          backRotation = 3;
      }

      // Helper function to draw a rotated card with shadow
      const drawRotatedCard = (x, y, width, height, rotation, drawContent) => {
        ctx.save();
        
        // Move to center point for rotation
        ctx.translate(x + width / 2, y + height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-(x + width / 2), -(y + height / 2));

        // Add shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Draw white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, y, width, height);

        // Draw the content
        drawContent(x, y, width, height);

        ctx.restore();
      };

      // Draw back card first (will be behind)
      drawRotatedCard(
        backX, 
        backY, 
        cardWidth * backScale, 
        cardHeight * backScale,
        backRotation,
        (x, y, w, h) => {
          ctx.drawImage(staticCanvasRef.current, x, y, w, h);
          
          // Draw text content
          const textarea = document.querySelector('textarea');
          if (textarea) {
            ctx.font = `${16 * backScale}px ${selectedFont}`;
            ctx.fillStyle = textColor;
            
            const lines = textarea.value.split('\n');
            let textY = y + (36 * backScale);
            const maxWidth = (w / 2) - (40 * backScale);
            const textX = x + (36 * backScale);

            lines.forEach(text => {
              const words = text.split(' ');
              let line = '';
              
              words.forEach(word => {
                const testLine = line + word + ' ';
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth) {
                  ctx.fillText(line, textX, textY);
                  line = word + ' ';
                  textY += 24 * backScale;
                } else {
                  line = testLine;
                }
              });
              ctx.fillText(line, textX, textY);
              textY += 24 * backScale;
            });
          }
        }
      );

      // Draw front card (will be in front)
      drawRotatedCard(
        frontX, 
        frontY, 
        cardWidth * frontScale, 
        cardHeight * frontScale,
        frontRotation,
        (x, y, w, h) => {
          ctx.drawImage(img, x, y, w, h);
          ctx.drawImage(frontCanvasRef.current, x, y, w, h);
        }
      );

      setShowPreview(previewCanvas.toDataURL());
    };
    img.src = uploadedImage;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Title */}
      <h1 
        className="text-slate-900 text-4xl mb-8 text-center"
        style={{
          fontFamily: 'PP Editorial New',
          fontWeight: 'italic',
          fontStyle: 'italic',
        }}
      >
        Make your own postcard
      </h1>

      <div className="relative">
        {/* Postcard Canvas */}
        <div className="relative w-[879.04px] h-[591.04px] perspective">
          <div
            className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d ${currentSide === 'back' ? 'rotate-y-180' : ''
              }`}
          >
            {/* Front Side */}
            <div className="absolute w-full h-full backface-hidden bg-white shadow-md flex items-center justify-center">
              {/* Drawing canvas for front */}
              <canvas
                ref={frontCanvasRef}
                width={879}
                height={591}
                className='absolute inset-0'
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              ></canvas>

              <img
                src={uploadedImage}
                alt="Postcard Front"
                className="w-full h-full object-cover p-4 box-border"
              />

              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
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

              {/* Add Message Textarea */}
              <div className="absolute inset-9 flex z-0">
                <textarea
                  className="w-[50%] h-full resize-none p-4 bg-transparent focus:outline-none"
                  placeholder="Type your message here..."
                  style={{
                    fontFamily: selectedFont,
                    color: textColor,
                    fontSize: '20px'
                  }}
                  onFocus={() => setIsTextareaActive(true)}
                  onBlur={(e) => {
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

        {/* Toolbar - now positioned at bottom center */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[calc(100%+24px)]">
          <Toolbar
            currentSide={currentSide}
            selectedTool={selectedTool}
            drawingColor={drawingColor}
            textColor={textColor}
            selectedFont={selectedFont}
            fontOptions={fontOptions}
            onToolSelect={setSelectedTool}
            onColorChange={setDrawingColor}
            onTextColorChange={setTextColor}
            onFontChange={setSelectedFont}
            onClear={clearCanvas}
            onUpload={() => document.getElementById('imageUpload').click()}
            onDownload={() => {
              if (showPreview) {
                const link = document.createElement('a');
                link.href = showPreview;
                link.download = 'my-postcard.png';
                link.click();
              } else {
                generatePreview();
              }
            }}
            onFlip={handleFlip}
          />
        </div>

        {/* Remove the font controls since they're now in the toolbar */}
        {isTextareaActive && currentSide === 'back' && (
          <div className="absolute -left-[calc(200px+24px)] top-0 w-[200px] flex flex-col gap-4 controls-container">
            {/* Remove the font and color controls since they're now in the toolbar */}
          </div>
        )}
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[45%] h-[95%] flex flex-col rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 flex-shrink-0 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="bg-gray-100 rounded-lg p-4 h-[600px] flex items-center justify-center">
                  <img
                    src={showPreview}
                    alt="Postcard Preview"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Select your image dimension</p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setPreviewLayout('horizontal')}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        previewLayout === 'horizontal'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Horizontal
                    </button>
                    <button
                      onClick={() => setPreviewLayout('vertical')}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        previewLayout === 'vertical'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Vertical
                    </button>
                    <button
                      onClick={() => setPreviewLayout('square')}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        previewLayout === 'square'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Square
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="p-6 flex-shrink-0 border-t bg-gray-50 rounded-b-lg mt-auto">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
                <a
                  href={showPreview}
                  download={`my-postcard-${previewLayout}.png`}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}