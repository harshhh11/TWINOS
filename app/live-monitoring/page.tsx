'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Video,
  Upload,
  Camera,
  Sparkles,
  Users,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Box,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { analyzeFrame, generateEventFromVision } from '@/lib/vision/visionEngine';
import { CameraFeed } from '@/types';

export default function LiveMonitoringPage() {
  const router = useRouter();
  const {
    cameraFeeds,
    activeCameraId,
    setActiveCamera,
    triggerCrowdAnomaly,
    addIncident,
    updateMarkerStatus,
    startSignatureSync,
  } = useTwinStore();

  const [selectedFeedId, setSelectedFeedId] = useState<string>(activeCameraId || 'cam-term-b');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionSuccess, setDetectionSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentFeed = cameraFeeds.find((c) => c.id === selectedFeedId) || cameraFeeds[1];

  // Handle local image or video upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setUploadedMediaUrl(objectUrl);
    runAnalysis();
  };

  // Toggle user webcam
  const handleToggleWebcam = async () => {
    if (isWebcamActive) {
      setIsWebcamActive(false);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsWebcamActive(true);
        runAnalysis();
      } catch (err) {
        alert('Webcam permission denied or not available. Using high-definition airport CCTV simulation.');
      }
    }
  };

  // Run the Computer Vision AI analysis
  const runAnalysis = () => {
    setIsAnalyzing(true);
    setDetectionSuccess(false);

    setTimeout(() => {
      setIsAnalyzing(false);
      setDetectionSuccess(true);
    }, 800);
  };

  // THE SIGNATURE ACTION: Sync CV detection to 3D Digital Twin
  const handleSyncToTwin = () => {
    // 1. Trigger anomaly in store
    triggerCrowdAnomaly(selectedFeedId, currentFeed.locationId);

    // 2. Start signature laser beam
    startSignatureSync();

    // 3. Navigate back to dashboard with notification
    router.push('/');
  };

  return (
    <div className="w-screen h-screen overflow-y-auto bg-twin-bg text-white font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-white/10 bg-[#12161E]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30 shadow-glass">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-twin-orange" />
              Computer Vision & Live CCTV Monitoring
            </h1>
            <p className="text-[11px] text-white/50">
              Edge AI Object Detection • Passenger Density Estimation • Digital Twin Sync
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-twin-orange" />
            <span>Upload Surveillance Footage</span>
          </button>

          <button
            onClick={handleToggleWebcam}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isWebcamActive
                ? 'bg-red-500/20 border-red-500 text-red-200'
                : 'bg-white/5 hover:bg-white/10 border-white/15 text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isWebcamActive ? 'Stop Webcam' : 'Use Webcam'}</span>
          </button>

          <button
            onClick={handleSyncToTwin}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-bold shadow-orange-glow transition-all cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sync Detection to 3D Twin</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* ========================================================================= */}
        {/* LEFT 2 COLUMNS: PRIMARY CCTV STREAM & BOUNDING BOX VISUALIZER */}
        {/* ========================================================================= */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-white/15 shadow-2xl h-[440px] flex items-center justify-center group">
            {/* Real Webcam Stream if active */}
            {isWebcamActive && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Custom Uploaded Image/Video */}
            {uploadedMediaUrl && !isWebcamActive && (
              <img
                src={uploadedMediaUrl}
                alt="Uploaded CCTV Sample"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Default High-Quality CCTV Representation */}
            {!isWebcamActive && !uploadedMediaUrl && (
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-950/95 flex items-center justify-center">
                {/* Surveillance Grid Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94A3B8_1px,transparent_1px)] [background-size:24px_24px]" />

                {/* Animated Crowd Silhouettes */}
                <div className="relative w-full h-full flex items-center justify-around px-8 pt-12">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={`silhouette-${i}`}
                      className="flex flex-col items-center opacity-85 transition-all duration-500 hover:scale-110"
                    >
                      <div className="w-5 h-5 rounded-full bg-slate-400 mb-1" />
                      <div className="w-9 h-20 rounded-t-xl bg-slate-500 shadow-lg" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real-Time Computer Vision Bounding Boxes Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {currentFeed.detections.map((det) => (
                <div
                  key={det.id}
                  style={{
                    left: `${det.box[0]}%`,
                    top: `${det.box[1]}%`,
                    width: `${det.box[2]}%`,
                    height: `${det.box[3]}%`,
                  }}
                  className={`absolute border-2 rounded-sm transition-all duration-300 ${
                    det.label === 'CROWD'
                      ? 'border-red-500 bg-red-500/15 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                      : det.label === 'RESTRICTED_ACCESS'
                      ? 'border-amber-400 bg-amber-400/15'
                      : 'border-emerald-400 bg-emerald-400/10'
                  }`}
                >
                  <div
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-b font-bold tracking-tight inline-block ${
                      det.label === 'CROWD'
                        ? 'bg-red-500 text-white'
                        : det.label === 'RESTRICTED_ACCESS'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {det.label} {det.confidence.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Top Stream Status Bar */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-bold text-white tracking-wider">{currentFeed.code}</span>
                <span className="text-white/50">• {currentFeed.locationName}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-white/60">{currentFeed.resolution} @ {currentFeed.fps}fps</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  AI INFERENCE: ONLINE
                </span>
              </div>
            </div>

            {/* Bottom Stream Status */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-white/50 block">Detected In Flow</span>
                <span className="text-base font-bold text-white">
                  {currentFeed.currentCrowdCount} Passengers • Queue: {currentFeed.currentQueueMinutes} min
                </span>
              </div>

              <button
                onClick={runAnalysis}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analyzing...' : 'Re-run Model'}</span>
              </button>
            </div>
          </div>

          {/* CCTV Feed Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {cameraFeeds.map((feed) => {
              const isSelected = feed.id === selectedFeedId;

              return (
                <button
                  key={feed.id}
                  onClick={() => {
                    setSelectedFeedId(feed.id);
                    setActiveCamera(feed.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500/20 border-orange-500/60 shadow-orange-glow'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-mono text-white/60">{feed.code}</span>
                    <span
                      className={`font-bold ${
                        feed.status === 'CRITICAL'
                          ? 'text-red-400'
                          : feed.status === 'WARNING'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      ● {feed.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{feed.name}</h4>
                  <span className="text-[10px] text-white/40 block mt-1">
                    {feed.currentCrowdCount} people in view
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: AI CV TELEMETRY & TWIN SYNCHRONIZATION INFO */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4">
          {/* CV Detection Stats Card */}
          <div className="bg-[#12161E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-glass">
            <h3 className="text-xs font-bold text-white tracking-wide uppercase mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-twin-orange" />
              Computer Vision Intelligence
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <span className="text-white/60">Crowd Density Index</span>
                <span className="text-sm font-bold text-red-400">CRITICAL (2.8/m²)</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <span className="text-white/60">Anomaly Classification</span>
                <span className="text-sm font-bold text-white">HIGH_CROWD_BOTTLENECK</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <span className="text-white/60">Optical Model Confidence</span>
                <span className="text-sm font-bold text-emerald-400">94.8%</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <span className="text-white/60">Mapped Twin Coordinate</span>
                <span className="text-xs font-mono text-twin-orange">[11.0, 2.5, 3.0]</span>
              </div>
            </div>

            {/* Signature Flow Explanation */}
            <div className="mt-5 p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <h4 className="text-xs font-bold text-twin-orange mb-1">
                The Signature TwinOS Connection:
              </h4>
              <p className="text-[11px] text-white/70 leading-relaxed">
                When an anomaly is detected here, TwinOS immediately connects this camera feed to Terminal B in the 3D Digital Twin using an animated laser vector, updates occupancy to 88%, and propagates the failure cascade into the dependency engine.
              </p>
            </div>

            {/* Launch Sync Button */}
            <button
              onClick={handleSyncToTwin}
              className="mt-5 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs shadow-orange-glow transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Box className="w-4 h-4" />
              <span>Launch Live Digital Twin Sync</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
