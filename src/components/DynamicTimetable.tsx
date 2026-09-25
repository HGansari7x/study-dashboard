import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, CheckCircle2, Clock, Play, RotateCcw } from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  title: string;
  description: string;
  completed: boolean;
  type?: 'study' | 'break';
}

export default function DynamicTimetable() {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: '1', time: '09:00 AM - 11:00 AM', title: 'Maths / Physics (Fresh Mind Block)', description: 'High concentration block for heavy problem solving.', completed: false, type: 'study' },
    { id: '2', time: '11:00 AM - 11:30 AM', title: 'Chill Break', description: 'Relaxation and hydration break.', completed: false, type: 'break' },
    { id: '3', time: '11:30 AM - 01:00 PM', title: 'Physics / Theory Revision', description: 'Concept strengthening and formula revision.', completed: false, type: 'study' },
    { id: '4', time: '01:00 PM - 02:30 PM', title: 'Lunch & Long Rest Break', description: 'Midday meal and physical rest.', completed: false, type: 'break' },
    { id: '5', time: '02:30 PM - 04:30 PM', title: 'Chemistry (Organic / Physical)', description: 'Tackling reaction mechanisms and physical formulas.', completed: false, type: 'study' },
    { id: '6', time: '04:30 PM - 05:00 PM', title: 'Evening Snack Break', description: 'Snack time to recharge for the evening.', completed: false, type: 'break' },
    { id: '7', time: '05:00 PM - 06:00 PM', title: 'Chemistry / Numerical Practice', description: 'Solving numericals and final chemistry wrap-up.', completed: false, type: 'study' },
    { id: '8', time: '06:00 PM - 07:00 PM', title: 'Break & Fresh Air (Walk / Screen Break)', description: 'Physical movement, fresh air, and eyes rest.', completed: false, type: 'break' },
    { id: '9', time: '07:00 PM - 09:00 PM', title: 'Evening Focus Slot (Revision / Backlog)', description: 'Clearing pending backlogs and revising concepts.', completed: false, type: 'study' },
  ]);

  const [newTime, setNewTime] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');

  // Live time ticker for "What to do right now"
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Add custom slot
  const handleAddSlot = () => {
    if (!newTime.trim() || !newTitle.trim()) return;
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      time: newTime.trim(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      completed: false,
      type: 'study'
    };
    setSlots([...slots, newSlot]);
    setNewTime('');
    setNewTitle('');
    setNewDesc('');
  };

  // Delete slot
  const handleDeleteSlot = (id: string) => {
    setSlots(slots.filter(slot => slot.id !== id));
  };

  // Toggle completion
  const handleToggleComplete = (id: string) => {
    setSlots(slots.map(slot => slot.id === id ? { ...slot, completed: !slot.completed } : slot));
  };

  // Reset progress
  const handleResetProgress = () => {
    setSlots(slots.map(slot => ({ ...slot, completed: false })));
  };

  const completedCount = slots.filter(s => s.completed && s.type === 'study').length;
  const totalStudySlots = slots.filter(s => s.type === 'study').length;
  const progressPercent = totalStudySlots > 0 ? Math.round((completedCount / totalStudySlots) * 100) : 0;

  // Active or current slot suggestion for "What to do right now"
  const currentActiveSlot = slots.find(s => !s.completed) || slots[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-200 pb-12 relative p-4">
      
      {/* Top Header with Edit Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Daily Study Timetable</h2>
          <p className="text-xs text-slate-400">Target: Board Exam & Competitive Preparation</p>
        </div>

        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all shadow-md ${
            isEditMode 
              ? 'bg-emerald-600 border-emerald-500 text-white' 
              : 'bg-[#0b101d] border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Edit3 size={15} /> {isEditMode ? 'Done Editing' : 'Edit Mode'}
        </button>
      </div>

      {/* What To Do Right Now Banner */}
      {currentActiveSlot && (
        <div className="bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-[#0b101d] border border-blue-500/40 p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-bold text-blue-400 uppercase tracking-wider">
              <Clock size={14} /> WHAT TO DO RIGHT NOW ({currentTime})
            </div>
            <h3 className="text-sm font-extrabold text-white">{currentActiveSlot.title}</h3>
            <p className="text-xs text-slate-300 font-mono">{currentActiveSlot.time}</p>
            <p className="text-[11px] text-slate-400">{currentActiveSlot.description}</p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 bg-blue-900/40 border border-blue-500/30 text-blue-300 text-[10px] rounded-full font-semibold">
              {currentActiveSlot.type === 'break' ? 'Break Slot' : 'Study Slot'}
            </span>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5">
              <Play size={13} /> Start Timer
            </button>
          </div>
        </div>
      )}

      {/* Progress & Reset Header Bar */}
      <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-4 rounded-3xl shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-bold text-white">Today's Progress</span>
          <p className="text-xs text-slate-400">{completedCount} / {totalStudySlots} Study Slots ({progressPercent}%)</p>
        </div>
        <button 
          onClick={handleResetProgress}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Add Custom Routine Slot (Visible only in Edit Mode) */}
      {isEditMode && (
        <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-blue-500/40 p-5 rounded-3xl shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Add Custom Routine Slot</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input 
              type="text"
              placeholder="Time (e.g., 02:00 PM - 04:00 PM)"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <input 
              type="text"
              placeholder="Title (e.g., Physics Mock Test)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <input 
              type="text"
              placeholder="Description (Optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button 
              onClick={handleAddSlot}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Add Routine Slot
            </button>
          </div>
        </div>
      )}

      {/* Timetable Slots List */}
      <div className="space-y-3">
        {slots.map(slot => (
          <div 
            key={slot.id} 
            className={`bg-[#0b101d]/75 backdrop-blur-xl border p-4 rounded-3xl shadow-xl flex items-center justify-between gap-4 transition-all ${
              slot.completed ? 'border-emerald-500/30 opacity-75' : 'border-slate-700/50'
            }`}
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-blue-400 bg-blue-950/50 px-2.5 py-0.5 rounded-full border border-blue-900/50">
                  {slot.time}
                </span>
                {slot.type === 'break' && (
                  <span className="text-[10px] bg-amber-950/40 text-amber-300 px-2 py-0.5 rounded-full border border-amber-900/50">
                    Break
                  </span>
                )}
              </div>
              <h4 className={`text-xs font-bold ${slot.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                {slot.title}
              </h4>
              <p className="text-[11px] text-slate-400">{slot.description}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleToggleComplete(slot.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  slot.completed 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <CheckCircle2 size={14} /> {slot.completed ? 'Completed' : 'Mark Done'}
              </button>

              {isEditMode && (
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="text-rose-400 hover:text-rose-300 p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
                  title="Delete Slot"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}