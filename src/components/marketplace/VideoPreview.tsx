import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Sliders, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { Prompt } from '../../types';

interface VideoPreviewProps {
  prompt: Prompt;
  isDetail?: boolean;
  autoplayOnHover?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '4:5';
  className?: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  prompt,
  isDetail = false,
  autoplayOnHover = false,
  aspectRatio = '16:9',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [stage, setStage] = useState<'prompt' | 'generating' | 'result'>('result');
  const [progress, setProgress] = useState(100);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isRealVideo =
    prompt.demo_video_url &&
    (prompt.demo_video_url.endsWith('.mp4') ||
      prompt.demo_video_url.endsWith('.webm') ||
      prompt.demo_video_url.startsWith('blob:'));

  // Autoplay on hover handling
  useEffect(() => {
    if (autoplayOnHover && isHovered && !isPlaying) {
      handlePlay();
    } else if (autoplayOnHover && !isHovered && isPlaying && !isDetail) {
      handlePause();
    }
  }, [isHovered, autoplayOnHover]);

  // Simulation loop when running generative demo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isRealVideo) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0; // restart
          }
          const next = prev + 1.5;
          if (next < 30) {
            setStage('prompt');
          } else if (next < 70) {
            setStage('generating');
          } else {
            setStage('result');
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isRealVideo]);

  const handlePlay = () => {
    setIsPlaying(true);
    if (isRealVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (stage === 'result' && progress >= 100) {
      setProgress(0);
      setStage('prompt');
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (isRealVideo && videoRef.current) {
      videoRef.current.pause();
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProgress(0);
    setStage('prompt');
    setIsPlaying(true);
    if (isRealVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const aspectClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '4:5': 'aspect-[4/5]',
  }[aspectRatio];

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#111111] rounded-lg group select-none ${aspectClass} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Real Video rendering */}
      {isRealVideo ? (
        <video
          ref={videoRef}
          src={prompt.demo_video_url}
          poster={prompt.cover_image_url}
          muted={isMuted}
          playsInline
          loop
          className="w-full h-full object-cover"
        />
      ) : (
        /* 2. Interactive Generative Video Simulation: Prompt -> Generation -> Result */
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Background Poster / Result Image */}
          <img
            src={prompt.cover_image_url}
            alt={prompt.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isPlaying && stage !== 'result' ? 'opacity-20 scale-105 blur-sm' : 'opacity-100 scale-100'
            }`}
            referrerPolicy="no-referrer"
          />

          {/* Generative Simulation Overlay */}
          {isPlaying && (
            <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300">
              {/* Stage Tracker Header */}
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-4 text-xs font-medium tracking-wide text-neutral-300">
                  <span
                    className={`transition-colors flex items-center gap-1.5 ${
                      stage === 'prompt' ? 'text-[#B8FF3D] font-semibold' : 'text-neutral-400'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    1. Prompt Formula
                  </span>
                  <span className="text-neutral-600">→</span>
                  <span
                    className={`transition-colors flex items-center gap-1.5 ${
                      stage === 'generating' ? 'text-[#8BD3FF] font-semibold' : 'text-neutral-400'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    2. AI Generation
                  </span>
                  <span className="text-neutral-600">→</span>
                  <span
                    className={`transition-colors flex items-center gap-1.5 ${
                      stage === 'result' ? 'text-white font-semibold' : 'text-neutral-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#B8FF3D]" />
                    3. Output Result
                  </span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400 bg-white/10 px-2 py-0.5 rounded">
                  {prompt.ai_tool}
                </span>
              </div>

              {/* Dynamic Stage Content */}
              <div className="my-auto flex flex-col items-center justify-center text-center px-4">
                {stage === 'prompt' && (
                  <div className="max-w-md w-full text-left bg-black/80 p-3.5 rounded border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono mb-1.5">
                      Input Syntax
                    </div>
                    <p className="text-xs font-mono text-neutral-200 line-clamp-3 leading-relaxed">
                      "{prompt.full_prompt.slice(0, 140)}..."
                    </p>
                  </div>
                )}

                {stage === 'generating' && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative flex items-center justify-center">
                      <div className="w-10 h-10 border-2 border-white/20 border-t-[#8BD3FF] rounded-full animate-spin" />
                      <Sparkles className="w-4 h-4 text-[#8BD3FF] absolute" />
                    </div>
                    <div className="text-xs font-mono text-neutral-300">
                      Synthesizing latent diffusion tensors ({Math.round(progress)}%)
                    </div>
                    <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8BD3FF] to-[#B8FF3D] transition-all duration-75"
                        style={{ width: `${((progress - 30) / 40) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {stage === 'result' && (
                  <div className="bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded text-xs font-medium text-white border border-white/15 animate-in fade-in duration-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B8FF3D]" />
                    <span>Generation Complete · Ready to Copy</span>
                  </div>
                )}
              </div>

              {/* Progress timeline bar */}
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Center Play Button Overlay (when paused or idle) */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/40 transition-colors group/btn cursor-pointer"
          aria-label="Play prompt generation demonstration"
        >
          <div className="w-12 h-12 rounded-full bg-white/90 text-[#111111] flex items-center justify-center shadow-lg group-hover/btn:scale-110 group-hover/btn:bg-white transition-all duration-200">
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          </div>
        </button>
      )}

      {/* Floating Demo Indicator Pill in Top Corner */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-md border border-white/10">
        <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#B8FF3D] animate-pulse' : 'bg-neutral-400'}`} />
        <span>Prompt Demo</span>
      </div>

      {/* Floating Control Bar for Detail Pages */}
      {isDetail && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/10">
          <button
            onClick={togglePlay}
            className="p-1 text-white hover:text-[#B8FF3D] transition-colors rounded"
            title={isPlaying ? 'Pause Demo' : 'Play Demo'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={handleReset}
            className="p-1 text-white hover:text-neutral-300 transition-colors rounded"
            title="Replay from Beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {isRealVideo && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 text-white hover:text-neutral-300 transition-colors rounded"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
