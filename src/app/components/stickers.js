'use client'

import React, { useState, useEffect, useRef } from 'react'
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

export function StickersTab({ canvasRef, initialStickers = [], onStickersChange, stickerIdPrefix = 'sticker' }) {
  const [pasteMode, setPasteMode] = useState(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [stickers, setStickers] = useState(initialStickers)
  const [nextId, setNextId] = useState(initialStickers.length > 0 ? Math.max(...initialStickers.map(s => s.id)) + 1 : 1)
  const [selectedSticker, setSelectedSticker] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })
  const [stickerStartPos, setStickerStartPos] = useState({ x: 0, y: 0 })

  // Update parent component when stickers change
  useEffect(() => {
    if (onStickersChange) {
      onStickersChange(stickers);
    }
  }, [stickers, onStickersChange]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (pasteMode) {
        setCursorPosition({ x: e.clientX, y: e.clientY })
      } else if (isDragging && selectedSticker) {
        // Calculate the delta from the drag start position
        const deltaX = e.clientX - dragStartPos.x
        const deltaY = e.clientY - dragStartPos.y
        
        // Apply the delta to the original sticker position
        const newX = stickerStartPos.x + deltaX
        const newY = stickerStartPos.y + deltaY
        
        setStickers(prev => prev.map(s => 
          s.id === selectedSticker 
            ? { ...s, position: { x: newX, y: newY }, isDragging: true }
            : s
        ))
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        // Reset isDragging flag on stickers
        setStickers(prev => prev.map(s => 
          s.id === selectedSticker 
            ? { ...s, isDragging: false }
            : s
        ))
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (pasteMode) {
          setPasteMode(null)
        } else if (selectedSticker) {
          setSelectedSticker(null)
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [pasteMode, isDragging, selectedSticker, dragStartPos, stickerStartPos])

  const handleCanvasClick = (e) => {
    if (pasteMode) {
      const canvasRect = e.currentTarget.getBoundingClientRect()
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
    } else {
      // Only deselect if clicking on the canvas (not on a sticker)
      setSelectedSticker(null)
    }
  }

  const handleStickerMouseDown = (e, stickerId) => {
    e.stopPropagation()
    
    const sticker = stickers.find(s => s.id === stickerId)
    if (sticker) {
      // Save the initial mouse position when starting to drag
      setDragStartPos({ x: e.clientX, y: e.clientY })
      
      // Save the initial sticker position
      setStickerStartPos({ ...sticker.position })
      
      // Set the selected sticker and start dragging
      setSelectedSticker(stickerId)
      setIsDragging(true)
    }
  }

  const handleDeleteSticker = (stickerId) => {
    setStickers(prev => prev.filter(sticker => sticker.id !== stickerId))
    setSelectedSticker(null)
  }

  // Add a function to reset paste mode
  const resetPasteMode = () => {
    setPasteMode(null)
    // Don't reset selectedSticker here to maintain selection when switching tabs
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
            className="absolute select-none cursor-move"
            data-sticker={`${stickerIdPrefix}-${sticker.id}`}
            style={{
              left: `${sticker.position.x}px`,
              top: `${sticker.position.y}px`,
              transform: `rotate(${sticker.rotation || 0}deg)`,
              zIndex: sticker.id === selectedSticker ? 1000 : 1,
              pointerEvents: 'auto' // Ensure stickers are always interactive
            }}
            onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}
            onClick={(e) => e.stopPropagation()}
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
                pointerEvents: 'auto' // Ensure delete button is always interactive
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteSticker(selectedSticker)
              }}
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
    isPasteMode: !!pasteMode,
    resetPasteMode,
    stickers, // Expose stickers array
    setSelectedSticker // Expose function to select stickers
  }
}