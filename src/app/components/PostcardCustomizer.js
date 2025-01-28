'use client'

import React, { useState, useRef, useEffect } from 'react';
import Toolbar from './Toolbar';
import { Upload, Eye } from 'lucide-react';
import { createPortal } from 'react-dom';

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
  const [previewBackground, setPreviewBackground] = useState('/images/preview-bg.png');
  const [isMobile, setIsMobile] = useState(false);
  const [message, setMessage] = useState('');

  // Add useEffect to handle preview generation when layout changes
  useEffect(() => {
    if (showPreview) {
      generatePreview();
    }
  }, [previewLayout]);

  // Add useEffect to detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = frontCanvasRef.current;
      const staticCanvas = staticCanvasRef.current;
      if (canvas && staticCanvas) {
        const container = canvas.parentElement;
        const { width, height } = container.getBoundingClientRect();
        
        // Set canvas dimensions to match container
        canvas.width = width;
        canvas.height = height;
        staticCanvas.width = width;
        staticCanvas.height = height;

        // Redraw static elements
        const ctx = staticCanvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;
        
        // Scale stamp box and divider line with larger padding for mobile
        const padding = isMobile ? width * (32/879) : width * (16/879);
        const stampWidth = width * (120/879);
        const stampHeight = height * (160/591);
        
        // Draw stamp box
        ctx.strokeRect(width - stampWidth - padding, padding, stampWidth, stampHeight);
        
        // Draw divider line
        ctx.beginPath();
        ctx.moveTo(width / 2, padding);
        ctx.lineTo(width / 2, height - padding);
        ctx.stroke();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [isMobile]);

  const handleFlip = () => {
    setCurrentSide(currentSide === 'front' ? 'back' : 'front');
  };

  // Add this useEffect to monitor image updates
  useEffect(() => {
    console.log('uploadedImage changed:', uploadedImage);
  }, [uploadedImage]);

  const handleImageUpload = (event) => {
    console.log('Upload handler triggered'); // Debug log
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name); // Debug log
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('File read complete'); // Debug log
        const result = event.target.result;
        console.log('Image data length:', result.length); // Debug log
        setUploadedImage(result);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No file selected'); // Debug log
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
      const canvas = frontCanvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const point = e.touches ? e.touches[0] : e;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (point.clientX - rect.left) * scaleX;
      const y = (point.clientY - rect.top) * scaleY;

      // Only start drawing if within canvas bounds
      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        isDrawing.current = true;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
      }

      // Prevent scrolling while drawing on touch devices
      if (e.touches) {
        e.preventDefault();
      }
    }
  };

  const draw = (e) => {
    if (!isDrawing.current || !selectedTool) return;
    
    const canvas = frontCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (point.clientX - rect.left) * scaleX;
    const y = (point.clientY - rect.top) * scaleY;

    // Only draw if within canvas bounds
    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
      const ctx = canvas.getContext('2d');

      if (selectedTool === 'eraser') {
        const size = canvas.width * (16/879); // Scale eraser size
        ctx.clearRect(
          x - size / 2,
          y - size / 2,
          size,
          size
        );
      } else {
        ctx.lineTo(x, y);
        ctx.strokeStyle = selectedTool === 'pencil' ? drawingColor : `${drawingColor}80`;
        ctx.lineWidth = selectedTool === 'pencil' ? canvas.width * (2/879) : canvas.width * (8/879);
        ctx.stroke();
      }
    }

    // Prevent scrolling while drawing on touch devices
    if (e.touches) {
      e.preventDefault();
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
    const ctx = previewCanvas.getContext('2d');
    
    // Set fixed square canvas dimensions
    const canvasWidth = 1500;
    const canvasHeight = 1500;
    previewCanvas.width = canvasWidth;
    previewCanvas.height = canvasHeight;

    // Load and draw background image
    const bgImg = new Image();
    bgImg.onload = () => {
      // Draw background with cover effect
      const bgAspect = bgImg.width / bgImg.height;
      const canvasAspect = canvasWidth / canvasHeight;
      let drawWidth, drawHeight, x, y;

      if (bgAspect > canvasAspect) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * bgAspect;
        x = (canvasWidth - drawWidth) / 2;
        y = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / bgAspect;
        x = 0;
        y = (canvasHeight - drawHeight) / 2;
      }

      ctx.drawImage(bgImg, x, y, drawWidth, drawHeight);

      // Load and draw postcard content
      const frontImg = new Image();
      frontImg.crossOrigin = "anonymous";
      frontImg.onload = () => {
        // Calculate card dimensions and positions
        const cardWidth = 879;
        const cardHeight = 591;
        const scale = 1.2;
        const padding = 16 * scale;

        // Center horizontally and position vertically
        const frontX = (canvasWidth - cardWidth * scale) / 2;
        const frontY = canvasHeight * 0.05;
        const backX = frontX - 15;
        const backY = canvasHeight * 0.45;

        // Helper function to draw a rotated card with shadow
        const drawRotatedCard = (x, y, width, height, rotation, drawContent) => {
          ctx.save();
          ctx.translate(x + width / 2, y + height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.translate(-(x + width / 2), -(y + height / 2));
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x, y, width, height);
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          drawContent(x, y, width, height);
          ctx.restore();
        };

        // Draw front card
        drawRotatedCard(
          frontX, 
          frontY, 
          cardWidth * scale, 
          cardHeight * scale,
          2,
          (x, y, w, h) => {
            const paddedX = x + padding;
            const paddedY = y + padding;
            const paddedWidth = w - (padding * 2);
            const paddedHeight = h - (padding * 2);
            ctx.drawImage(frontImg, paddedX, paddedY, paddedWidth, paddedHeight);
            // Draw the front canvas content for both mobile and desktop
            const frontCanvas = frontCanvasRef.current;
            if (frontCanvas) {
              ctx.drawImage(frontCanvas, paddedX, paddedY, paddedWidth, paddedHeight);
            }
          }
        );

        // Draw back card
        drawRotatedCard(
          backX, 
          backY, 
          cardWidth * scale, 
          cardHeight * scale,
          -2,
          (x, y, w, h) => {
            // Draw static canvas content
            const staticCanvas = staticCanvasRef.current;
            if (staticCanvas) {
              ctx.drawImage(staticCanvas, x, y, w, h);
            }

            // Draw text content - handle both mobile and desktop
            const textareas = document.querySelectorAll('textarea');
            let textContent = '';
            textareas.forEach(textarea => {
              if (textarea.value) {
                textContent = textarea.value;
              }
            });

            if (textContent) {
              ctx.font = `${24 * scale}px ${selectedFont}`;
              ctx.fillStyle = textColor;
              const lines = textContent.split('\n');
              let textY = y + (36 * scale);
              const maxWidth = (w / 2) - (40 * scale);
              const textX = x + (36 * scale);

              lines.forEach(line => {
                ctx.fillText(line, textX, textY, maxWidth);
                textY += 24 * scale;
              });
            }
          }
        );

        setShowPreview(previewCanvas.toDataURL('image/png'));
      };
      frontImg.src = uploadedImage;
    };
    bgImg.src = previewBackground;
  };

  // Add touch event handler to prevent scrolling
  useEffect(() => {
    const canvas = frontCanvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
      canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('touchstart', (e) => e.preventDefault());
        canvas.removeEventListener('touchmove', (e) => e.preventDefault());
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-full max-w-[879.04px]">
          {/* Mobile Sections */}
          {isMobile && (
            <div className="flex flex-col gap-8">
              {/* Section 1: Upload and Draw */}
              <div>
                <h2 className="text-xl text-slate-900 mb-4" style={{ fontFamily: 'PP Editorial New', fontStyle: 'italic' }}>
                  1. Upload and draw
                </h2>
                <div className="relative w-full">
                  <div className="w-full aspect-[879/591] bg-white shadow-md relative overflow-hidden">
                    <img
                      src={uploadedImage}
                      alt="Postcard Front"
                      className="w-full h-full object-cover p-4 box-border pointer-events-none"
                    />
                    <canvas
                      ref={frontCanvasRef}
                      className="absolute inset-0 w-full h-full touch-none"
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      onTouchCancel={stopDrawing}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                  </div>

                  {/* Mobile Upload Section */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full mt-4 text-sm text-transparent
                        file:mr-4 file:py-2 file:px-4 
                        file:rounded-lg file:border-0 
                        file:text-white file:bg-[#2F2F2F] 
                        file:hover:bg-black file:transition-all
                        file:cursor-pointer file:text-sm
                        file:flex file:items-center file:justify-center
                        file:w-full file:h-full
                        cursor-pointer"
                      style={{
                        color: 'transparent',
                      }}
                    />
                    {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center gap-2 mt-2">
                      <Upload size={20} className="text-white" />
                      <span className="text-white">Upload Photo</span>
                    </div> */}
                  </div>

                  {/* Front Toolbar */}
                  <div className="mt-4 relative z-10">
                    <Toolbar
                      currentSide="front"
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
                      isMobile={isMobile}
                      hideUpload={true}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Write Message */}
              <div>
                <h2 className="text-xl text-slate-900 mb-4" style={{ fontFamily: 'PP Editorial New', fontStyle: 'italic' }}>
                  2. Write your message
                </h2>
                <div className="relative w-full">
                  <div className="w-full aspect-[879/591] bg-white shadow-md relative overflow-hidden">
                    <canvas
                      ref={staticCanvasRef}
                      className="absolute inset-0 w-full h-full"
                      style={{
                        width: '100%',
                        height: '100%'
                      }}
                    />
                    <div className="absolute inset-0 p-4 md:p-8">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message here..."
                        className="w-1/2 h-full resize-none bg-transparent focus:outline-none"
                        style={{
                          fontFamily: selectedFont,
                          color: textColor,
                          fontSize: isMobile ? '16px' : '24px',
                          lineHeight: '1.5',
                        }}
                      />
                    </div>
                  </div>

                  {/* Back Toolbar */}
                  <div className="mt-4 relative z-10">
                    <Toolbar
                      currentSide="back"
                      selectedTool={selectedTool}
                      drawingColor={drawingColor}
                      textColor={textColor}
                      selectedFont={selectedFont}
                      fontOptions={fontOptions}
                      onToolSelect={setSelectedTool}
                      onColorChange={setDrawingColor}
                      onTextColorChange={setTextColor}
                      onFontChange={setSelectedFont}
                      isMobile={isMobile}
                    />
                  </div>
                </div>
              </div>

              {/* Preview Button */}
              <button
                onClick={() => {
                  generatePreview();
                  setShowPreview(true);
                }}
                className="w-full px-4 py-2 bg-[#2F2F2F] text-white rounded-lg hover:bg-black transition-all flex items-center justify-center gap-2 relative z-10"
              >
                <Eye size={20} />
                Preview Postcard
              </button>
            </div>
          )}

          {/* Desktop View */}
          {!isMobile && (
            <div className="relative">
              <div className="w-full mb-4">
                <div className="relative w-full aspect-[879/591] perspective">
                  <div
                    className="absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d"
                    style={{
                      transform: currentSide === 'back' ? 'rotateY(180deg)' : ''
                    }}
                  >
                    {/* Front Side */}
                    <div className="absolute w-full h-full backface-hidden bg-white shadow-md flex items-center justify-center touch-none">
                      <canvas
                        ref={frontCanvasRef}
                        width={879}
                        height={591}
                        className="absolute inset-0 touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        onTouchCancel={stopDrawing}
                      ></canvas>
                      <img
                        src={uploadedImage}
                        alt="Postcard Front"
                        className="w-full h-full object-cover p-4 box-border pointer-events-none"
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
                    <div className="absolute w-full h-full backface-hidden bg-white shadow-md rotate-y-180">
                      <canvas
                        ref={staticCanvasRef}
                        width={879}
                        height={591}
                        className="absolute inset-0"
                      ></canvas>
                      <div className="absolute inset-0 p-8">
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Write your message here..."
                          className="w-1/2 h-full resize-none bg-transparent focus:outline-none"
                          style={{
                            fontFamily: selectedFont,
                            color: textColor,
                            fontSize: '24px',
                            lineHeight: '1.5',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Desktop Toolbar */}
              <div className='w-full'>
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
                  isMobile={isMobile}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
          <div className="w-[calc(100%-32px)] md:w-[70%] h-[80%] bg-white rounded-lg flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 flex-shrink-0 border-b">
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

            {/* Content */}
            <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 min-h-0 overflow-auto">
              <div className="relative w-full h-full flex items-center justify-center">
                {typeof showPreview === 'string' && (
                  <img
                    src={showPreview}
                    alt="Postcard Preview"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                  />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 flex-shrink-0 border-t bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
                {typeof showPreview === 'string' && (
                  <a
                    href={showPreview}
                    download="my-postcard.png"
                    className="px-4 py-2 rounded-lg bg-[#2F2F2F] text-white hover:bg-black transition-all"
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}