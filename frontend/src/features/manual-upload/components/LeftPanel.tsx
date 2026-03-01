
import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, RefreshCw, AlertTriangle, CheckCircle, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UploadedFile, DetectionResult } from '@/features/manual-upload/types/index';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

interface LeftPanelProps {
    uploadedFiles: UploadedFile[];
    uploading: boolean;
    isDragging: boolean;
    uploadProgress: number;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenFilePicker: () => void;
    onRemoveFile: (index: number) => void;
    onClearAll: () => void;
    detectionResult: DetectionResult | null;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
    uploadedFiles,
    uploading,
    isDragging,

    fileInputRef,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileUpload,
    onOpenFilePicker,
    onRemoveFile,
    onClearAll,
    detectionResult,
}) => {
    const hasFiles = uploadedFiles.length > 0;
    const currentFile = hasFiles ? uploadedFiles[0] : null;

    const [mediaDimensions, setMediaDimensions] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });
    const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);

    const handleMediaLoad = (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement>) => {
        const target = e.target as any;
        setMediaDimensions({
            width: target.clientWidth,
            height: target.clientHeight,
            naturalWidth: target.naturalWidth || target.videoWidth || 1,
            naturalHeight: target.naturalHeight || target.videoHeight || 1
        });
    };

    // Recalculate on window resize
    useEffect(() => {
        const handleResize = () => {
            if (mediaRef.current) {
                const target = mediaRef.current;
                setMediaDimensions(prev => ({
                    ...prev,
                    width: target.clientWidth,
                    height: target.clientHeight
                }));
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const displaySrc = detectionResult?.imageUrl || currentFile?.preview;

    const renderBoundingBoxes = () => {
        // Disabled frontend SVG bounding boxes:
        // The AI Backend Engine already permanently burns ultra-professional 
        // HUD bounding boxes directly into the video frames and images. 
        // Rendering SVG boxes here causes aspect-ratio misalignment ("floating boxes").
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
        relative overflow-hidden rounded-[32px] border transition-all duration-500 h-full flex flex-col glass premium-shadow
        ${isDragging ? 'border-primary/50 bg-primary/5 scale-[0.99]' : 'border-white/5'}
        ${uploading ? 'opacity-90 pointer-events-none' : ''}
      `}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            {/* ─── Header ───────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${hasFiles ? 'bg-primary animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-muted-foreground/30'}`} />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-70">Visual Analysis Feed</h3>
                </div>

                {hasFiles && (
                    <div className="flex items-center gap-4">
                        <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Channel-A1 • Live Term</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearAll}
                            className="h-8 px-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 text-[9px] font-black uppercase tracking-widest gap-2"
                            disabled={uploading}
                        >
                            <RefreshCw className="w-3 h-3" />
                            Reset
                        </Button>
                    </div>
                )}
            </div>

            {/* ─── Main Content Area ────────────────────────────────────────────── */}
            <div className={`flex-1 relative flex flex-col ${!hasFiles ? 'justify-center min-h-[400px]' : 'min-h-0'}`}>

                {/* Visual Monitor Area */}
                <div
                    className={`relative w-full ${hasFiles ? 'bg-black/40 border-b border-white/5' : 'h-full flex items-center justify-center'}`}
                    style={{
                        aspectRatio: hasFiles && mediaDimensions.naturalWidth ? `${mediaDimensions.naturalWidth}/${mediaDimensions.naturalHeight}` : undefined,
                        maxHeight: '70vh'
                    }}
                >

                    {!hasFiles ? (
                        /* Empty State */
                        <div className="text-center p-12 animate-in fade-in zoom-in duration-700">
                            <div
                                onClick={onOpenFilePicker}
                                className="w-28 h-28 rounded-[40px] bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 flex items-center justify-center mx-auto mb-8 cursor-pointer transition-all duration-500 group shadow-2xl hover:shadow-primary/10"
                            >
                                <Upload className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-all duration-500 group-hover:scale-110" />
                            </div>
                            <h4 className="text-2xl font-black text-white tracking-tighter uppercase mb-4">Initialize Feed</h4>
                            <div className="space-y-3">
                                <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                                    Drag & Drop or <span className="text-primary cursor-pointer hover:underline" onClick={onOpenFilePicker}>Browse Files</span>
                                </p>
                                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                    Auth Protocol: YOLOv8 Engine • Secure Channel
                                </p>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={onFileUpload}
                                accept="image/*,video/*"
                            />
                        </div>
                    ) : (
                        /* Live/Preview State */
                        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden group">

                            {/* HUD Overlay */}
                            <div className="absolute inset-0 pointer-events-none z-10">
                                {/* Grid Pattern */}
                                <div className="absolute inset-0 opacity-[0.03]"
                                    style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                                />

                                {/* Corner Brackets */}
                                <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-primary/30 rounded-tl-2xl" />
                                <div className="absolute top-6 right-6 w-10 h-10 border-t border-r border-primary/30 rounded-tr-2xl" />
                                <div className="absolute bottom-6 left-6 w-10 h-10 border-b border-l border-primary/30 rounded-bl-2xl" />
                                <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-primary/30 rounded-br-2xl" />

                                {/* Center Target */}
                                {detectionResult && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
                                        <Target className="w-32 h-32 text-primary animate-[spin_20s_linear_infinite]" strokeWidth={0.5} />
                                    </div>
                                )}

                                {/* Status Badges */}
                                <div className="absolute top-6 left-6 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-[9px] font-black tracking-widest text-primary flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    {detectionResult ? 'AI ANALYZING' : 'IDLE'}
                                </div>

                                <div className="absolute top-6 right-6 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-[9px] font-black tracking-widest text-muted-foreground">
                                    REC [00:{Math.floor(Date.now() / 1000) % 60 < 10 ? '0' : ''}{Math.floor(Date.now() / 1000) % 60}]
                                </div>

                                {/* Scanning Line Animation */}
                                <AnimatePresence>
                                    {(uploading || detectionResult) && (
                                        <motion.div
                                            initial={{ top: 0, opacity: 0 }}
                                            animate={{ top: ['0%', '100%', '0%'], opacity: [0, 1, 1, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.8)] z-20"
                                        />
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Bounding Box Overlay */}
                            {renderBoundingBoxes()}

                            {/* Media Display */}
                            {detectionResult?.imageUrl ? (
                                <img
                                    ref={mediaRef as React.RefObject<HTMLImageElement>}
                                    src={displaySrc}
                                    alt="Analysis Feed"
                                    onLoad={handleMediaLoad}
                                    className="w-full h-full object-contain transition-transform duration-700"
                                />
                            ) : (
                                currentFile?.type === 'video' ? (
                                    <video
                                        ref={mediaRef as React.RefObject<HTMLVideoElement>}
                                        src={displaySrc}
                                        controls
                                        onLoadedMetadata={handleMediaLoad}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <img
                                        ref={mediaRef as React.RefObject<HTMLImageElement>}
                                        src={displaySrc}
                                        alt="Preview"
                                        onLoad={handleMediaLoad}
                                        className="w-full h-full object-contain"
                                    />
                                )
                            )}

                            {/* Remove Button */}
                            {!detectionResult && !uploading && (
                                <button
                                    onClick={() => onRemoveFile(0)}
                                    className="absolute top-6 right-6 z-20 p-2.5 bg-black/60 hover:bg-red-500 text-white rounded-2xl transition-all backdrop-blur-md border border-white/10 shadow-2xl"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                        </div>
                    )}
                </div>

                {/* System Diagnostics Bar */}
                {hasFiles && (
                    <div className="grid grid-cols-4 gap-px bg-white/5 border-b border-white/5">

                    </div>
                )}
            </div>

            {/* ─── Footer: Detection Status ─── */}
            {detectionResult && (
                <div className={`
          p-6 border-t border-white/5 backdrop-blur-2xl
          ${detectionResult.accidentDetected
                        ? 'bg-red-500/[0.03]'
                        : 'bg-primary/[0.03]'
                    }
        `}>
                    <div className="flex items-center gap-6">
                        <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-transform duration-500 hover:scale-105
              ${detectionResult.accidentDetected
                                ? 'bg-red-500 text-white shadow-red-500/20'
                                : 'bg-primary text-white shadow-primary/20'}
            `}>
                            {detectionResult.accidentDetected ? (
                                <AlertTriangle className="w-8 h-8 animate-pulse" />
                            ) : (
                                <CheckCircle className="w-8 h-8" />
                            )}
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className={`text-xl font-black tracking-tight uppercase ${detectionResult.accidentDetected ? 'text-red-500' : 'text-primary'}`}>
                                    {detectionResult.accidentDetected ? "Accident Confirmed" : "Normal Status"}
                                </h4>
                                <Badge className={`bg-${detectionResult.accidentDetected ? 'red' : 'primary'}/10 text-${detectionResult.accidentDetected ? 'red' : 'primary'} border-none text-[10px] uppercase font-black tracking-widest`}>
                                    Priority {detectionResult.accidentDetected ? 'Level 1' : 'Routine'}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${detectionResult.accidentDetected ? 'bg-red-500' : 'bg-primary'}`}
                                        style={{ width: `${(detectionResult.bestConfidence! * 100)}%` }}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-[10px] font-black text-white font-mono">{(detectionResult.bestConfidence! * 100).toFixed(1)}% CONFIDENCE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        @keyframes box-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }

        .animate-box-in {
            animation: box-in 0.3s ease-out forwards;
            transform-origin: center;
        }

        .animate-pulse-subtle {
            animation: pulse-subtle 2s infinite ease-in-out;
        }

        @keyframes pulse-subtle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
        }

        .box-corner {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: draw-corners 0.8s ease-out forwards;
        }

        @keyframes draw-corners {
            to { stroke-dashoffset: 0; }
        }
      `}</style>
        </motion.div>
    );
};

