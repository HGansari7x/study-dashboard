import React, { useState, useEffect, useRef } from 'react';
import { Timer, BookOpen, Play, Plus, AlertTriangle, Video, Trophy } from 'lucide-react';

interface DashboardProps {
  userProfile: {
    name: string;
    classTarget: string;
    examDate: string;
  };
  setCurrentTab: (tab: string) => void;
  totalStudyMinutes?: number;
  targetStudyHours?: number; 
  onStartSession?: (title: string, durationMinutes: number) => void;
}

export default function Dashboard({ userProfile, setCurrentTab, totalStudyMinutes = 0, targetStudyHours = 10, onStartSession }: DashboardProps) {
  // Countdown Timer state
  const [timeLeft, setTimeLeft] = useState({ days: 143, hours: 0, mins: 52, secs: 30 });

  // Status state initialized from localStorage
  const [currentStatus, setCurrentStatus] = useState<'On Track' | 'Distracted' | 'On Break'>(() => {
    return (localStorage.getItem('studypulse_current_status') as any) || 'On Track';
  });

  const [activeSubject, setActiveSubject] = useState<'PHYSICS' | 'CHEMISTRY' | 'MATHS' | 'WASTED'>('PHYSICS');

  // Save status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('studypulse_current_status', currentStatus);
  }, [currentStatus]);

  // Robust 12-hour to total minutes converter
  function parseTimeToMinutes(timeStr: string) {
    if (!timeStr) return 0;
    try {
      const parts = timeStr.trim().split(' ');
      if (parts.length < 2) return 0;
      const [timePart, modifier] = parts;
      const timeSubParts = timePart.split(':');
      let hours = parseInt(timeSubParts[0], 10);
      const minutes = parseInt(timeSubParts[1] || '0', 10);

      if (isNaN(hours) || isNaN(minutes)) return 0;

      if (modifier.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
      }
      if (modifier.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }
      return hours * 60 + minutes;
    } catch (e) {
      return 0;
    }
  }

  // Daily Reset & History Archive Logic based on Date
  useEffect(() => {
    const todayStr = new Date().toDateString();
    const savedDate = localStorage.getItem('studypulse_last_date');

    if (savedDate && savedDate !== todayStr) {
      const lastStudied = Number(localStorage.getItem('studypulse_studied') || 0);
      const lastWasted = Number(localStorage.getItem('studypulse_wasted') || 0);
      
      const existingHistory = JSON.parse(localStorage.getItem('studypulse_history') || '[]');
      const newHistoryEntry = {
        date: savedDate,
        studiedSeconds: lastStudied,
        wastedSeconds: lastWasted,
      };

      localStorage.setItem('studypulse_history', JSON.stringify([...existingHistory, newHistoryEntry]));
      localStorage.setItem('studypulse_studied', '0');
      localStorage.setItem('studypulse_wasted', '0');
    }

    if (!savedDate) {
      localStorage.setItem('studypulse_last_date', todayStr);
    }
  }, []);

  // Read timetable slots to filter study vs break slots accurately
  const savedSlots = localStorage.getItem('studypulse_timetable_slots');
  const slots = savedSlots ? JSON.parse(savedSlots) : [];

  const calculatedStudyMinutes = slots
    .filter((slot: any) => slot.type === 'Study' || !slot.type)
    .reduce((acc: number, slot: any) => acc + (slot.durationMins || 0), 0);

  const [studiedSeconds, setStudiedSeconds] = useState<number>(() => {
    const initialMins = totalStudyMinutes > 0 ? totalStudyMinutes : calculatedStudyMinutes;
    const saved = localStorage.getItem('studypulse_studied');
    return saved ? Number(saved) : initialMins * 60;
  });
  
  const [wastedSeconds, setWastedSeconds] = useState<number>(() => Number(localStorage.getItem('studypulse_wasted')) || 0);

  useEffect(() => {
    const effectiveMinutes = totalStudyMinutes > 0 ? totalStudyMinutes : calculatedStudyMinutes;
    if (effectiveMinutes > 0) {
      setStudiedSeconds(effectiveMinutes * 60);
      localStorage.setItem('studypulse_studied', (effectiveMinutes * 60).toString());
    }
  }, [totalStudyMinutes, calculatedStudyMinutes]);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isSticky, setIsSticky] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bannerRef.current) {
        const rect = bannerRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 16);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.error("Webcam access error:", err);
          setIsCameraOn(false);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        currentStream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOn]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStatus === 'On Track' && activeSubject !== 'WASTED') {
        setStudiedSeconds(prev => {
          const next = prev + 1;
          localStorage.setItem('studypulse_studied', next.toString());
          return next;
        });
      } else {
        setWastedSeconds(prev => {
          const next = prev + 1;
          localStorage.setItem('studypulse_wasted', next.toString());
          return next;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStatus, activeSubject]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentActiveSlot = () => {
    if (!slots || slots.length === 0) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const slot of slots) {
      let startMins = parseTimeToMinutes(slot.startTime);
      let endMins = parseTimeToMinutes(slot.endTime);

      if (endMins <= startMins) {
        endMins += 24 * 60;
      }

      if (currentMinutes >= startMins && currentMinutes < endMins) {
        return slot;
      }
    }
    // Strictly return null if no slot matches current running time
    return null;
  };

  const activeSlot = getCurrentActiveSlot();

  const formatHours = (secs: number) => (secs / 3600).toFixed(2);
  const productivityScore = Math.max(0, Math.min(100, Math.round((studiedSeconds / (studiedSeconds + wastedSeconds || 1)) * 100)));

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-200 pb-12 relative">
      
      <div ref={bannerRef} className="h-0 w-0"></div>

      <div className={`transition-all duration-200 z-40 ${
        isSticky 
          ? 'fixed top-4 left-72 right-8 max-w-6xl mx-auto shadow-2xl' 
          : 'relative w-full'
      }`}>
        <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-5 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              📅 Board Exams 2027 Countdown
            </h2>
            <p className="text-[11px] text-slate-400">Stay consistent every single day to crush your goals</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2.5 rounded-2xl border border-slate-800/80 text-sm font-mono font-bold">
            <div className="text-center"><span className="text-blue-400 text-base">{timeLeft.days}</span> <span className="text-[9px] text-slate-500 block uppercase">Days</span></div>
            <span className="text-slate-600">:</span>
            <div className="text-center"><span className="text-blue-400 text-base">{String(timeLeft.hours).padStart(2, '0')}</span> <span className="text-[9px] text-slate-500 block uppercase">Hrs</span></div>
            <span className="text-slate-600">:</span>
            <div className="text-center"><span className="text-blue-400 text-base">{String(timeLeft.mins).padStart(2, '0')}</span> <span className="text-[9px] text-slate-500 block uppercase">Min</span></div>
            <span className="text-slate-600">:</span>
            <div className="text-center"><span className="text-blue-400 text-base">{String(timeLeft.secs).padStart(2, '0')}</span> <span className="text-[9px] text-slate-500 block uppercase">Sec</span></div>
          </div>
        </div>
      </div>

      <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm font-medium text-amber-400">
          <AlertTriangle size={18} />
          <span>Active Subject: <strong className="text-white">{activeSubject}</strong> — {targetStudyHours}-hour target yaad rakho!</span>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80">
          {(['On Track', 'Distracted', 'On Break'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setCurrentStatus(status)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentStatus === status 
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic What To Do Now Banner */}
      <div className="bg-gradient-to-r from-[#0b101d]/80 via-blue-950/70 to-[#0b101d]/80 backdrop-blur-xl border border-slate-700/50 text-white p-7 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-blue-400 font-bold mb-1">What To Do Now</div>
          {activeSlot ? (
            <>
              <h2 className="text-2xl font-black mb-1">{activeSlot.title}</h2>
              <p className="text-slate-400 text-xs">{activeSlot.startTime} - {activeSlot.endTime} • {activeSlot.description || activeSlot.type}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black mb-1 text-amber-400">No slots available</h2>
              <p className="text-slate-400 text-xs">Is waqt koi slot scheduled nahi hai. Naya slot add karein ya direct session shuru karein.</p>
            </>
          )}
        </div>

        {activeSlot ? (
          <button 
            onClick={() => {
              if (onStartSession) {
                onStartSession(activeSlot.title, activeSlot.durationMins || 25);
              }
              setCurrentTab('pomodoro');
            }}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <Play size={15} fill="white" /> Start Session <span className="text-[10px] opacity-75 block font-normal">Duration: {activeSlot.durationMins} Mins</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setCurrentTab('timetable')}
              className="px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Slot
            </button>
            <button 
              onClick={() => {
                if (onStartSession) {
                  onStartSession('Quick Study', 25);
                }
                setCurrentTab('pomodoro');
              }}
              className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Play size={15} fill="white" /> Quick Start (25m)
            </button>
          </div>
        )}
      </div>

      <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Video size={18} className="text-blue-400" /> AI Webcam Focus Tracker
          </div>
          <button 
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isCameraOn ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
          </button>
        </div>

        <div className="w-full h-80 bg-black/80 border border-slate-800/80 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ transform: 'scaleX(-1)' }}
            className={`w-full h-full object-contain rounded-2xl ${isCameraOn ? 'block' : 'hidden'}`} 
          />
          {!isCameraOn && (
            <p className="text-xs text-slate-500 p-4">Camera on karein — timer automatic shuru ho jayega. Break ke liye upar button dabayein.</p>
          )}
          {isCameraOn && (
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-emerald-400 text-xs font-mono flex items-center gap-2 border border-slate-700/50 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Camera Active - Monitoring Focus
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Timer size={16} className="text-blue-400" /> {targetStudyHours}-Hour Daily Target
            </h3>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold rounded-full">
              {currentStatus} {currentStatus === 'On Track' ? '🚀' : currentStatus === 'Distracted' ? '⚠️' : '☕'}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-blue-500/30 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-black text-white">{formatHours(studiedSeconds)}</span>
              <span className="text-[10px] text-slate-400">/ {targetStudyHours} hrs</span>
            </div>

            <div className="flex-1 space-y-3">
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Studied Hours</div>
                  <div className="text-base font-black text-white">{formatHours(studiedSeconds)} hrs</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setStudiedSeconds(p => Math.max(0, p - 600))} className="w-7 h-7 bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-700">-</button>
                  <button onClick={() => setStudiedSeconds(p => p + 600)} className="w-7 h-7 bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-700">+</button>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Wasted / Break Hours</div>
                  <div className="text-base font-black text-rose-400">{formatHours(wastedSeconds)} hrs</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setWastedSeconds(p => Math.max(0, p - 600))} className="w-7 h-7 bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-700">-</button>
                  <button onClick={() => setWastedSeconds(p => p + 600)} className="w-7 h-7 bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-700">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Which Subject Are You Doing Now?</h3>
            <p className="text-[11px] text-slate-500">Select active subject for real-time tracking</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(['PHYSICS', 'CHEMISTRY', 'MATHS', 'WASTED'] as const).map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubject(sub)}
                className={`py-3.5 px-4 rounded-2xl text-xs font-bold transition-all border ${
                  activeSubject === sub 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30' 
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="text-xs text-blue-400 font-medium bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex items-center gap-2">
            ⚡ Active Focus: Currently tracking <strong className="text-white">{activeSubject}</strong>.
          </div>
        </div>

      </div>

      <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <span className="text-slate-400">Productivity Score</span>
          <span className="text-white flex items-center gap-1 font-mono text-sm"><Trophy size={14} className="text-amber-400" /> {productivityScore} / 100</span>
        </div>
        <div className="w-full h-2.5 bg-slate-950/60 rounded-full overflow-hidden border border-slate-800/80">
          <div className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-500" style={{ width: `${productivityScore}%` }}></div>
        </div>
        <p className="text-[11px] text-slate-500">
          {productivityScore > 50 ? 'Great consistency! Keep pushing forward.' : 'Danger zone. Wasted hours are killing your score.'}
        </p>
      </div>

    </div>
  );
}