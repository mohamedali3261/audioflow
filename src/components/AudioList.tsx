import { FileAudio, Download, CheckCircle2, AlertCircle, Loader2, Trash2, Play, Pause } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioFile } from '../types';
import { cn } from '../lib/utils';

interface AudioListProps {
  files: AudioFile[];
  onRemove: (id: string) => void;
  onDownload: (file: AudioFile) => void;
  selectedId?: string;
  onSelect: (id: string) => void;
  lang: 'ar' | 'en';
  t: any;
}

export function AudioList({ files, onRemove, onDownload, selectedId, onSelect, lang, t }: AudioListProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const calculateReduction = (original: number, processed: number) => {
    const diff = original - processed;
    return ((diff / original) * 100).toFixed(1);
  };

  const togglePlay = (file: AudioFile) => {
    if (!file.previewUrl) return;

    if (playingId === file.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = file.previewUrl;
        audioRef.current.play();
        setPlayingId(file.id);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingId(null)} 
        className="hidden"
      />
      
      <AnimatePresence mode="popLayout">
        {files.map((file) => (
          <motion.div
            key={file.id}
            layout
            initial={{ opacity: 0, x: lang === 'ar' ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => onSelect(file.id)}
            className={cn(
              "p-3 border-b border-[#1A1D23] transition-colors group relative cursor-pointer sm:p-2",
              file.status === 'processing' ? "bg-[#1E2229] border-l-2 border-blue-500" : "hover:bg-[#1A1D23]",
              selectedId === file.id && "bg-[#1A1D23] border-l-2 border-blue-500"
            )}
          >
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-start gap-2">
                <span className={cn(
                  "text-[10px] sm:text-[11px] truncate font-medium flex-1",
                  file.status === 'completed' ? "text-white" : "text-gray-400"
                )} dir="ltr">
                  {file.name}
                </span>
                
                <div className="flex items-center gap-1 shrink-0">
                  {file.status === 'completed' && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePlay(file); }}
                        className="text-blue-400 hover:text-blue-300 p-1"
                      >
                        {playingId === file.id ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDownload(file); }}
                        className="text-white hover:text-blue-300 p-1 bg-blue-600 rounded-sm"
                      >
                        <Download size={12} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(file.id); }}
                    className="text-gray-600 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="flex flex-col items-start gap-0.5">
                  <div className="flex items-center gap-2 text-[8px] font-mono whitespace-nowrap">
                    <span className="text-gray-500 uppercase">{formatSize(file.size)}</span>
                    {file.processedSize && (
                      <span className="text-emerald-400 uppercase">→ {formatSize(file.processedSize)}</span>
                    )}
                  </div>
                  {file.status === 'completed' && (
                    <span className="text-[7px] font-bold text-emerald-400 bg-emerald-900/20 px-1 py-0.5 rounded uppercase font-mono tracking-tighter">
                      -{calculateReduction(file.size, file.processedSize || 0)}%
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest">
                  {file.status === 'idle' && <span className="text-gray-600">{t.queued}</span>}
                  {file.status === 'processing' && (
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <Loader2 size={10} className="animate-spin" />
                      <span>{file.progress}%</span>
                    </div>
                  )}
                  {file.status === 'completed' && <span className="text-emerald-500">{t.ready}</span>}
                  {file.status === 'error' && <span className="text-red-500">{t.fail}</span>}
                </div>
              </div>
            </div>

            {file.status === 'processing' && (
              <div className="absolute bottom-0 left-0 h-[1px] bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300" 
                   style={{ width: `${file.progress}%` }} />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

