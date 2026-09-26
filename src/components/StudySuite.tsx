import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Volume2, Play, Pause, RotateCcw, CheckCircle, Calendar, Trophy } from 'lucide-react';

export default function StudySuite() {
  // 1. Streak & Gamification State
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('studypulse_streak');
    return saved ? JSON.parse(saved) : { count: 5, lastActive: new Date().toDateString() };
  });

  // 2. Pomodoro Focus State with Timer
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSound, setActiveSound] = useState<string | null>(null);

  // 3. AI Planner State
  const [aiPlan, setAiPlan] = useState<string>('');
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      alert('Focus session completed! Great job.');
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateAIPan = async () => {
    setLoadingPlan(true);
    // Simulating smart AI planner generation based on user target
    setTimeout(() => {
      setAiPlan(
        "Day 1-3: Focus heavily on Calculus Integration & Vectors.\n" +
        "Day 4-5: Organic Chemistry name reactions & coordination compounds.\n" +
        "Day 6-7: Physics Electrostatics mock test and formula revision."
      );
      setLoadingPlan(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] rounded-3xl border border-slate-700/50 bg-[#0b101d]/75 backdrop-blur-xl shadow-xl overflow-y-auto text-slate-200 p-6 space-y-6">
      
      {/* Header & Streak Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-700/50 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-950/60 border border-amber-800/50 text-amber-400">
            <Flame className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Advanced Study Suite & Motivation
            </h2>
            <p className="text-xs text-slate-400">Streak tracker, AI planner, and focus audio boosters</p>
          </div>
        </div>

        {/* Streak Counter Card */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
          <Trophy className="h-5 w-5 text-amber-400" />
          <div>
            <p className="text-[10px] text-amber-300 uppercase font-semibold">Current Streak</p>
            <h3 className="text-sm font-bold text-white">{streak.count} Days Streak 🔥</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pomodoro Focus Enhancements */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/70 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <ClockIcon /> Focus Timer & Ambient Sounds
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800/50 font-mono">
                25 Min Session
              </span>
            </div>

            <div className="text-center my-6">
              <span className="text-5xl font-ext500 font-mono text-white tracking-wider">
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 mb-6">
              <button 
                onClick={() => setIsRunning(!isRunning)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all"
              >
                {isRunning ? <Pause size={16} /> : <Play size={16} />}
                {isRunning ? 'Pause' : 'Start Focus'}
              </button>
              <button 
                onClick={() => { setIsRunning(false); setTimeLeft(25 * 60); }}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Ambient Sound Selector */}
          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400 mb-2.5">Ambient Focus Sound:</p>
            <div className="grid grid-cols-3 gap-2">
              {['Rainfall', 'White Noise', 'Lo-Fi Beats'].map((sound) => (
                <button
                  key={sound}
                  onClick={() => setActiveSound(activeSound === sound ? null : sound)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
                    activeSound === sound
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Volume2 size={13} />
                  {sound}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Study Planner Generator */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/70 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" /> AI Smart Study Planner
              </h3>
              <button
                onClick={generateAIPan}
                disabled={loadingPlan}
                className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Sparkles size={13} /> {loadingPlan ? 'Generating...' : 'Generate Plan'}
              </button>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 min-h-[160px] flex items-center justify-center">
              {loadingPlan ? (
                <p className="text-xs text-purple-400 animate-pulse">AI is crafting your custom weekly routine...</p>
              ) : aiPlan ? (
                <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">{aiPlan}</pre>
              ) : (
                <p className="text-xs text-slate-500 text-center">Click 'Generate Plan' to create an optimized schedule using AI.</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Status: Ready for deployment</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle size={14} /> Optimized
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}