import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, BookOpen, Target, Award, Clock } from 'lucide-react';

interface Chapter {
  id: string;
  name: string;
  lecture: boolean;
  ncert: boolean;
  pyqs: boolean;
  revision: boolean;
}

interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

interface ClassData {
  id: string;
  name: string;
  subjects: Subject[];
}

export default function Progress() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [activeClassId, setActiveClassId] = useState<string>('');
  
  const [currentStatus, setCurrentStatus] = useState<string>('On Track');
  const [todayStudySeconds, setTodayStudySeconds] = useState<number>(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('studypulse_syllabus_classes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClasses(parsed);
          setActiveClassId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error("Error loading progress data:", e);
    }

    const updateFromStorage = () => {
      const savedStatus = localStorage.getItem('studypulse_current_status');
      if (savedStatus) {
        setCurrentStatus(savedStatus);
      }

      // Sari possible storage keys check kar rahe hain jahan timer/camera time save ho sakta hai
      const possibleKeys = [
        'studypulse_total_study_seconds',
        'study_seconds_today',
        'studypulse_today_seconds',
        'totalStudySeconds',
        'today_study_time',
        'study_time',
        'todaysStudyTime'
      ];

      let foundSeconds = 0;
      for (const key of possibleKeys) {
        const val = localStorage.getItem(key);
        if (val) {
          const num = Number(val);
          if (!isNaN(num) && num > 0) {
            foundSeconds = num;
            break;
          }
        }
      }
      setTodayStudySeconds(foundSeconds);
    };

    updateFromStorage();

    window.addEventListener('storage', updateFromStorage);
    const interval = setInterval(updateFromStorage, 500);

    return () => {
      window.removeEventListener('storage', updateFromStorage);
      clearInterval(interval);
    };
  }, []);

  const activeClass = classes.find(c => c.id === activeClassId) || classes[0];
  const subjects = activeClass?.subjects || [];

  let totalChapters = 0;
  let totalTasks = 0;
  let completedTasks = 0;

  let lecturesDone = 0;
  let totalLectures = 0;

  let ncertDone = 0;
  let totalNcert = 0;

  let pyqsDone = 0;
  let totalPyqs = 0;

  let revisionDone = 0;
  let totalRevision = 0;

  subjects.forEach(sub => {
    sub.chapters.forEach(ch => {
      totalChapters += 1;
      totalTasks += 4;

      totalLectures += 1;
      totalNcert += 1;
      totalPyqs += 1;
      totalRevision += 1;

      if (ch.lecture) { completedTasks += 1; lecturesDone += 1; }
      if (ch.ncert) { completedTasks += 1; ncertDone += 1; }
      if (ch.pyqs) { completedTasks += 1; pyqsDone += 1; }
      if (ch.revision) { completedTasks += 1; revisionDone += 1; }
    });
  });

  const overallPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const formatStudyTime = (totalSeconds: number) => {
    if (!totalSeconds || totalSeconds <= 0) return '0 mins';
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins} mins`;
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'Distracted':
        return 'Distracted ⚠️';
      case 'On Break':
        return 'On Break ☕';
      default:
        return overallPercent > 50 ? 'On Track 🚀' : 'Keep Pushing 💪';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-200 pb-12 p-4 font-sans">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="text-amber-400" size={24} /> Study Progress Dashboard
          </h2>
          <p className="text-xs text-slate-400">Aapke syllabus completion ka live overview</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {classes.map(cls => (
            <button
              key={cls.id}
              onClick={() => setActiveClassId(cls.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeClassId === cls.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-[#0b101d] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0b101d]/85 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Overall Completion</span>
            <h3 className="text-2xl font-black text-white mt-1">{overallPercent}% Done</h3>
          </div>
          <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400">
            <Target size={28} />
          </div>
        </div>

        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700" style={{ width: `${overallPercent}%` }}></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Total Chapters</div>
            <div className="data-val text-sm font-bold text-white mt-1">{totalChapters}</div>
          </div>
          <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Tasks Completed</div>
            <div className="data-val text-sm font-bold text-emerald-400 mt-1">{completedTasks} / {totalTasks}</div>
          </div>
          <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Active Subjects</div>
            <div className="data-val text-sm font-bold text-white mt-1">{subjects.length}</div>
          </div>
          <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <Clock size={12} className="text-amber-400" /> Hours Studied
            </div>
            <div className="data-val text-sm font-bold text-amber-400 mt-1">{formatStudyTime(todayStudySeconds)}</div>
          </div>
          <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/80 col-span-2 md:col-span-1">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide">Status</div>
            <div className="data-val text-sm font-bold text-blue-400 mt-1">{getStatusDisplay(currentStatus)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-5 rounded-3xl space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span>Lectures Watched</span>
            <span className="text-blue-400">{lecturesDone} / {totalLectures}</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${totalLectures ? (lecturesDone/totalLectures)*100 : 0}%` }}></div>
          </div>
        </div>

        <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-5 rounded-3xl space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span>NCERT Reading</span>
            <span className="text-emerald-400">{ncertDone} / {totalNcert}</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${totalNcert ? (ncertDone/totalNcert)*100 : 0}%` }}></div>
          </div>
        </div>

        <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-5 rounded-3xl space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span>PYQs Solved</span>
            <span className="text-amber-400">{pyqsDone} / {totalPyqs}</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-amber-500 transition-all" style={{ width: `${totalPyqs ? (pyqsDone/totalPyqs)*100 : 0}%` }}></div>
          </div>
        </div>

        <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-5 rounded-3xl space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span>Revisions Done</span>
            <span className="text-purple-400">{revisionDone} / {totalRevision}</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-purple-500 transition-all" style={{ width: `${totalRevision ? (revisionDone/totalRevision)*100 : 0}%` }}></div>
          </div>
        </div>

      </div>

      <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">Subject Wise Breakdown</h3>
        
        <div className="space-y-4">
          {subjects.map(sub => {
            const subTotal = sub.chapters.length * 4;
            const subDone = sub.chapters.reduce((acc, ch) => {
              return acc + (ch.lecture ? 1 : 0) + (ch.ncert ? 1 : 0) + (ch.pyqs ? 1 : 0) + (ch.revision ? 1 : 0);
            }, 0);
            const subPercent = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0;

            return (
              <div key={sub.id} className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{sub.name}</span>
                  <span className="font-mono text-slate-400">{subDone} / {subTotal} tasks ({subPercent}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${subPercent}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}