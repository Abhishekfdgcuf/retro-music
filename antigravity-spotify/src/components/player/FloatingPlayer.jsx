import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "../../store/usePlayerStore";
import { cn } from "../../lib/utils";

export function FloatingPlayer() {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, volume, setVolume } = usePlayerStore();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percent = x / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="backdrop-blur-2xl bg-black/60 border border-white/10 rounded-full p-3 px-6 shadow-[0_0_40px_rgba(168,85,247,0.2)] flex items-center justify-between gap-6"
      >
        <audio
          ref={audioRef}
          src={currentTrack.audio}
          onTimeUpdate={handleTimeUpdate}
          onEnded={nextTrack}
        />

        {/* Track Info w/ Zero-G Cover Art */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full overflow-hidden border border-white/20 flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            <img 
              src={currentTrack.image} 
              alt={currentTrack.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="truncate">
            <h4 className="text-white font-medium text-sm truncate">{currentTrack.name}</h4>
            <p className="text-white/50 text-xs truncate">{currentTrack.artist_name}</p>
          </div>
        </div>

        {/* Core Controls */}
        <div className="flex flex-col items-center gap-1 flex-1 max-w-md w-full">
          <div className="flex items-center gap-6">
            <button className="text-white/50 hover:text-white transition-colors">
              <Shuffle className="w-4 h-4" />
            </button>
            <button onClick={prevTrack} className="text-white hover:text-purple-400 transition-colors">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            <button onClick={nextTrack} className="text-white hover:text-purple-400 transition-colors">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            <button className="text-white/50 hover:text-white transition-colors">
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          
          {/* Wormhole Progress Bar */}
          <div 
            className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer relative group overflow-hidden"
            onClick={handleSeek}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-400 rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-white/50 to-transparent blur-sm" />
            </div>
            {/* Wormhole effect overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] mix-blend-overlay" />
          </div>
        </div>

        {/* Volume & Extras */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <Volume2 className="w-4 h-4 text-white/50" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </motion.div>
    </div>
  );
}
