import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';

interface PomodoroProps {
  initialMinutes?: number;
  autoStart?: boolean;
}

export default function PomodoroTimer({ initialMinutes = 25, autoStart = false }: PomodoroProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    setTimeLeft(initialMinutes * 60);
    setIsRunning(autoStart);
  }, [initialMinutes, autoStart]);

  useEffect(() => {
    let timer: any;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      alert(mode === 'focus' ? 'Focus session completed! Take a break.' : 'Break over! Back to studies.');
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'focus' ? (initialMinutes || 25) * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-xl mx-auto bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 shadow-xl text-center space-y-8 text-slate-200">
      
      {/* Mode Switcher */}
      <div className="flex bg-slate-950/60 p-2 rounded-2xl border border-slate-800/80">
        <button
          onClick={() => switchMode('focus')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'focus' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap size={16} /> Focus ({initialMinutes}m)
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'break' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Coffee size={16} /> Break (5m)
        </button>
      </div>

      {/* Larger Timer Display Box */}
      <div className="py-12 bg-slate-950/60 border border-slate-800/80 rounded-3xl shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 pointer-events-none blur-3xl"></div>
        <div className="text-7xl md:text-8xl font-black text-white tracking-tighter mb-3 drop-shadow-md">
          {formatTime(timeLeft)}
        </div>
        <p className="text-xs uppercase tracking-widest text-blue-400 font-bold">
          {mode === 'focus' ? '⚡ Deep Study Session' : '☕ Relaxing Break'}
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
          {isRunning ? 'Pause Session' : 'Start Timer'}
        </button>

        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(mode === 'focus' ? initialMinutes * 60 : 5 * 60);
          }}
          className="p-4 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-all shadow-md"
          title="Reset Timer"
        >
          <RotateCcw size={18} />
        </button>
      </div>

    </div>
  );
}