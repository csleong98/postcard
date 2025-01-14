'use client'

import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { 
  Pencil, 
  PencilLine, 
  Eraser, 
  Trash, 
  UploadSimple,
  Export 
} from "@phosphor-icons/react";
import Toolbar from './Toolbar';

// Add these icon components
const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
  </svg>
);

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
  const [selectedFont, setSelectedFont] = useState('Roboto');
  const [textColor, setTextColor] = useState('#000000');
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [showPreview, setShowPreview] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailDetails, setEmailDetails] = useState({
    to: '',
    subject: 'I sent you a postcard!',
    message: 'Hey, check out this postcard I made for you!'
  });

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
    const padding = 16; // Same padding as editing mode
    const cardWidth = 879;
    const cardHeight = 591;
    const spacing = 40; // Space between title and cards
    const totalHeight = cardHeight * 2 + spacing * 3; // Height for title + two cards + spacing
    
    // Add extra width for padding and shadow
    previewCanvas.width = cardWidth + (padding * 2);
    previewCanvas.height = totalHeight + (padding * 2);
    const ctx = previewCanvas.getContext('2d');

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

    // Add title
    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.fillText('Hey, you got mail!', padding, spacing);

    // Function to draw card shadow
    const drawCardShadow = (x, y, width, height) => {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, width, height);
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    };

    const img = new Image();
    img.onload = () => {
      // Draw front card with shadow
      const frontY = spacing + padding;
      drawCardShadow(padding, frontY, cardWidth, cardHeight);
      
      // Draw front content
      ctx.save();
      ctx.beginPath();
      ctx.rect(padding, frontY, cardWidth, cardHeight);
      ctx.clip();
      
      // Fill white background first
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(padding, frontY, cardWidth, cardHeight);
      
      // Draw background image with padding (4px inset from card edges)
      const imageInset = 16;  // Same as p-4 in the editing mode
      ctx.drawImage(
        img, 
        padding + imageInset, 
        frontY + imageInset, 
        cardWidth - (imageInset * 2), 
        cardHeight - (imageInset * 2)
      );
      
      // Draw any drawings on top, also with padding
      ctx.drawImage(
        frontCanvasRef.current, 
        padding + imageInset, 
        frontY + imageInset, 
        cardWidth - (imageInset * 2), 
        cardHeight - (imageInset * 2)
      );
      ctx.restore();

      // Draw back card with shadow
      const backY = frontY + cardHeight + spacing;
      drawCardShadow(padding, backY, cardWidth, cardHeight);
      
      // Draw back content
      ctx.save();
      ctx.beginPath();
      ctx.rect(padding, backY, cardWidth, cardHeight);
      ctx.clip();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(padding, backY, cardWidth, cardHeight);
      
      // Draw static elements (lines and stamp box)
      ctx.drawImage(staticCanvasRef.current, padding, backY);
      
      // Get textarea content and style
      const textarea = document.querySelector('textarea');
      if (textarea) {
        ctx.font = `16px ${selectedFont}`;
        ctx.fillStyle = textColor;
        
        // Split text into lines first (handle Enter/newlines)
        const lines = textarea.value.split('\n');
        let y = backY + 36; // Starting y position for text
        const maxWidth = (cardWidth / 2) - 40;
        const x = padding + 36;

        // Process each line
        lines.forEach(text => {
          // Then handle word wrap within each line
          const words = text.split(' ');
          let line = '';
          
          words.forEach(word => {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth) {
              ctx.fillText(line, x, y);
              line = word + ' ';
              y += 24;
            } else {
              line = testLine;
            }
          });
          // Draw remaining text in the line
          ctx.fillText(line, x, y);
          // Move to next line after each paragraph (Enter)
          y += 24;
        });
      }
      ctx.restore();

      // Show preview modal
      setShowPreview(previewCanvas.toDataURL());
    };
    img.src = uploadedImage;
  };

  const handleEmail = async () => {
    try {
      const response = await fetch(showPreview);
      if (!response.ok) {
        throw new Error('Failed to fetch preview image');
      }
      
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onload = async () => {
        const base64data = reader.result;
        console.log('Original image size:', Math.round(base64data.length / 1024), 'KB');
        
        // Compress the image
        const compressedImage = await compressImage(base64data);
        console.log('Compressed image size:', Math.round(compressedImage.length / 1024), 'KB');
        
        try {
          const emailResponse = await emailjs.send(
            'service_e28809c',
            'template_t0qxfu9',
            {
              to_email: emailDetails.to,
              subject: emailDetails.subject,
              message: emailDetails.message,
              image_url: compressedImage
            },
            'Mra82Sn-VgBPLdEWV'
          );
          
          console.log('EmailJS Response:', emailResponse);
          alert('Postcard sent successfully!');
          setShowEmailForm(false);
          setShowPreview(false);
        } catch (emailError) {
          console.error('EmailJS Error Details:', emailError);
          alert(`Failed to send email: ${emailError.message}`);
        }
      };
      
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Main Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Initialize EmailJS in useEffect
  useEffect(() => {
    emailjs.init("Mra82Sn-VgBPLdEWV");
  }, []);

  // Draw static elements on back side
  useEffect(() => {
    const canvas = staticCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set styles for lines and box
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      
      // Draw stamp box in top right
      ctx.strokeRect(canvas.width - 120 - 16, 16, 120, 160);
      
      // Draw vertical line in middle
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 16);
      ctx.lineTo(canvas.width / 2, canvas.height - 16);
      ctx.stroke();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Title */}
      <h1 className="text-slate-900 text-4xl font-bold mb-8 text-center">
        Design your own postcard and send it to anyone!
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
                    color: textColor
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
          <div className="bg-white p-6 rounded-lg max-w-[95vw] max-h-[95vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Postcard Preview</h2>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setShowEmailForm(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <img
              src={showPreview}
              alt="Postcard Preview"
              className="max-w-full"
            />
            <div className="mt-4">
              {showEmailForm ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Recipient's Email
                    </label>
                    <input
                      type="email"
                      value={emailDetails.to}
                      onChange={(e) => setEmailDetails({...emailDetails, to: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailDetails.subject}
                      onChange={(e) => setEmailDetails({...emailDetails, subject: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      value={emailDetails.message}
                      onChange={(e) => setEmailDetails({...emailDetails, message: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowEmailForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEmail}
                      disabled={!emailDetails.to}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      Send Email
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                  >
                    Close
                  </button>
                  <a
                    href={showPreview}
                    download="my-postcard.png"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => setShowEmailForm(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Send via Email
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}