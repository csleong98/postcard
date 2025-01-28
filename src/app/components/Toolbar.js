import React, { useEffect, useRef } from 'react';
import IconButton from './IconButton';
import { 
  Upload, 
  Pencil, 
  PenLine, 
  Eraser, 
  RotateCcw, 
  Download, 
  RotateCw,
  ChevronDown 
} from 'lucide-react';

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
export default function Toolbar({
  currentSide,
  selectedTool,
  drawingColor,
  textColor,
  selectedFont,
  fontOptions,
  onToolSelect,
  onColorChange,
  onTextColorChange,
  onFontChange,
  onClear,
  onUpload,
  onDownload,
  onFlip,
  isMobile,
  hideUpload
}) {
  const [showFontDropdown, setShowFontDropdown] = React.useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFontDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const FontDropdown = () => (
    <div ref={dropdownRef} className="relative">
      <button 
        className="inline-flex items-center gap-2 px-4 py-2 w-[160px] rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setShowFontDropdown(!showFontDropdown)}
      >
        <span className="truncate text-gray-900" style={{ fontFamily: selectedFont }} title={selectedFont}>
          {selectedFont}
        </span>
        <ChevronDown 
          size={16} 
          className={`transform transition-transform duration-200 ${showFontDropdown ? 'rotate-180' : ''} flex-shrink-0 ml-auto text-gray-900`}
          weight="bold"
        />
      </button>
      {showFontDropdown && (
        <div className="absolute bottom-full left-0 mb-2 w-[160px] bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 max-h-[200px] overflow-y-auto">
          {fontOptions.map((font) => (
            <button
              key={font.value}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 text-gray-900"
              style={{ fontFamily: font.value }}
              onClick={() => {
                onFontChange(font.value);
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
    <div className={`flex items-center ${isMobile ? 'w-full justify-between' : 'gap-2'}`}>
      {!hideUpload && (
        <IconButton
          icon={<Upload size={20} />}
          onClick={onUpload}
          tooltip="Upload Image"
        />
      )}
      <IconButton
        icon={<Pencil size={20} />}
        isActive={selectedTool === 'pencil'}
        onClick={() => onToolSelect('pencil')}
        tooltip="Pencil"
      />
      <IconButton
        icon={<PenLine size={20} />}
        isActive={selectedTool === 'marker'}
        onClick={() => onToolSelect('marker')}
        tooltip="Marker"
      />
      <IconButton
        isColorIndicator
        color={drawingColor}
        onColorChange={onColorChange}
        tooltip="Drawing Color"
      />
      <IconButton
        icon={<Eraser size={20} />}
        isActive={selectedTool === 'eraser'}
        onClick={() => onToolSelect('eraser')}
        tooltip="Eraser"
      />
      <IconButton
        icon={<RotateCcw size={20} />}
        onClick={onClear}
        tooltip="Clear"
      />
    </div>
  );

  const renderBackTools = () => (
    <div className={`flex items-center ${isMobile ? 'w-full justify-between' : 'gap-2'}`}>
      <FontDropdown />
      <IconButton
        isColorIndicator
        color={textColor}
        onColorChange={onTextColorChange}
        tooltip="Text Color"
      />
    </div>
  );

  return (
    <div className="flex justify-center">
      <div className={`inline-flex items-center p-2.5 gap-4 rounded-2xl border border-[#E4E4E4] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.10)] transition-all duration-300 ease-in-out ${isMobile ? 'w-full justify-between' : ''}`}>
        {currentSide === 'front' ? renderFrontTools() : renderBackTools()}
        {!isMobile && (
          <>
            <Separator />
            <button
              onClick={onDownload}
              tooltip="Download"
              className="w-full px-4 py-2 text-[#2F2F2F] rounded-lg bg-transparent hover:bg-gray-100 hover:#2F2F2F transition-all flex items-center justify-center gap-2 relative z-10"
            >
              <Download size={20} />
              Download
            </button>

            <button
              onClick={onFlip}
              tooltip="Flip"
              className="w-full px-4 py-2 text-[#2F2F2F] rounded-lg bg-transparent hover:bg-gray-100 hover:#2F2F2F transition-all flex items-center justify-center gap-2 relative z-10"
            >
              <RotateCw size={20} />
              Flip
            </button>
          </>
        )}
      </div>
    </div>
  );
} 