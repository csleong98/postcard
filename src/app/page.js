'use client'

import { useState, useRef, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { Eye, Upload } from "@phosphor-icons/react"
import { Tabs } from './components/common/Tabs'
import { Stepper } from './components/common/Stepper'
import { StickersTab } from './components/stickers'
import RangeSlider from './components/RangeSlider'

const tabs = [
  { id: 'picture', label: 'Picture' },
  { id: 'stickers', label: 'Stickers' },
  { id: 'draw', label: 'Draw' }
]

const sampleImages = [
  { 
    id: 'pattern1', 
    src: '/images/patterns/chinese new year pattern.png', 
    alt: 'Chinese New Year pattern' 
  },
  { 
    id: 'pattern2', 
    src: '/images/patterns/christmas pattern.png', 
    alt: 'Christmas pattern' 
  },
  { 
    id: 'pattern3', 
    src: '/images/patterns/mountain view.png', 
    alt: 'Mountain view' 
  },
  { 
    id: 'pattern4', 
    src: '/images/patterns/random colour patterns.png', 
    alt: 'Random patterns' 
  },
  { 
    id: 'pattern5', 
    src: '/images/patterns/valentines pattern.png', 
    alt: 'Valentine pattern' 
  }
]

const steps = [
  { 
    id: 1, 
    name: 'Front', 
    description: 'Design the front', 
    status: 'current' 
  },
  { 
    id: 2, 
    name: 'Back', 
    description: 'Write your message', 
    status: 'upcoming' 
  },
  { 
    id: 3, 
    name: 'Preview', 
    description: 'Check and download', 
    status: 'upcoming' 
  }
]

const defaultImage = {
  src: '/images/default-image.png',
  alt: 'Default postcard background'
}

const compressImage = (base64String) => {
  return new Promise((resolve) => {
    const image = document.createElement('img');
    image.src = base64String;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions (reduce by 50%)
      const newWidth = image.width * 0.5;
      const newHeight = image.height * 0.5;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw and compress
      ctx.drawImage(image, 0, 0, newWidth, newHeight);
      
      // Get compressed base64 (0.7 quality)
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

// Add this at the top with other constants
const fontOptions = [
  { name: 'Homemade Apple', value: 'Homemade Apple' },
  { name: 'Dancing Script', value: 'Dancing Script' },
  { name: 'Caveat', value: 'Caveat' },
  { name: 'Indie Flower', value: 'Indie Flower' },
  { name: 'Shadows Into Light', value: 'Shadows Into Light' },
];

export default function TestPage() {
  const [activeTab, setActiveTab] = useState('picture')
  const [selectedImage, setSelectedImage] = useState(defaultImage)
  const [currentStep, setCurrentStep] = useState(1)
  const canvasRef = useRef(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const staticCanvasRef = useRef(null)
  const [message, setMessage] = useState('')
  const [selectedFont, setSelectedFont] = useState('Caveat')
  const [textColor, setTextColor] = useState('#000000')
  const [fontSize, setFontSize] = useState(24) // Default font size

  const { stickerPickerUI, canvasElements, handleCanvasClick, isPasteMode } = StickersTab({ canvasRef })

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId)
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const result = event.target.result;
          const compressed = await compressImage(result);
          setUploadedImage(compressed);
          
          // Create a blob URL instead of using base64
          const response = await fetch(compressed);
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          
          setSelectedImage({
            id: 'uploaded',
            src: objectUrl,
            alt: 'Uploaded image'
          });
        } catch (error) {
          console.error('Error processing image:', error);
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (selectedImage?.id === 'uploaded') {
        URL.revokeObjectURL(selectedImage.src);
      }
    };
  }, [selectedImage]);

  // Add these constants for card dimensions
  const cardScale = 1.2
  const basePadding = 16 * cardScale

  // Add this useEffect for the static elements (stamp box and divider)
  useEffect(() => {
    const canvas = staticCanvasRef.current;
    if (canvas && currentStep === 2) {
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = 879;
      canvas.height = 591;
      
      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
      
      // Clear canvas and set styles
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      
      // Draw stamp box
      const stampX = canvas.width - 120 - 16;
      const stampY = 16;
      const stampWidth = 120;
      const stampHeight = 160;
      ctx.strokeRect(stampX, stampY, stampWidth, stampHeight);
      
      // Draw divider line
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 16);
      ctx.lineTo(canvas.width / 2, canvas.height - 16);
      ctx.stroke();

      // Render message text if it exists
      if (message) {
        // Set text styles with dynamic font size
        ctx.font = `${fontSize}px ${selectedFont}`;
        ctx.fillStyle = textColor;
        ctx.textBaseline = 'top'; // Ensure consistent text positioning
        
        // Calculate text area dimensions
        const leftHalfWidth = Math.floor(canvas.width / 2);
        
        // Mirror the stamp box position for text positioning
        const leftMargin = 16; // Same as stamp's right margin
        const rightMargin = 12;
        const maxWidth = leftHalfWidth - leftMargin - rightMargin;
        
        // Use the same Y position as the stamp box
        const startY = stampY;
        // Adjust line height based on font size
        const lineHeight = Math.max(fontSize * 1.2, 28); // Ensure adequate spacing
        
        // Calculate the maximum height available for text
        // Use the same bottom margin as the top margin (stampY)
        const maxTextHeight = canvas.height - startY - stampY;
        const maxLines = Math.floor(maxTextHeight / lineHeight);
        
        console.log('Text area settings:', {
          canvasWidth: canvas.width,
          leftHalfWidth,
          maxWidth,
          leftMargin,
          rightMargin,
          startY,
          lineHeight,
          maxTextHeight,
          maxLines,
          font: ctx.font,
          fontSize,
          stampY
        });
        
        // Draw text area boundary for debugging (comment out in production)
        const debugMode = true; // Set to false to hide the boundary
        if (debugMode) {
          const originalStrokeStyle = ctx.strokeStyle;
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
          ctx.lineWidth = 1;
          ctx.strokeRect(
            leftMargin, 
            startY, 
            maxWidth, 
            canvas.height - (2 * stampY) // Height from top margin to bottom margin
          );
          ctx.strokeStyle = originalStrokeStyle;
        }
        
        // Improved function to wrap text
        const wrapText = (text, startX, startY, maxTextWidth, lineHeight) => {
          // Split text by manual line breaks
          const paragraphs = text.split('\n');
          let y = startY;
          let lineCount = 0;
          let hasOverflow = false;
          
          // Process each paragraph
          for (let p = 0; p < paragraphs.length; p++) {
            const paragraph = paragraphs[p];
            
            // Handle empty paragraphs (just a newline)
            if (paragraph.trim() === '') {
              y += lineHeight;
              lineCount++;
              
              // Check if we've exceeded the maximum number of lines
              if (lineCount > maxLines) {
                hasOverflow = true;
                break;
              }
              continue;
            }
            
            // Split paragraph into words
            const words = paragraph.split(' ');
            let line = '';
            let testWidth = 0;
            
            // Process each word
            for (let i = 0; i < words.length; i++) {
              const word = words[i];
              
              // Handle very long words that exceed maxTextWidth on their own
              const wordWidth = ctx.measureText(word).width;
              if (wordWidth > maxTextWidth) {
                // If we already have content on the current line, draw it first
                if (line.length > 0) {
                  if (lineCount < maxLines) {
                    ctx.fillText(line, startX, y);
                  }
                  y += lineHeight;
                  lineCount++;
                  line = '';
                }
                
                // Draw the long word character by character if needed
                let charIndex = 0;
                let currentChars = '';
                
                while (charIndex < word.length) {
                  const nextChar = word[charIndex];
                  const testChars = currentChars + nextChar;
                  const testWidth = ctx.measureText(testChars).width;
                  
                  if (testWidth > maxTextWidth && currentChars.length > 0) {
                    // Draw current characters and move to next line
                    if (lineCount < maxLines) {
                      ctx.fillText(currentChars, startX, y);
                    }
                    y += lineHeight;
                    lineCount++;
                    
                    // Check if we've exceeded the maximum number of lines
                    if (lineCount > maxLines) {
                      hasOverflow = true;
                      break;
                    }
                    
                    currentChars = nextChar;
                  } else {
                    currentChars = testChars;
                  }
                  
                  charIndex++;
                }
                
                // Draw any remaining characters
                if (currentChars.length > 0 && lineCount < maxLines) {
                  ctx.fillText(currentChars, startX, y);
                  y += lineHeight;
                  lineCount++;
                  
                  // Check if we've exceeded the maximum number of lines
                  if (lineCount > maxLines) {
                    hasOverflow = true;
                    break;
                  }
                }
                
                continue; // Skip to the next word
              }
              
              // Normal word processing
              const wordWithSpace = line.length > 0 ? ' ' + word : word;
              const testLine = line + wordWithSpace;
              const metrics = ctx.measureText(testLine);
              testWidth = metrics.width;
              
              // Check if adding this word would exceed the max width
              if (testWidth > maxTextWidth && line.length > 0) {
                // Draw current line and move to next line
                if (lineCount < maxLines) {
                  ctx.fillText(line, startX, y);
                }
                y += lineHeight;
                lineCount++;
                
                // Check if we've exceeded the maximum number of lines
                if (lineCount > maxLines) {
                  hasOverflow = true;
                  break;
                }
                
                line = word;
              } else {
                // Add word to current line
                line = testLine;
              }
            }
            
            // Draw the last line of the paragraph
            if (line.length > 0 && lineCount < maxLines) {
              ctx.fillText(line, startX, y);
              y += lineHeight;
              lineCount++;
              
              // Check if we've exceeded the maximum number of lines
              if (lineCount > maxLines) {
                hasOverflow = true;
              }
            }
            
            // If we've exceeded the maximum number of lines, stop processing
            if (hasOverflow) {
              break;
            }
          }
          
          // If there's overflow, draw an indicator
          if (hasOverflow) {
            const originalFillStyle = ctx.fillStyle;
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            // Position the truncation indicator at the bottom of the text area with proper spacing
            ctx.fillText('...text truncated', startX, canvas.height - stampY - lineHeight);
            ctx.fillStyle = originalFillStyle;
          }
          
          return { 
            finalY: y, 
            lineCount, 
            hasOverflow 
          };
        };
        
        // Call the wrap text function
        const { finalY, lineCount, hasOverflow } = wrapText(message, leftMargin, startY, maxWidth, lineHeight);
        
        console.log('Text rendering results:', {
          finalY,
          lineCount,
          maxLines,
          hasOverflow
        });
        
        // Store the overflow state to display a warning in the UI
        if (window.postcard === undefined) {
          window.postcard = {};
        }
        window.postcard.textOverflow = hasOverflow;
        
        // Set a fixed character limit of 600 instead of dynamic calculation
        const fixedCharLimit = 600;
        window.postcard.estimatedCharLimit = fixedCharLimit;
        
        console.log('Character limit set to:', fixedCharLimit);
      }
    }
  }, [currentStep, message, selectedFont, textColor, fontSize]);

  // Add a new state for tracking text overflow
  const [textOverflow, setTextOverflow] = useState(false);
  const [estimatedCharLimit, setEstimatedCharLimit] = useState(600); // Default to 600 characters
  
  // Check for text overflow after rendering
  useEffect(() => {
    const checkOverflow = () => {
      if (window.postcard?.textOverflow !== undefined) {
        setTextOverflow(window.postcard.textOverflow);
      }
      if (window.postcard?.estimatedCharLimit !== undefined) {
        setEstimatedCharLimit(window.postcard.estimatedCharLimit);
      }
    };
    
    // Check after a short delay to ensure canvas has rendered
    const timeoutId = setTimeout(checkOverflow, 100);
    return () => clearTimeout(timeoutId);
  }, [message]);

  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      <Stepper 
        steps={steps.map(step => ({
          ...step,
          status: step.id === currentStep 
            ? 'current'
            : step.id < currentStep 
              ? 'complete' 
              : 'upcoming'
        }))} 
        variant="default"
      />
      
      <div className="grid grid-cols-12 gap-4 p-8">
        {/* Left Panel - Only show in step 1 and 2 */}
        {currentStep < 3 && (
          <div className="col-span-12 lg:col-span-3 xl:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black/5 mb-6">
              <span>←</span>
              <span>Back</span>
            </Link>

            <h1 className="h3 mb-4">
              {currentStep === 1 ? 'Design the front' : 'Write your message'}
            </h1>

            {currentStep === 1 && (
              <>
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Picture Selection */}
                {activeTab === 'picture' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2>Select a picture</h2>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          title=""
                        />
                        <button className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                          <Upload size={16} />
                          <span>{uploadedImage ? 'Reupload photo' : 'Upload photo'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {sampleImages.map((image) => (
                        <button
                          key={image.id}
                          className={`aspect-[4/3] rounded-lg border-2 overflow-hidden ${
                            selectedImage?.src === image.src 
                              ? 'border-blue-500' 
                              : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedImage(image)}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 200px) 100vw, 200px"
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stickers Selection */}
                {activeTab === 'stickers' && stickerPickerUI}
              </>
            )}

            {currentStep === 2 && (
              <div>
                <RangeSlider 
                  value={fontSize}
                  onChange={setFontSize}
                  min={16}
                  max={36}
                  step={2}
                  label="Font Size"
                  unit="px"
                />
                <div className="mb-4">
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                  >
                    {fontOptions.map(font => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <textarea 
                    value={message}
                    onChange={(e) => {
                      // Only update if we're under the character limit
                      if (e.target.value.length <= 600) {
                        setMessage(e.target.value);
                      }
                    }}
                    placeholder="Write your message here..."
                    className={`w-full h-48 p-4 rounded-lg border ${
                      textOverflow ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-black focus:ring-1 focus:ring-black'
                    } font-sans`}
                    style={{
                      fontSize: '16px', // Fixed default font size
                      lineHeight: '1.5',
                      fontFamily: 'inherit' // Use default font family
                    }}
                    maxLength={600} // Fixed character limit
                  />
                  <div className="mt-2 flex justify-between text-sm">
                    <div className={message.length >= 600 ? 'text-red-500' : 'text-gray-500'}>
                      {message.length} / 600 characters
                    </div>
                    {message.length >= 600 && (
                      <div className="text-red-500">
                        Character limit reached
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <button 
                  onClick={() => handleStepChange(currentStep - 1)}
                  className="flex-1 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 && (
                <button 
                  onClick={() => handleStepChange(currentStep + 1)}
                  className="flex-1 py-3 px-4 rounded-lg bg-black text-white hover:bg-black/90"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Panel - Postcard Preview */}
        <div className={`col-span-12 ${currentStep < 3 ? 'lg:col-span-9 xl:col-span-8' : 'lg:col-span-12'} flex items-center justify-center`}>
          <div className="relative w-full max-w-[800px]">
            <div className="w-full aspect-[879/591]">
              {currentStep === 1 ? (
                // Front Side
                <div className="w-full h-full bg-white relative">
                  <img
                    src={selectedImage?.src || defaultImage.src}
                    alt={selectedImage?.alt || defaultImage.alt}
                    className="w-full h-full object-cover p-4 box-border pointer-events-none"
                  />
                  <div className="absolute inset-0 p-4">
                    {canvasElements}
                  </div>
                </div>
              ) : (
                // Back Side
                <div className="w-full h-full bg-white relative">
                  <div className="w-full h-full relative">
                    <canvas
                      ref={staticCanvasRef}
                      width="879"
                      height="591"
                      className="w-full h-full"
                    ></canvas>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 