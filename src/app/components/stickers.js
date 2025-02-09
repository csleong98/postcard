'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash } from '@phosphor-icons/react'

const STICKER_TEMPLATES = [
  { id: 'torii', emoji: '⛩️' },
  { id: 'icecream', emoji: '🍨' },
  { id: 'drool', emoji: '🤤' },
  { id: 'kiss', emoji: '😘' },
  { id: 'smile', emoji: '😊' },
  { id: 'heart', emoji: '❤️' },
  { id: 'laugh', emoji: '😄' },
  { id: 'bridge', emoji: '🌉' },
  { id: 'hearts', emoji: '😍' },
  { id: 'shaka', emoji: '🤙' },
  { id: 'compass', emoji: '🧭' },
]

const createStickerStyle = (isDragging = false) => ({
  filter: `
    drop-shadow(0 0 1.1px white) 
    drop-shadow(0 0 1.1px white) 
    drop-shadow(0 0 1.1px white)
    drop-shadow(0 0 1.1px white)
    drop-shadow(0 0 1.1px white)
    ${isDragging ? 'drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25))' : 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))'}
  `
})

export function StickersTab({ canvasRef }) {
  const [pasteMode, setPasteMode] = useState(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [stickers, setStickers] = useState([])
  const [nextId, setNextId] = useState(1)
  const [selectedSticker, setSelectedSticker] = useState(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (pasteMode) {
        setCursorPosition({ x: e.clientX, y: e.clientY })
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && pasteMode) {
        setPasteMode(null)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [pasteMode])

  const handleCanvasClick = (e) => {
    if (!canvasRef.current?.contains(e.target)) return
    if (e.target !== canvasRef.current) return
    
    if (pasteMode) {
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const stickerSize = 56
      const newX = e.clientX - canvasRect.left - (stickerSize / 2)
      const newY = e.clientY - canvasRect.top - (stickerSize / 2)
      const randomRotation = Math.random() * 32 - 16

      const newSticker = {
        id: nextId,
        emoji: pasteMode.emoji,
        position: { x: newX, y: newY },
        rotation: randomRotation,
        isDragging: false
      }

      setStickers(prev => [...prev, newSticker])
      setNextId(prev => prev + 1)
    } else if (e.target === canvasRef.current) {
      setSelectedSticker(null)
    }
  }

  const handleDeleteSticker = (stickerId) => {
    setStickers(prev => prev.filter(sticker => sticker.id !== stickerId))
    setSelectedSticker(null)
  }

  return {
    stickerPickerUI: (
      <div>
        <h2 className="mb-4">Select a sticker to paste on your postcard</h2>
        <div className="grid grid-cols-4 gap-2">
          {STICKER_TEMPLATES.map((sticker) => (
            <button
              key={sticker.id}
              className="p-2 rounded-lg hover:bg-black/5 aspect-square flex items-center justify-center"
              onClick={() => setPasteMode(sticker)}
            >
              <span 
                className="text-3xl select-none transform transition-transform duration-200 hover:scale-110"
                style={createStickerStyle(false)}
              >
                {sticker.emoji}
              </span>
            </button>
          ))}
        </div>
      </div>
    ),
    canvasElements: (
      <>
        {/* Canvas Stickers */}
        {stickers.map(sticker => (
          <div
            key={sticker.id}
            className="absolute select-none cursor-pointer"
            style={{
              left: `${sticker.position.x}px`,
              top: `${sticker.position.y}px`,
              transform: `rotate(${sticker.rotation || 0}deg)`,
              zIndex: sticker.id === selectedSticker ? 1000 : 1,
            }}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedSticker(sticker.id)
            }}
          >
            <span 
              className="text-6xl inline-block"
              style={createStickerStyle(sticker.isDragging)}
            >
              {sticker.emoji}
            </span>
          </div>
        ))}

        {/* Delete Button */}
        <AnimatePresence>
          {selectedSticker && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute p-2 bg-white text-red-500 rounded-full shadow-lg hover:bg-gray-50 
                flex items-center justify-center border border-gray-200"
              style={{ 
                left: stickers.find(s => s.id === selectedSticker)?.position.x + 60,
                top: stickers.find(s => s.id === selectedSticker)?.position.y - 10,
                zIndex: 2000,
              }}
              onClick={() => handleDeleteSticker(selectedSticker)}
            >
              <Trash size={16} strokeWidth={2.5} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Cursor Sticker */}
        {pasteMode && (
          <div 
            className="fixed pointer-events-none select-none"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 2000,
            }}
          >
            <span 
              className="text-6xl opacity-70"
              style={createStickerStyle(true)}
            >
              {pasteMode.emoji}
            </span>
          </div>
        )}
      </>
    ),
    handleCanvasClick,
    isPasteMode: !!pasteMode
  }
}