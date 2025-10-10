"use client";

import React, { useState, useRef } from "react";
import { m } from "motion/react";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from "lucide-react";

interface HowToPlayVideoProps {
  src: string;
  poster?: string;
  title: string;
  duration?: string;
  className?: string;
}

const HowToPlayVideo = ({ 
  src, 
  poster, 
  title, 
  duration = "0:30", 
  className = "" 
}: HowToPlayVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const restart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <m.div
      className={`relative group rounded-xl overflow-hidden bg-black/20 border border-white/10 ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Controls */}
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
        showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <m.button
            onClick={togglePlay}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white ml-1" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </m.button>
        </div>

        {/* Bottom Controls */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 ${
          showControls ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
              
              <button
                onClick={restart}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Center - Title */}
            <div className="flex-1 px-4">
              <h3 className="text-sm font-medium text-white truncate">{title}</h3>
              <p className="text-xs text-white/70">{duration}</p>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors"
              >
                <Maximize className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Top Badge */}
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm border border-primary/30">
            <span className="text-xs font-medium text-white">Tutorial</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </m.div>
  );
};

export default HowToPlayVideo;
