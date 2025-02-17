'use client'

import { useState, useRef, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { Eye, Upload } from "@phosphor-icons/react"
import { Tabs } from '../components/common/Tabs'
import { Stepper } from '../components/common/Stepper'
import { StickersTab } from '../components/stickers'

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

export default function TestPage() {
  const [activeTab, setActiveTab] = useState('picture')
  const [selectedImage, setSelectedImage] = useState(defaultImage)
  const [currentStep, setCurrentStep] = useState(1)
  const [isFlipped, setIsFlipped] = useState(false)
  const canvasRef = useRef(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  
  const { stickerPickerUI, canvasElements, handleCanvasClick, isPasteMode } = StickersTab({ canvasRef })

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId)
    setIsFlipped(stepId === 2)
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
                {/* Add your message writing interface here */}
                <textarea 
                  className="w-full h-48 p-4 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="Write your message here..."
                />
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
            <div 
              ref={canvasRef}
              className={`w-full aspect-[3/2] bg-white rounded-lg shadow-lg overflow-hidden relative transition-transform duration-700 preserve-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={handleCanvasClick}
              style={{ cursor: isPasteMode ? 'crosshair' : 'default' }}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden">
                {/* Background Image Container */}
                <div className="w-full h-full bg-white shadow-md relative overflow-hidden">
                  <img
                    src={selectedImage?.src || defaultImage.src}
                    alt={selectedImage?.alt || defaultImage.alt}
                    className="w-full h-full object-cover p-4 box-border pointer-events-none"
                  />
                  {/* Stickers Layer */}
                  <div className="absolute inset-0 p-4">
                    {canvasElements}
                  </div>
                </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <div className="w-full h-full bg-white shadow-md relative overflow-hidden">
                  {/* Back content goes here */}
                </div>
              </div>
            </div>

            {/* View Controls - Only show in preview step */}
            {currentStep === 3 && (
              <div className="absolute bottom-[-48px] left-1/2 transform -translate-x-1/2">
                <div className="inline-flex items-center p-1 rounded-2xl border border-[#E4E4E4] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.10)] transition-all duration-300 ease-in-out">
                  <button 
                    onClick={() => setIsFlipped(false)}
                    className={`px-6 py-2 text-[#2F2F2F] rounded-lg transition-all flex items-center justify-center gap-2 relative z-10 min-w-[80px] ${
                      !isFlipped ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    Front
                  </button>
                  <button 
                    onClick={() => setIsFlipped(true)}
                    className={`px-6 py-2 text-[#2F2F2F] rounded-lg transition-all flex items-center justify-center gap-2 relative z-10 min-w-[80px] ${
                      isFlipped ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 