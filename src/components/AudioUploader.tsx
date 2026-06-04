import { useState, useCallback } from 'react';
import { Upload, Music, X, Plus, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioFile } from '../types';
import { cn } from '../lib/utils';

interface AudioUploaderProps {
  onFilesAdded: (files: File[]) => void;
  t: any;
}

export function AudioUploader({ onFilesAdded, t }: AudioUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('audio/'));
    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [onFilesAdded]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file => file.type.startsWith('audio/'));
      if (files.length > 0) {
        onFilesAdded(files);
      }
      e.target.value = ''; // Reset to allow re-adding same file
    }
  }, [onFilesAdded]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative h-48 sm:h-64 w-full flex items-center justify-center p-6 sm:p-8 bg-[#111418] border border-[#1A1D23] rounded-lg transition-all duration-300",
        isDragging 
          ? "border-blue-500 scale-[0.99] bg-[#1a1f26]" 
          : "hover:border-[#2D3139]"
      )}
    >
      <input
        type="file"
        multiple
        accept="audio/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
        <div className={cn(
          "w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-500",
          isDragging ? "border-blue-500 text-blue-500 scale-110" : "border-[#2D3139] text-[#2D3139]"
        )}>
          <Plus size={20} strokeWidth={3} />
        </div>

        <div>
          <h3 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-widest mb-1 sm:mb-2">{t.initializeStream}</h3>
          <p className="text-[9px] sm:text-[10px] text-gray-500 font-mono uppercase px-4">
            {t.dropFiles}
          </p>
        </div>

        <div className="flex gap-4 items-center opacity-30 scale-90 sm:scale-100">
          <div className="flex items-center gap-1.5 text-[8px] font-mono whitespace-nowrap">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span>{t.localBuffer}</span>
          </div>
          <div className="w-[1px] h-3 bg-[#2D3139]" />
          <div className="flex items-center gap-1.5 text-[8px] font-mono whitespace-nowrap">
            <HardDrive size={10} />
            <span>{t.secureFs}</span>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-[#2D3139] -translate-x-[1px] -translate-y-[1px]" />
      <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-[#2D3139] translate-x-[1px] -translate-y-[1px]" />
      <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-[#2D3139] -translate-x-[1px] translate-y-[1px]" />
      <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-[#2D3139] translate-x-[1px] translate-y-[1px]" />
    </div>
  );
}

