import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isRunning) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-xl mx-auto bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 shadow-xl text-center space-y-8 text-slate-200">
      
      {/* Header Info */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-blue-950/60 border border-blue-800/50 text-blue-400 rounded-2xl flex items-center justify-center shadow-md">
          <Clock size={28} />
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight mb-1">Live Study Stopwatch</h2>
          <p className="text-xs text-slate-400">Track your continuous deep study sessions</p>
        </div>
      </div>

      {/* Larger Timer Display Box */}
      <div className="py-12 bg-slate-950/60 border border-slate-800/80 rounded-3xl shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 pointer-events-none blur-3xl"></div>
        <div className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-2 drop-shadow-md">
          {formatTime(time)}
        </div>
        <p className="text-xs uppercase tracking-widest text-blue-400 font-bold">
          ⏱️ Continuous Session Timer
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-10 py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center gap-2.5 text-sm ${
            isRunning 
              ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30' 
              : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
          }`}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          {isRunning ? 'Pause Stopwatch' : 'Start Stopwatch'}
        </button>

        <button
          onClick={() => {
            setIsRunning(false);
            setTime(0);
          }}
          className="p-4 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-all shadow-md"
          title="Reset Stopwatch"
        >
          <RotateCcw size={18} />
        </button>
      </div>

    </div>
  );
}