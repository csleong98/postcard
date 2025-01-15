import React, { useEffect, useRef } from 'react';
import IconButton from './IconButton';
import { 
  Pencil, 
  PencilLine, 
  Eraser, 
  ArrowClockwise, 
  UploadSimple,
  DownloadSimple,
  ArrowsCounterClockwise,
  CaretDown
} from "@phosphor-icons/react";

const Separator = () => (
  <div className="w-[1px] h-8 bg-[#E4E4E4]" />
);

/**
 * Toolbar Component
 * 
 * This is a contextual toolbar that changes based on which side of the postcard is showing.
 * Think of it like different toolbar states in design tools:
 * - Front side: Shows drawing tools (like Figma's drawing tools)
 * - Back side: Shows text formatting tools (like Figma's text properties)
 */
const Toolbar = (props) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [showFontDropdown, setShowFontDropdown] = React.useState(false);
  const colorPickerRef = useRef(null);
  const toolbarRef = useRef(null);
  const colorPickerInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // Don't close if clicking on the color picker dialog
      if (event.target.type === 'color') return;

      const clickedOutsideColorPicker = colorPickerRef.current && 
        !colorPickerRef.current.contains(event.target) &&
        !toolbarRef.current.contains(event.target);
      
      if (clickedOutsideColorPicker) {
        setShowColorPicker(false);
      }

      const clickedOutsideDropdown = dropdownRef.current && 
        !dropdownRef.current.contains(event.target);
      
      if (clickedOutsideDropdown) {
        setShowFontDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowColorPicker(false);
  }, [props.selectedTool]);

  useEffect(() => {
    if (showColorPicker && colorPickerInputRef.current) {
      colorPickerInputRef.current.click();
    }
  }, [showColorPicker]);

  const FontDropdown = () => (
    <div ref={dropdownRef} className="relative">
      <button 
        className="inline-flex items-center gap-2 px-4 py-2 w-[160px] rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setShowFontDropdown(!showFontDropdown)}
      >
        <span className="truncate text-gray-900" style={{ fontFamily: props.selectedFont }} title={props.selectedFont}>
          {props.selectedFont}
        </span>
        <CaretDown 
          size={16} 
          className={`transform transition-transform duration-200 ${showFontDropdown ? 'rotate-180' : ''} flex-shrink-0 ml-auto text-gray-900`}
          weight="bold"
        />
      </button>
      {showFontDropdown && (
        <div className="absolute bottom-full left-0 mb-2 w-[160px] bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 max-h-[200px] overflow-y-auto">
          {props.fontOptions.map((font) => (
            <button
              key={font.value}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 text-gray-900"
              style={{ fontFamily: font.value }}
              onClick={() => {
                props.onFontChange(font.value);
                setShowFontDropdown(false);
              }}
              title={font.name}
            >
              <span className="block truncate">{font.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderFrontTools = () => (
    <>
      <IconButton
        icon={Pencil}
        isActive={props.selectedTool === 'pencil'}
        onClick={() => props.onToolSelect('pencil')}
      />
      <IconButton
        icon={PencilLine}
        isActive={props.selectedTool === 'marker'}
        onClick={() => props.onToolSelect('marker')}
      />
      <div ref={colorPickerRef} className="relative">
        <IconButton
          isColorIndicator
          color={props.drawingColor}
          isActive={showColorPicker}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        <input
          ref={colorPickerInputRef}
          type="color"
          value={props.drawingColor}
          onChange={(e) => props.onColorChange(e.target.value)}
          className="absolute opacity-0 w-px h-px"
          style={{ 
            top: '-6px',
            left: '1%',
            right: '1%',
            transform: 'translateX(-50%)',
            pointerEvents: showColorPicker ? 'auto' : 'none'
          }}
        />
      </div>
      <IconButton
        icon={Eraser}
        isActive={props.selectedTool === 'eraser'}
        onClick={() => props.onToolSelect('eraser')}
      />
      <IconButton
        icon={ArrowClockwise}
        onClick={props.onClear}
      />
      <IconButton
        icon={UploadSimple}
        onClick={props.onUpload}
      />
    </>
  );

  const renderBackTools = () => (
    <>
      <FontDropdown />
      <div ref={colorPickerRef} className="relative">
        <IconButton
          isColorIndicator
          color={props.textColor}
          isActive={showColorPicker}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        <input
          ref={colorPickerInputRef}
          type="color"
          value={props.textColor}
          onChange={(e) => props.onTextColorChange(e.target.value)}
          className="absolute opacity-0 w-px h-px"
          style={{ 
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: showColorPicker ? 'auto' : 'none'
          }}
        />
      </div>
    </>
  );

  return (
    <div className="relative" ref={toolbarRef}>
      <div className="inline-flex items-center p-2.5 gap-4 rounded-2xl border border-[#E4E4E4] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.10)] transition-all duration-300 ease-in-out">
        {props.currentSide === 'front' ? renderFrontTools() : renderBackTools()}
        <Separator />
        <IconButton
          icon={DownloadSimple}
          onClick={props.onDownload}
        />
        <IconButton
          icon={ArrowsCounterClockwise}
          onClick={props.onFlip}
        />
      </div>
    </div>
  );
};

export default Toolbar; 