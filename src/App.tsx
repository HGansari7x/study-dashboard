import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, Calendar, 
  Bot, Timer, Clock, Smartphone, Settings, BarChart3, Flame 
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import SyllabusTracker from './components/SyllabusTracker';
import PomodoroTimer from './components/PomodoroTimer';
import Timetable from './components/Timetable';
import Stopwatch from './components/Stopwatch';
import AIMentor from './components/AIMentor';
import Progress from './components/Progress';
import Analytics from './components/Analytics';
import StudySuite from './components/StudySuite';
import SettingsModal from './components/SettingsModal';
import { StudyProvider } from './components/StudyContext';

function MainApp() {
  // App load hote hi secure environment variable se API key check karke localStorage mein save karna
  useEffect(() => {
    const existingKey = localStorage.getItem('studypulse_gemini_api_key');
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!existingKey && envKey) {
      localStorage.setItem('studypulse_gemini_api_key', envKey);
    }
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('studypulse_auth') === 'true';
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('studypulse_profile');
    return saved ? JSON.parse(saved) : { 
      name: 'سہراب مصباحی', 
      email: 'sohrab@gmail.com', 
      classTarget: 'Class 12 - JEE/Boards', 
      examDate: '2027-02-15' 
    };
  });

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [totalStudyMinutes, setTotalStudyMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('studypulse_total_mins');
    return saved ? Number(saved) : 0;
  });

  // Timetable ke Study slots se total target hours calculate karne ka state
  const [targetStudyHours, setTargetStudyHours] = useState<number>(10);

  // Pomodoro settings state
  const [pomodoroSettings, setPomodoroSettings] = useState<{ duration: number; autoStart: boolean }>({
    duration: 25,
    autoStart: false
  });

  // Har baar jab timetable update ho ya app load ho, Study slots ka duration calculate karein
  useEffect(() => {
    const calculateTargetFromTimetable = () => {
      const savedSlots = localStorage.getItem('studypulse_timetable_slots');
      if (savedSlots) {
        try {
          const slots = JSON.parse(savedSlots);
          const totalStudyMins = slots
            .filter((slot: any) => !slot.type || slot.type === 'Study')
            .reduce((acc: number, slot: any) => acc + (slot.durationMins || 0), 0);
          
          if (totalStudyMins > 0) {
            setTargetStudyHours(parseFloat((totalStudyMins / 60).toFixed(1)));
          }
        } catch (e) {
          console.error("Error parsing timetable slots", e);
        }
      }
    };

    calculateTargetFromTimetable();
  }, [currentTab]);

  useEffect(() => {
    localStorage.setItem('studypulse_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('studypulse_total_mins', totalStudyMinutes.toString());
  }, [totalStudyMinutes]);

  const handleGoogleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('studypulse_auth', 'true');
  };

  const handleStartSession = (_slotTitle: string, durationMinutes: number) => {
    setTotalStudyMinutes(prev => prev + durationMinutes);
    
    setPomodoroSettings({
      duration: durationMinutes > 0 ? durationMinutes : 25,
      autoStart: true
    });

    setCurrentTab('pomodoro');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md mb-6">
            <BookOpen size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">StudyPulse Console</h1>
          <p className="text-slate-500 text-sm mb-8">Universal Student Accountability & Productivity System</p>
          
          <button 
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm text-slate-700 font-medium flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          {userProfile.name}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-700 transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'syllabus', label: 'Syllabus Tracker', icon: BookOpen },
            { id: 'timetable', label: 'Timetable', icon: Calendar },
            { id: 'ai-mentor', label: 'AI Mentor', icon: Bot },
            { id: 'pomodoro', label: 'Pomodoro Timer', icon: Timer },
            { id: 'stopwatch', label: 'Stopwatch', icon: Clock },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'studysuite', label: 'Study Suite & AI', icon: Flame },
            { id: 'progress', label: 'Progress', icon: Smartphone }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {currentTab === 'dashboard' && (
            <Dashboard 
              userProfile={userProfile} 
              setCurrentTab={setCurrentTab} 
              totalStudyMinutes={totalStudyMinutes} 
              targetStudyHours={targetStudyHours} 
            />
          )}
          {currentTab === 'syllabus' && <SyllabusTracker />}
          {currentTab === 'timetable' && <Timetable onStartSession={handleStartSession} />}
          {currentTab === 'ai-mentor' && <AIMentor />}
          {currentTab === 'pomodoro' && (
            <PomodoroTimer 
              initialMinutes={pomodoroSettings.duration} 
              autoStart={pomodoroSettings.autoStart} 
            />
          )}
          {currentTab === 'stopwatch' && <Stopwatch />}
          {currentTab === 'analytics' && <Analytics />}
          {currentTab === 'studysuite' && <StudySuite />}
          {currentTab === 'progress' && <Progress />}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        userProfile={userProfile} 
        setUserProfile={setUserProfile} 
      />

    </div>
  );
}

// Root App component wrapping everything inside StudyProvider
export default function App() {
  return (
    <StudyProvider>
      <MainApp />
    </StudyProvider>
  );
}