import React, { useState, useRef, useEffect } from 'react';

export default function Textbox({ containerRef }) {
  const [textboxes, setTextboxes] = useState([]);
  const [selectedTextbox, setSelectedTextbox] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [addingTextbox, setAddingTextbox] = useState(false);

  // Constants
  const CANVAS_PADDING = 36;
  const MIN_BOX_SIZE = 50;

  // Keep position within bounds
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

  // Handle canvas click for textbox placement
  const handleCanvasClick = (e) => {
    if (addingTextbox) {
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
    <div
      className="absolute inset-9 overflow-hidden pointer-events-auto"
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
          <div
            className={`relative w-full h-full border-2 ${
              selectedTextbox === box.id ? 'border-blue-500' : 'border-gray-300'
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

                <button
                  className="absolute -top-8 right-0 p-1 bg-white rounded shadow hover:bg-gray-100"
                  onClick={() => {
                    setTextboxes(textboxes.filter(b => b.id !== box.id));
                    setSelectedTextbox(null);
                  }}
                >
                  ❌
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
