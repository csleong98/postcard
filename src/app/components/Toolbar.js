import React, { useEffect, useRef } from 'react';
import IconButton from './IconButton';
import { 
  Pencil, 
  PencilLine, 
  Eraser, 
  ArrowClockwise, 
  UploadSimple,
  DownloadSimple,
  ArrowsCounterClockwise
} from "@phosphor-icons/react";

const Separator = () => (
  <div className="w-[1px] h-8 bg-[#E4E4E4]" />
);

const Toolbar = ({ 
  selectedTool,
  drawingColor,
  onToolSelect,
  onColorChange,
  onClear,
  onUpload,
  onDownload,
  onFlip
}) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const colorPickerRef = useRef(null);
  const toolbarRef = useRef(null);
  const colorPickerInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target) &&
          !toolbarRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close color picker when a different tool is selected
  useEffect(() => {
    setShowColorPicker(false);
  }, [selectedTool]);

  // Open color picker directly when button is clicked
  useEffect(() => {
    if (showColorPicker && colorPickerInputRef.current) {
      colorPickerInputRef.current.click();
    }
  }, [showColorPicker]);

  return (
    <div className="relative" ref={toolbarRef}>
      <div className="inline-flex items-center p-2.5 gap-4 rounded-2xl border border-[#E4E4E4] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.10)]">
        <IconButton
          icon={Pencil}
          isActive={selectedTool === 'pencil'}
          onClick={() => onToolSelect('pencil')}
        />
        <IconButton
          icon={PencilLine}
          isActive={selectedTool === 'marker'}
          onClick={() => onToolSelect('marker')}
        />
        <div ref={colorPickerRef} className="relative">
          <IconButton
            isColorIndicator
            color={drawingColor}
            isActive={showColorPicker}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          <input
            ref={colorPickerInputRef}
            type="color"
            value={drawingColor}
            onChange={(e) => {
              onColorChange(e.target.value);
            }}
            className="absolute opacity-0 w-px h-px"
            style={{ 
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: showColorPicker ? 'auto' : 'none'
            }}
          />
        </div>
        <IconButton
          icon={Eraser}
          isActive={selectedTool === 'eraser'}
          onClick={() => onToolSelect('eraser')}
        />
        <IconButton
          icon={ArrowClockwise}
          onClick={onClear}
        />
        <IconButton
          icon={UploadSimple}
          onClick={onUpload}
        />
        <Separator />
        <IconButton
          icon={DownloadSimple}
          onClick={onDownload}
        />
        <IconButton
          icon={ArrowsCounterClockwise}
          onClick={onFlip}
        />
      </div>
    </div>
  );
};

export default Toolbar; 