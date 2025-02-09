'use client'

import { useState, useRef } from 'react'
import Image from "next/image"
import Link from "next/link"
import { Eye } from "@phosphor-icons/react"
import { Tabs } from '../components/common/Tabs'
import { StickersTab } from '../components/stickers'

const tabs = [
  { id: 'picture', label: 'Picture' },
  { id: 'stickers', label: 'Stickers' },
  { id: 'draw', label: 'Draw' }
]

const sampleImages = [
  { id: 'empty', src: '', alt: 'No picture' },
  { id: 'pattern1', src: '/images/patterns/pattern1.jpg', alt: 'Red pattern' },
  { id: 'pattern2', src: '/images/patterns/pattern2.jpg', alt: 'Gold pattern' },
]

export default function TestPage() {
  const [activeTab, setActiveTab] = useState('picture')
  const [selectedImage, setSelectedImage] = useState('')
  const canvasRef = useRef(null)
  
  const { stickerPickerUI, canvasElements, handleCanvasClick, isPasteMode } = StickersTab({ canvasRef })

  return (
    <div className="min-h-screen bg-[#FDF6EC] p-4">
      <div className="max-w-screen-xl mx-auto flex gap-8">
        {/* Left Panel */}
        <div className="w-[400px]">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black/5 mb-6">
            <span>←</span>
            <span>Back</span>
          </Link>

          <h1 className="text-[32px] font-serif mb-6">Customize your postcard</h1>

          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Picture Selection */}
          {activeTab === 'picture' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2>Select a picture</h2>
                <button className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                  Upload picture
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((image) => (
                  <button
                    key={image.id}
                    className={`aspect-[4/3] rounded-lg border-2 overflow-hidden ${
                      selectedImage === image.id 
                        ? 'border-blue-500' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(image.id)}
                  >
                    {image.src ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={200}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center text-sm text-gray-500">
                        No picture
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stickers Selection */}
          {activeTab === 'stickers' && stickerPickerUI}

          {/* Preview Button */}
          <button className="w-full mt-8 flex items-center justify-center gap-2 bg-black text-white rounded-lg py-3 px-4 hover:bg-black/90">
            <Eye size={20} />
            Preview and download
          </button>
        </div>

        {/* Right Panel - Postcard Preview */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div 
              ref={canvasRef}
              className="w-[800px] aspect-[3/2] bg-white rounded-lg shadow-lg overflow-hidden relative"
              onClick={handleCanvasClick}
              style={{ cursor: isPasteMode ? 'crosshair' : 'default' }}
            >
              {canvasElements}
            </div>

            {/* View Controls */}
            <div className="absolute bottom-[-48px] left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2 bg-white rounded-full shadow-sm p-1">
                <button className="px-4 py-1.5 rounded-full bg-black text-white">Front</button>
                <button className="px-4 py-1.5 rounded-full hover:bg-gray-100">Back</button>
                <button className="px-4 py-1.5 rounded-full hover:bg-gray-100">With background</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 