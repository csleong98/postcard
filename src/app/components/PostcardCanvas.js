import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash } from '@phosphor-icons/react'

const createStickerStyle = (isDragging = false) => ({
  filter: `
    drop-shadow(0 0 1.1px white) 
    drop-shadow(0 0 1.1px white) 
    drop-shadow(0 0 1.1px white)
    drop-shadow(0 0 1.1px white)
    drop-shadow(0 0 1.1px white)
    ${isDragging ? 'drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25))' : 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))'}
  `
});

const FloatingActionButton = ({ x, y, onClick }) => (
  <motion.div
    initial={{ scale: 0, x: 0, y: 0 }}
    animate={{ 
      scale: 1, 
      x: 60,
      y: -10,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }}
    exit={{ scale: 0, transition: { duration: 0.2 } }}
    style={{ 
      position: 'absolute',
      left: x,
      top: y,
      originX: 0,
      originY: 0.5,
      zIndex: 2000,
    }}
  >
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 bg-white text-red-500 rounded-full shadow-lg hover:bg-gray-50 
        flex items-center justify-center border border-gray-200"
      onClick={onClick}
    >
      <Trash size={16} strokeWidth={2.5} />
    </motion.button>
  </motion.div>
);

const DraggableSticker = ({ sticker, onDragStart, onSelect, isSelected }) => {
  const stickerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    if (e.button === 0) {
      onSelect(sticker.id);
    } else {
      const rect = stickerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      onDragStart(sticker.id, { x: offsetX, y: offsetY });
    }
  };

  return (
    <div
      ref={stickerRef}
      onMouseDown={handleMouseDown}
      className="absolute select-none cursor-pointer"
      style={{
        left: `${sticker.position.x}px`,
        top: `${sticker.position.y}px`,
        transform: `rotate(${sticker.rotation || 0}deg)`,
        zIndex: isSelected ? 1000 : 1,
      }}
    >
      <span 
        className="text-6xl inline-block"
        style={createStickerStyle(sticker.isDragging)}
      >
        {sticker.emoji}
      </span>
    </div>
  );
};

export function PostcardCanvas({ isPasteMode, onPasteMode }) {
  const [stickers, setStickers] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [dragState, setDragState] = useState(null);
  const canvasRef = useRef(null);

  const handleCanvasClick = (e) => {
    if (!canvasRef.current?.contains(e.target)) return;
    if (e.target !== canvasRef.current) return;
    
    if (isPasteMode) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const stickerSize = 48;
      const newX = e.clientX - canvasRect.left - (stickerSize / 2);
      const newY = e.clientY - canvasRect.top - (stickerSize / 2);
      const randomRotation = Math.random() * 32 - 16;

      const newSticker = {
        id: nextId,
        emoji: isPasteMode.emoji,
        position: { x: newX, y: newY },
        rotation: randomRotation,
        isDragging: false
      };

      setStickers(prev => [...prev, newSticker]);
      setNextId(prev => prev + 1);
    } else if (e.target === canvasRef.current) {
      setSelectedSticker(null);
    }
  };

  const handleDeleteSticker = (stickerId) => {
    setStickers(prev => prev.filter(sticker => sticker.id !== stickerId));
    setSelectedSticker(null);
  };

  const selectedStickerData = stickers.find(s => s.id === selectedSticker);

  return (
    <div 
      ref={canvasRef}
      className="w-full h-full relative"
      onClick={handleCanvasClick}
      style={{ cursor: isPasteMode ? 'crosshair' : 'default' }}
    >
      {stickers.map(sticker => (
        <DraggableSticker
          key={sticker.id}
          sticker={sticker}
          onDragStart={(id, offset) => setDragState({ stickerId: id, offset })}
          onSelect={setSelectedSticker}
          isSelected={sticker.id === selectedSticker}
        />
      ))}
      
      <AnimatePresence>
        {selectedStickerData && (
          <FloatingActionButton
            x={selectedStickerData.position.x}
            y={selectedStickerData.position.y}
            onClick={() => handleDeleteSticker(selectedStickerData.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 