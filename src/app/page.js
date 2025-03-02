'use client'

import { useState, useRef, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { Eye, Upload, Question, ChatCircle } from "@phosphor-icons/react"
import { Tabs } from './components/common/Tabs'
import { Stepper } from './components/common/Stepper'
import { StickersTab } from './components/stickers'
import RangeSlider from './components/RangeSlider'
import html2canvas from 'html2canvas'

const tabs = [
  { id: 'picture', label: 'Picture' },
  { id: 'stickers', label: 'Stickers' },
  { id: 'draw', label: 'Draw' }
]

// Add tabs for the back of the postcard
const backTabs = [
  { id: 'message', label: 'Message' },
  { id: 'stamp', label: 'Stamp' },
  { id: 'stickers', label: 'Stickers' }
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
    status: 'current' 
  },
  { 
    id: 2, 
    name: 'Back', 
    status: 'upcoming' 
  },
  { 
    id: 3, 
    name: 'Preview', 
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

// Add the prepareForExport function
const prepareForExport = () => {
  // Disable all console logs in browser environment
  if (typeof window !== 'undefined') {
    // Store original console methods
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      debug: console.debug
    };
    
    // Replace with empty functions
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    console.debug = () => {};
    
    // Return function to restore console if needed
    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.debug = originalConsole.debug;
    };
  }
  
  return () => {}; // Return empty function if not in browser
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
  const [activeBackTab, setActiveBackTab] = useState('message')
  const [selectedImage, setSelectedImage] = useState(defaultImage)
  const [currentStep, setCurrentStep] = useState(1)
  const frontCanvasRef = useRef(null)
  const backCanvasRef = useRef(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const staticCanvasRef = useRef(null)
  const [message, setMessage] = useState('')
  const [selectedFont, setSelectedFont] = useState('Caveat')
  const [textColor, setTextColor] = useState('#000000')
  const [fontSize, setFontSize] = useState(24) // Default font size
  const [recipientAddress, setRecipientAddress] = useState('') // Add recipient address state
  const [downloadFormat, setDownloadFormat] = useState('separate') // Add download format state
  const [isDownloading, setIsDownloading] = useState(false) // Add loading state for download
  const [downloadStatus, setDownloadStatus] = useState(null) // Add download status for notifications
  
  // Add state for stickers
  const [frontStickers, setFrontStickers] = useState([])
  const [backStickers, setBackStickers] = useState([])

  // Initialize front stickers functionality
  const { 
    stickerPickerUI: frontStickerPickerUI, 
    canvasElements: frontCanvasElements,
    handleCanvasClick: handleFrontCanvasClick, 
    isPasteMode: isFrontPasteMode,
    resetPasteMode: resetFrontPasteMode,
    stickers: currentFrontStickers,
    setSelectedSticker: setSelectedFrontSticker
  } = StickersTab({ 
    canvasRef: frontCanvasRef,
    initialStickers: frontStickers,
    onStickersChange: setFrontStickers,
    stickerIdPrefix: 'front-sticker'
  })

  // Initialize back stickers functionality
  const { 
    stickerPickerUI: backStickerPickerUI, 
    canvasElements: backCanvasElements,
    handleCanvasClick: handleBackCanvasClick, 
    isPasteMode: isBackPasteMode,
    resetPasteMode: resetBackPasteMode,
    stickers: currentBackStickers,
    setSelectedSticker: setSelectedBackSticker
  } = StickersTab({ 
    canvasRef: backCanvasRef,
    initialStickers: backStickers,
    onStickersChange: setBackStickers,
    stickerIdPrefix: 'back-sticker'
  })

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId)
    // Reset paste mode when changing steps
    resetFrontPasteMode()
    resetBackPasteMode()
  }

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab !== 'stickers') {
      // Only reset paste mode, not selection
      resetFrontPasteMode()
    }
  }

  const handleBackTabChange = (tab) => {
    setActiveBackTab(tab)
    if (tab !== 'stickers') {
      // Only reset paste mode, not selection
      resetBackPasteMode()
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const result = event.target.result;
          const compressed = await compressImage(result);
          
          // Create a blob URL instead of using base64
          const response = await fetch(compressed);
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          
          // Save the uploaded image data
          const uploadedImageData = {
            id: 'uploaded',
            src: objectUrl,
            alt: 'Uploaded image'
          };
          
          setUploadedImage(uploadedImageData);
          setSelectedImage(uploadedImageData);
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
      if (uploadedImage?.src) {
        URL.revokeObjectURL(uploadedImage.src);
      }
    };
  }, [uploadedImage]);

  // Add these constants for card dimensions
  const cardScale = 1.2
  const basePadding = 16 * cardScale

  // Add this useEffect for the static elements (stamp box and divider)
  useEffect(() => {
    const canvas = staticCanvasRef.current;
    if (canvas && (currentStep === 2 || currentStep === 3)) {
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
        const debugMode = false; // Set to false to hide the boundary
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

  // Function to handle postcard download
  const handleDownloadPostcard = () => {
    setIsDownloading(true);
    setDownloadStatus(null);
    
    // Simple approach that will definitely work
    const downloadPostcardImages = async () => {
      try {
        // Disable console logs
        const restoreConsole = prepareForExport();
        
        // Get the actual DOM elements that are visible on screen
        const frontPostcardElement = document.querySelector('#front-postcard-container') || 
                                    document.querySelector('.preview-front-container');
        const backPostcardElement = document.querySelector('.preview-back-container');
        
        if (!frontPostcardElement || !backPostcardElement) {
          throw new Error('Could not find postcard elements');
        }
        
        // Create clones of the elements to avoid modifying the originals
        const frontClone = frontPostcardElement.cloneNode(true);
        const backClone = backPostcardElement.cloneNode(true);
        
        // Set styles to ensure proper rendering
        const commonStyles = {
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '879px',
          height: '591px',
          transform: 'none',
          opacity: '1',
          visibility: 'visible',
          background: 'white',
          overflow: 'hidden',
          display: 'block',
          zIndex: '-1'
        };
        
        // Apply styles to clones
        Object.assign(frontClone.style, commonStyles);
        Object.assign(backClone.style, commonStyles);
        
        // Make sure the static canvas is properly cloned for the back card
        // This is critical to ensure the message, divider line, and stamp box are captured
        if (staticCanvasRef.current) {
          // Get the current static canvas content
          const staticCanvas = staticCanvasRef.current;
          const staticClone = document.createElement('canvas');
          staticClone.width = staticCanvas.width;
          staticClone.height = staticCanvas.height;
          
          // Copy the content from the original static canvas
          const ctx = staticClone.getContext('2d');
          ctx.drawImage(staticCanvas, 0, 0);
          
          // Apply styles to the static canvas clone
          Object.assign(staticClone.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '1'
          });
          
          // Find the canvas in the back clone and replace it or add the new one
          const existingCanvas = backClone.querySelector('canvas');
          if (existingCanvas) {
            backClone.replaceChild(staticClone, existingCanvas);
          } else {
            backClone.insertBefore(staticClone, backClone.firstChild);
          }
        }
        
        // Append to body temporarily
        document.body.appendChild(frontClone);
        document.body.appendChild(backClone);
        
        // Wait for elements to be rendered
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Capture front postcard
        const frontCanvas = await html2canvas(frontClone, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: 'white',
          logging: false
        });
        
        // Capture back postcard
        const backCanvas = await html2canvas(backClone, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: 'white',
          logging: false,
          onclone: (clonedDoc) => {
            // Make sure all elements in the clone are visible
            const clonedBackCard = clonedDoc.querySelector('.preview-back-container');
            if (clonedBackCard) {
              // Ensure all canvases are visible
              const canvases = clonedBackCard.querySelectorAll('canvas');
              canvases.forEach(canvas => {
                canvas.style.visibility = 'visible';
                canvas.style.opacity = '1';
              });
            }
          }
        });
        
        // Remove clones from DOM
        document.body.removeChild(frontClone);
        document.body.removeChild(backClone);
        
        // Restore console
        restoreConsole();
        
        // Check if canvases were created successfully
        if (!frontCanvas || !backCanvas || 
            frontCanvas.width === 0 || frontCanvas.height === 0 || 
            backCanvas.width === 0 || backCanvas.height === 0) {
          throw new Error('Failed to create canvas');
        }
        
        // Handle A4 download
        if (downloadFormat === 'a4') {
          // Create A4 canvas
          const a4Canvas = document.createElement('canvas');
          a4Canvas.width = 2480;  // A4 at 300 DPI
          a4Canvas.height = 3508;
          const ctx = a4Canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Failed to create canvas context');
          }
          
          // Fill with white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, a4Canvas.width, a4Canvas.height);
          
          // Calculate scaled dimensions
          const scale = Math.min(
            (a4Canvas.width - 200) / frontCanvas.width,
            (a4Canvas.height / 2 - 300) / frontCanvas.height
          );
          
          const scaledWidth = Math.floor(frontCanvas.width * scale);
          const scaledHeight = Math.floor(frontCanvas.height * scale);
          
          // Draw front side
          ctx.drawImage(
            frontCanvas, 
            Math.floor((a4Canvas.width - scaledWidth) / 2), 
            100, 
            scaledWidth, 
            scaledHeight
          );
          
          // Draw back side
          ctx.drawImage(
            backCanvas, 
            Math.floor((a4Canvas.width - scaledWidth) / 2), 
            scaledHeight + 200, 
            scaledWidth, 
            scaledHeight
          );
          
          // Add cutting guidelines
          ctx.strokeStyle = '#aaaaaa';
          ctx.setLineDash([15, 15]);
          ctx.lineWidth = 2;
          
          // Draw cutting lines around front
          ctx.strokeRect(
            Math.floor((a4Canvas.width - scaledWidth) / 2) - 15, 
            100 - 15, 
            scaledWidth + 30, 
            scaledHeight + 30
          );
          
          // Draw cutting lines around back
          ctx.strokeRect(
            Math.floor((a4Canvas.width - scaledWidth) / 2) - 15, 
            scaledHeight + 200 - 15, 
            scaledWidth + 30, 
            scaledHeight + 30
          );
          
          // Download A4 image
          const a4DataUrl = a4Canvas.toDataURL('image/png');
          const a4Link = document.createElement('a');
          a4Link.href = a4DataUrl;
          a4Link.download = 'postcard-a4-print.png';
          a4Link.style.display = 'none';
          document.body.appendChild(a4Link);
          a4Link.click();
          document.body.removeChild(a4Link);
          
          setIsDownloading(false);
          setDownloadStatus({
            type: 'success',
            message: 'Your postcard has been downloaded as an A4 print layout.'
          });
        } else {
          // Download separate images
          // Front image
          const frontDataUrl = frontCanvas.toDataURL('image/png');
          const frontLink = document.createElement('a');
          frontLink.href = frontDataUrl;
          frontLink.download = 'postcard-front.png';
          frontLink.style.display = 'none';
          document.body.appendChild(frontLink);
          frontLink.click();
          
          // Back image (with a small delay)
          setTimeout(() => {
            const backDataUrl = backCanvas.toDataURL('image/png');
            const backLink = document.createElement('a');
            backLink.href = backDataUrl;
            backLink.download = 'postcard-back.png';
            backLink.style.display = 'none';
            document.body.appendChild(backLink);
            backLink.click();
            document.body.removeChild(backLink);
            document.body.removeChild(frontLink);
            
            setIsDownloading(false);
            setDownloadStatus({
              type: 'success',
              message: 'Your postcard front and back have been downloaded as separate images.'
            });
          }, 500);
        }
      } catch (error) {
        console.error('Download error:', error);
        setIsDownloading(false);
        setDownloadStatus({
          type: 'error',
          message: 'There was an error downloading your postcard: ' + error.message
        });
      }
    };
    
    downloadPostcardImages();
  };

  // Front side tabs content
  const getTabContent = () => {
    switch (activeTab) {
      case 'text':
  return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Add Your Message</h3>
            <textarea
              value={message}
              onChange={handleMessageChange}
              maxLength={fixedCharLimit}
              className="w-full h-40 p-3 border rounded resize-none"
              placeholder="Write your message here..."
              style={{
                fontSize: `${fontSize * 0.67}px`,
                lineHeight: '1.5',
                fontFamily: selectedFont
              }}
            ></textarea>
            <div className={`text-sm mt-2 ${remainingChars <= 50 ? 'text-red-500' : 'text-gray-500'}`}>
              {remainingChars} characters remaining
            </div>
          </div>
        );
      case 'font':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Choose Font Style</h3>
            <RangeSlider 
              label="Font Size" 
              min={16} 
              max={36} 
              step={2} 
              value={fontSize} 
              onChange={setFontSize} 
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              {fontOptions.map((font) => (
                <button
                  key={font.value}
                  className={`p-3 text-center border rounded ${selectedFont === font.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                  style={{ fontFamily: font.value }}
                  onClick={() => setSelectedFont(font.value)}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>
        );
      case 'stickers':
        return frontStickerPickerUI;
      default:
        return null;
    }
  };

  // Back side tabs content
  const getBackTabContent = () => {
    switch (activeBackTab) {
      case 'message':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Add Your Message</h3>
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
              }`}
              maxLength={600} // Fixed character limit
            ></textarea>
            <div className={`text-sm mt-2 ${message.length >= 550 ? 'text-red-500' : 'text-gray-500'}`}>
              {message.length} / 600 characters
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Add Recipient Address</h3>
            <textarea
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full h-40 p-3 border rounded resize-none"
              placeholder="Recipient address..."
            ></textarea>
          </div>
        );
      case 'stickers':
        return backStickerPickerUI;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#222222] text-white py-4 px-6 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-3xl font-light italic font-['PP_Editorial_New'] mx-auto">Postcards</h1>
        <div className="flex items-center gap-4 absolute right-6">
          <button className="flex items-center gap-1 hover:text-gray-300">
            <ChatCircle size={24} weight="fill" />
            <span className="hidden md:inline">Give feedback</span>
          </button>
          <button className="flex items-center gap-1 hover:text-gray-300">
            <Question size={24} weight="fill" />
            <span className="hidden md:inline">About Postcards.my</span>
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-72px)]">
        {/* Left Panel - Controls */}
        <div className="w-full lg:w-[500px] order-2 lg:order-1 bg-white p-6 lg:h-auto lg:sticky lg:top-[72px] overflow-visible pb-32 lg:pb-6">
          {/* Only show on desktop - Back button removed */}
          <div className="mb-6">
            <h1 className="text-3xl font-medium text-[#222222] font-['PP_Editorial_New']">
              {currentStep === 1 ? 'Customize your postcard' : 
               currentStep === 2 ? 'Write your message' : 
               'Preview & Download'}
            </h1>
          </div>

          {/* Remove Mobile stepper */}

            {currentStep === 1 && (
              <>
              <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Picture Selection */}
                {activeTab === 'picture' && (
                <div className="mt-6">
                  <h2 className="text-lg font-medium mb-4">Select a picture</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Upload Image Button */}
                    <button
                      className={`aspect-[4/3] rounded-lg border-2 overflow-hidden relative ${
                        !uploadedImage ? 'border-gray-300' : 
                        selectedImage?.id === 'uploaded' ? 'border-blue-500' : 'border-gray-300'
                      }`}
                      onClick={() => {
                        if (uploadedImage) {
                          setSelectedImage(uploadedImage);
                        } else {
                          document.getElementById('image-upload-input').click();
                        }
                      }}
                    >
                      {uploadedImage ? (
                        <>
                          <div className="relative w-full h-full">
                            <Image
                              src={uploadedImage.src}
                              alt={uploadedImage.alt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 200px) 100vw, 200px"
                            />
                            <div 
                              className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById('image-upload-input').click();
                              }}
                            >
                              <Upload size={14} />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-[#FFFBF2]">
                          <Upload size={24} className="mb-2" />
                          <span className="text-xs text-center">Upload image</span>
                        </div>
                      )}
                    </button>
                    
                    {/* Hidden file input */}
                        <input
                      id="image-upload-input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    {/* Sample Images */}
                      {sampleImages.map((image) => (
                        <button
                          key={image.id}
                          className={`aspect-[4/3] rounded-lg border-2 overflow-hidden ${
                            selectedImage?.src === image.src 
                              ? 'border-blue-500' 
                            : 'border-gray-300'
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
              {activeTab === 'stickers' && frontStickerPickerUI}
              </>
            )}

            {currentStep === 2 && (
              <div>
              <Tabs tabs={backTabs} activeTab={activeBackTab} onTabChange={handleBackTabChange} />
              
              {activeBackTab === 'message' && (
                <>
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
                      className="w-full p-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
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
                        textOverflow ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-black focus:ring-1 focus:ring-black'
                      }`}
                      maxLength={600} // Fixed character limit
                    ></textarea>
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
                </>
              )}
              
              {activeBackTab === 'stamp' && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-3">Choose a Stamp</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Placeholder for stamp options */}
                    <button className="aspect-square border border-gray-300 rounded-lg hover:border-blue-500 flex items-center justify-center bg-white">
                      <div className="text-gray-400">Stamp 1</div>
                    </button>
                    <button className="aspect-square border border-gray-300 rounded-lg hover:border-blue-500 flex items-center justify-center bg-white">
                      <div className="text-gray-400">Stamp 2</div>
                    </button>
                    <button className="aspect-square border border-gray-300 rounded-lg hover:border-blue-500 flex items-center justify-center bg-white">
                      <div className="text-gray-400">Stamp 3</div>
                    </button>
                    <button className="aspect-square border border-gray-300 rounded-lg hover:border-blue-500 flex items-center justify-center bg-white">
                      <div className="text-gray-400">Stamp 4</div>
                    </button>
                  </div>
                </div>
              )}
              
              {activeBackTab === 'stickers' && backStickerPickerUI}
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Download Format</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="downloadFormat" 
                        value="separate" 
                        checked={downloadFormat === 'separate'}
                        onChange={() => setDownloadFormat('separate')}
                        className="w-4 h-4 text-black focus:ring-black"
                      />
                      <div>
                        <div className="font-medium">Separate Images</div>
                        <div className="text-sm text-gray-500">Download front and back as separate postcard-sized images</div>
              </div>
                    </label>
                    
                    <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="downloadFormat" 
                        value="a4" 
                        checked={downloadFormat === 'a4'}
                        onChange={() => setDownloadFormat('a4')}
                        className="w-4 h-4 text-black focus:ring-black"
                      />
                      <div>
                        <div className="font-medium">A4 Print Layout</div>
                        <div className="text-sm text-gray-500">Download both sides on a single A4 page for easy printing</div>
                      </div>
                    </label>
                  </div>
                </div>
                
                <button 
                  className="w-full py-3 px-4 rounded-lg bg-black text-white hover:bg-black/90 flex items-center justify-center gap-2"
                  onClick={handleDownloadPostcard}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Preparing Download...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v56H208V152a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,132.69V40a8,8,0,0,0-16,0v92.69L93.66,106.34a8,8,0,0,0-11.32,11.32Z"></path>
                      </svg>
                      <span>Download Postcard</span>
                    </>
                  )}
                </button>
                
                <div className="flex gap-2">
                <button 
                  className="flex-1 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
                    onClick={() => handleStepChange(2)}
                >
                    Edit Back
                </button>
                  <button 
                    className="flex-1 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
                    onClick={() => handleStepChange(1)}
                  >
                    Edit Front
                  </button>
                </div>
              </div>

              {/* Download status notification */}
              {downloadStatus && (
                <div className={`mt-4 p-3 rounded-lg ${
                  downloadStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {downloadStatus.type === 'success' ? (
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">{downloadStatus.message}</p>
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          onClick={() => setDownloadStatus(null)}
                          className={`inline-flex rounded-md p-1.5 ${
                            downloadStatus.type === 'success' ? 'text-green-500 hover:bg-green-200' : 'text-red-500 hover:bg-red-200'
                          }`}
                        >
                          <span className="sr-only">Dismiss</span>
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons - Only show on desktop */}
              {currentStep < 3 && (
            <div className="mt-8 hidden lg:block">
                <button 
                  onClick={() => handleStepChange(currentStep + 1)}
                className="w-full py-3 px-4 rounded-lg bg-black text-white hover:bg-black/90"
              >
                {currentStep === 1 ? 'Next - Edit back page' : 'Next - Preview & Download'}
              </button>
              
              {currentStep > 1 && (
                <button 
                  onClick={() => handleStepChange(currentStep - 1)}
                  className="w-full mt-3 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Back to front page
                </button>
              )}
          </div>
        )}
        </div>

        {/* Right Panel - Postcard Preview */}
        <div id="postcard-preview" className="w-full lg:flex-1 flex items-center lg:items-start justify-center order-1 lg:order-2 p-4 md:p-8 bg-[#FFDA7B] h-auto lg:min-h-[calc(100vh-72px)] lg:overflow-y-auto">
          <div className="relative w-full max-w-[800px] mx-auto">
            {currentStep === 3 ? (
              // Preview mode - show both sides
              <div className="flex flex-col space-y-8 lg:space-y-16 md:pb-12">
                {/* Mobile view - horizontal scrolling */}
                <div className="md:hidden w-full">
                  <div className="flex flex-nowrap space-x-8 overflow-x-auto pb-4 w-full" style={{WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none', overflowY: 'hidden'}}>
                    <div className="w-[300px] shrink-0">
                      <div className="w-full aspect-[879/591] bg-white relative shadow-lg rounded-lg overflow-hidden preview-front-container" id="front-postcard-container">
                        <div className="w-full h-full p-4 box-border">
                          <img
                            src={selectedImage?.src || defaultImage.src}
                            alt={selectedImage?.alt || defaultImage.alt}
                            className="w-full h-full object-cover pointer-events-none"
                            crossOrigin="anonymous"
                          />
                        </div>
                        <div className="absolute inset-0 p-4">
                          <canvas
                            width="879"
                            height="591"
                            className="w-full h-full absolute inset-0 pointer-events-none"
                          ></canvas>
                          {frontCanvasElements}
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-[300px] shrink-0">
                      <div className="w-full aspect-[879/591] bg-white relative shadow-lg rounded-lg overflow-hidden preview-back-container">
                        <canvas
                          ref={staticCanvasRef}
                          width="879"
                          height="591"
                          className="w-full h-full"
                        ></canvas>
                        <div className="absolute inset-0">
                          <canvas
                            ref={backCanvasRef}
                            width="879"
                            height="591"
                            className="w-full h-full absolute inset-0 pointer-events-none"
                          ></canvas>
                          {backCanvasElements}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop view - vertical stacking */}
                <div className="hidden md:flex md:flex-col md:space-y-16 md:overflow-y-auto">
                  <div className="w-full aspect-[879/591]">
                    <div className="w-full h-full bg-white relative shadow-lg rounded-lg overflow-hidden preview-front-container" id="front-postcard-container">
                      <div className="w-full h-full p-4 box-border">
                        <img
                          src={selectedImage?.src || defaultImage.src}
                          alt={selectedImage?.alt || defaultImage.alt}
                          className="w-full h-full object-cover pointer-events-none"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="absolute inset-0 p-4">
                        <canvas
                          width="879"
                          height="591"
                          className="w-full h-full absolute inset-0 pointer-events-none"
                        ></canvas>
                        {frontCanvasElements}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full aspect-[879/591]">
                    <div className="w-full h-full bg-white relative shadow-lg rounded-lg overflow-hidden preview-back-container">
                      <canvas
                        ref={staticCanvasRef}
                        width="879"
                        height="591"
                        className="w-full h-full"
                      ></canvas>
                      <div className="absolute inset-0">
                        <canvas
                          ref={backCanvasRef}
                          width="879"
                          height="591"
                          className="w-full h-full absolute inset-0 pointer-events-none"
                        ></canvas>
                        {backCanvasElements}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Normal editing mode - steps 1 and 2
              <div className="w-full aspect-[879/591]">
                {currentStep === 1 ? (
                  // Front Side
                  <div 
                    className="w-full h-full bg-white relative shadow-lg rounded-lg overflow-hidden"
                    id="front-edit-container"
                  >
                    <div className="w-full h-full p-4 box-border">
                      <img
                        src={selectedImage?.src || defaultImage.src}
                        alt={selectedImage?.alt || defaultImage.alt}
                        className="w-full h-full object-cover pointer-events-none"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div 
                      className="absolute inset-0 p-4"
                      onClick={isFrontPasteMode ? handleFrontCanvasClick : undefined}
                      key="front-sticker-container"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <canvas
                        ref={frontCanvasRef}
                        width="879"
                        height="591"
                        className="w-full h-full absolute inset-0 pointer-events-none"
                      ></canvas>
                      {frontCanvasElements}
                    </div>
                  </div>
                ) : (
                  // Back Side
                  <div 
                    className="w-full h-full bg-white relative shadow-lg rounded-lg overflow-hidden"
                  >
                    <div className="w-full h-full relative">
                      <canvas
                        ref={staticCanvasRef}
                        width="879"
                        height="591"
                        className="w-full h-full"
                      ></canvas>
                      <div 
                        className="absolute inset-0"
                        onClick={isBackPasteMode ? handleBackCanvasClick : undefined}
                        key="back-sticker-container"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <canvas
                          ref={backCanvasRef}
                          width="879"
                          height="591"
                          className="w-full h-full absolute inset-0 pointer-events-none"
                        ></canvas>
                        {backCanvasElements}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation - Fixed at bottom */}
        {currentStep < 3 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 lg:hidden z-20">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button 
                  onClick={() => handleStepChange(currentStep - 1)}
                  className="flex-1 py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Back to front page
                </button>
              )}
              <button 
                onClick={() => handleStepChange(currentStep + 1)}
                className={`${currentStep > 1 ? 'flex-1' : 'w-full'} py-3 px-4 rounded-lg bg-black text-white hover:bg-black/90`}
              >
                {currentStep === 1 ? 'Next - Edit back page' : 'Next - Preview & Download'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 