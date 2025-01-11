'use client'

import React, { useState, useRef, useEffect } from 'react';

export default function PostcardCustomizer() {
  // Existing state
  const [currentSide, setCurrentSide] = useState('front');
  const [uploadedImage, setUploadedImage] = useState('/images/default-image.png');
  const [selectedTool, setSelectedTool] = useState(null);
  const canvasRef = useRef(null);
  const staticCanvasRef = useRef(null);
  const isDrawing = useRef(false);
  const containerRef = useRef(null);

  // Enhanced textbox state
  const [textboxes, setTextboxes] = useState([]);
  const [selectedTextbox, setSelectedTextbox] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [addingTextbox, setAddingTextbox] = useState(false);

  // Constants for canvas boundaries
  const CANVAS_PADDING = 36; // equivalent to inset-9
  const MIN_BOX_SIZE = 50;

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
    if (selectedTool && currentSide === 'back') {
      isDrawing.current = true;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e) => {
    if (!isDrawing.current || currentSide !== 'back' || !selectedTool) return;
    const canvas = canvasRef.current;
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
      ctx.strokeStyle = selectedTool === 'pencil' ? '#000000' : 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = selectedTool === 'pencil' ? 2 : 8;
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.closePath();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Function to ensure position is within bounds
  const keepInBounds = (x, y, width, height) => {
    const maxX = 879 - CANVAS_PADDING - width;
    const maxY = 591 - CANVAS_PADDING - height;
    const minX = CANVAS_PADDING;
    const minY = CANVAS_PADDING;

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY)
    };
  };

  // Handle textbox button click
  const handleTextboxButtonClick = () => {
    setSelectedTool('textbox');
    setAddingTextbox(true);
  };

  // Handle canvas click for textbox placement
  const handleCanvasClick = (e) => {
    if (addingTextbox && selectedTool === 'textbox') {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const boundedPosition = keepInBounds(x, y, 200, 100);

      const newBox = {
        id: Date.now(),
        ...boundedPosition,
        width: 200,
        height: 100,
        text: 'Enter text here...',
      };

      setTextboxes([...textboxes, newBox]);
      setSelectedTextbox(newBox.id);
      setAddingTextbox(false);
    }
  };

  // Handle textbox selection and drag start
  const handleTextboxMouseDown = (e, boxId, resizeHandle = null) => {
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();

    if (resizeHandle) {
      setIsResizing(true);
      setResizeDirection(resizeHandle);
    } else {
      setIsDragging(true);
    }

    setSelectedTextbox(boxId);
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Handle mouse move for drag and resize
  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;

    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const deltaX = currentX - dragStart.x;
    const deltaY = currentY - dragStart.y;

    setTextboxes(boxes => boxes.map(box => {
      if (box.id === selectedTextbox) {
        if (isDragging) {
          const newPos = keepInBounds(
            box.x + deltaX,
            box.y + deltaY,
            box.width,
            box.height
          );
          return { ...box, ...newPos };
        }

        if (isResizing) {
          let newWidth = box.width;
          let newHeight = box.height;
          let newX = box.x;
          let newY = box.y;

          switch (resizeDirection) {
            case 'se':
              newWidth = Math.max(MIN_BOX_SIZE, box.width + deltaX);
              newHeight = Math.max(MIN_BOX_SIZE, box.height + deltaY);
              break;
            case 'sw':
              newWidth = Math.max(MIN_BOX_SIZE, box.width - deltaX);
              newHeight = Math.max(MIN_BOX_SIZE, box.height + deltaY);
              newX = box.x + deltaX;
              break;
            case 'ne':
              newWidth = Math.max(MIN_BOX_SIZE, box.width + deltaX);
              newHeight = Math.max(MIN_BOX_SIZE, box.height - deltaY);
              newY = box.y + deltaY;
              break;
            case 'nw':
              newWidth = Math.max(MIN_BOX_SIZE, box.width - deltaX);
              newHeight = Math.max(MIN_BOX_SIZE, box.height - deltaY);
              newX = box.x + deltaX;
              newY = box.y + deltaY;
              break;
          }

          const boundedPosition = keepInBounds(newX, newY, newWidth, newHeight);
          return {
            ...box,
            ...boundedPosition,
            width: newWidth,
            height: newHeight
          };
        }
      }
      return box;
    }));

    setDragStart({ x: currentX, y: currentY });
  };

  // Handle mouse up to stop drag/resize
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, selectedTextbox]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Title */}
      <h1 className="text-slate-900 text-4xl font-bold mb-8 text-center">
        Design your own postcard and send it to anyone!
      </h1>

      {/* Postcard Canvas */}
      <div className="relative w-[879.04px] h-[591.04px] perspective">
        <div
          className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d ${currentSide === 'back' ? 'rotate-y-180' : ''
            }`}
        >
          {/* Front Side */}
          <div className="absolute w-full h-full backface-hidden bg-white shadow-md flex items-center justify-center">
            <img
              src={uploadedImage}
              alt="Postcard Front"
              className="w-full h-full object-cover p-4 box-border"
            />

            <div className="absolute flex items-center justify-center">
              <button
                aria-label='Upload image'
                className="px-4 py-2 bg-gray-300 text-gray-900 font-bold rounded-md cursor-pointer flex items-center justify-center"
                onClick={() => document.getElementById('imageUpload').click()}
              >
                Upload image
              </button>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
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

            {/* Drawing canvas */}
            <canvas
              ref={canvasRef}
              width={879}
              height={591}
              className='absolute inset-9'
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            ></canvas>
            {/* Textbox container */}
            <div
              ref={containerRef}
              className={`absolute inset-9 overflow-hidden ${selectedTool === 'textbox' ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              onClick={handleCanvasClick}
            >
              {textboxes.map((box) => (
                <div
                  key={box.id}
                  className="absolute"
                  style={{
                    left: `${box.x}px`,
                    top: `${box.y}px`,
                    width: `${box.width}px`,
                    height: `${box.height}px`,
                  }}
                >
                  {/* Textbox content */}
                  <div
                    className={`relative w-full h-full border-2 ${selectedTextbox === box.id ? 'border-blue-500' : 'border-gray-300'
                      }`}
                    onMouseDown={(e) => handleTextboxMouseDown(e, box.id)}
                  >
                    <textarea
                      value={box.text}
                      onChange={(e) => {
                        const updatedBoxes = textboxes.map(b =>
                          b.id === box.id ? { ...b, text: e.target.value } : b
                        );
                        setTextboxes(updatedBoxes);
                      }}
                      className="w-full h-full p-2 resize-none text-gray-900 bg-transparent"
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Resize handles - only show when selected */}
                    {selectedTextbox === box.id && (
                      <>
                        {['nw', 'ne', 'sw', 'se'].map(handle => (
                          <div
                            key={handle}
                            className={`absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-${handle}-resize
                              ${handle.includes('n') ? 'top-0' : 'bottom-0'}
                              ${handle.includes('w') ? 'left-0' : 'right-0'}
                              -translate-x-1/2 -translate-y-1/2`}
                            onMouseDown={(e) => handleTextboxMouseDown(e, box.id, handle)}
                          />
                        ))}
                      </>
                    )}

                    {/* Delete button */}
                    {selectedTextbox === box.id && (
                      <button
                        className="absolute -top-8 right-0 p-1 bg-white rounded shadow hover:bg-gray-100"
                        onClick={() => {
                          setTextboxes(textboxes.filter(b => b.id !== box.id));
                          setSelectedTextbox(null);
                        }}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drawing Tools */}
      <div className="absolute top-1/2 right-8 flex flex-col gap-4 transform -translate-y-1/2">
        <button
          className={`p-4 bg-gray-300 rounded-full shadow-md ${selectedTool === 'pencil' ? 'ring-4 ring-blue-500' : ''}`}
          onClick={() => setSelectedTool('pencil')}
        >
          ✏️
        </button>
        <button
          className={`p-4 bg-gray-300 rounded-full shadow-md ${selectedTool === 'marker' ? 'ring-4 ring-blue-500' : ''}`}
          onClick={() => setSelectedTool('marker')}
        >
          🖊️
        </button>
        <button
          className={`p-4 bg-gray-300 rounded-full shadow-md ${selectedTool === 'eraser' ? 'ring-4 ring-blue-500' : ''}`}
          onClick={() => setSelectedTool('eraser')}
        >
          🩹
        </button>
        <button
          className="p-4 bg-red-500 text-white rounded-full shadow-md"
          onClick={clearCanvas}
        >
          🗑️
        </button>
        <button
          className={`p-4 bg-gray-300 rounded-full shadow-md ${selectedTool === 'textbox' ? 'ring-4 ring-blue-500' : ''}`}
          onClick={handleTextboxButtonClick}
        >
          📝
        </button>
      </div>

      {/* Flip Button */}
      <button
        onClick={handleFlip}
        className="mt-6 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Flip to {currentSide === 'front' ? 'Back' : 'Front'}
      </button>
    </div>
  );
}