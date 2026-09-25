import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Play, CheckCircle2, Edit3, RotateCcw } from 'lucide-react';

interface Slot {
  id: string;
  startTime: string; 
  endTime: string;   
  durationMins: number;
  title: string;
  description: string;
  type: 'Study' | 'Rest';
  completed: boolean;
}

interface TimetableProps {
  onStartSession: (title: string, durationMinutes: number) => void;
}

export default function Timetable({ onStartSession }: TimetableProps) {
  // Robust 12-hour to total minutes converter (e.g., "02:30 PM" -> 14*60 + 30 = 870 mins)
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

  const defaultSlots: Slot[] = [
    { id: '1', startTime: '12:00 AM', endTime: '07:00 AM', durationMins: 420, title: 'SLEEPING TIME', description: 'GOOD NIGHT', type: 'Rest', completed: false },
    { id: '2', startTime: '06:00 AM', endTime: '08:00 AM', durationMins: 120, title: 'Physics Advanced Problem Solving', description: 'Rotational Motion & Mechanics', type: 'Study', completed: false },
    { id: '3', startTime: '09:00 AM', endTime: '11:00 AM', durationMins: 120, title: 'Organic Chemistry Revision', description: 'Name reactions and mechanisms', type: 'Study', completed: false },
  ];

  const [slots, setSlots] = useState<Slot[]>(() => {
    const saved = localStorage.getItem('studypulse_timetable_slots');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a: Slot, b: Slot) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
        }
      } catch (e) { /* ignore */ }
    }
    return defaultSlots;
  });

  const [isEditingRoutine, setIsEditingRoutine] = useState(false);
  const [isAddingSlot, setIsAddingSlot] = useState(false);

  const [startHour, setStartHour] = useState('02');
  const [startMinute, setStartMinute] = useState('00');
  const [startAmPm, setStartAmPm] = useState('PM');

  const [endHour, setEndHour] = useState('04');
  const [endMinute, setEndMinute] = useState('00');
  const [endAmPm, setEndAmPm] = useState('PM');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slotType, setSlotType] = useState<'Study' | 'Rest'>('Study');

  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSlotType, setEditSlotType] = useState<'Study' | 'Rest'>('Study');

  // Force re-render every minute for live time tracking & active banner update
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('studypulse_timetable_slots', JSON.stringify(slots));
  }, [slots]);

  const calculateDurationMinutes = (sH: string, sM: string, sAP: string, eH: string, eM: string, eAP: string) => {
    const startTotalMins = parseTimeToMinutes(`${sH}:${sM} ${sAP}`);
    let endTotalMins = parseTimeToMinutes(`${eH}:${eM} ${eAP}`);

    let diff = endTotalMins - startTotalMins;
    if (diff <= 0) {
      diff += 24 * 60; // Handles cross-midnight durations
    }
    return diff;
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const startTimeFormatted = `${startHour}:${startMinute} ${startAmPm}`;
    const endTimeFormatted = `${endHour}:${endMinute} ${endAmPm}`;
    const duration = calculateDurationMinutes(startHour, startMinute, startAmPm, endHour, endMinute, endAmPm);

    const newSlot: Slot = {
      id: Date.now().toString(),
      startTime: startTimeFormatted,
      endTime: endTimeFormatted,
      durationMins: duration,
      title: title.trim(),
      description: description.trim(),
      type: slotType,
      completed: false,
    };

    setSlots(prev => {
      const updated = [...prev, newSlot].sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
      localStorage.setItem('studypulse_timetable_slots', JSON.stringify(updated));
      return updated;
    });

    setTitle('');
    setDescription('');
    setSlotType('Study');
    setIsAddingSlot(false);
  };

  const handleDeleteSlot = (id: string) => {
    setSlots(prev => {
      const updated = prev.filter(slot => slot.id !== id);
      localStorage.setItem('studypulse_timetable_slots', JSON.stringify(updated));
      return updated;
    });
    setEditingSlotId(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Kya aap saare slots reset karke default routine load karna chahte hain?")) {
      setSlots(defaultSlots);
      localStorage.setItem('studypulse_timetable_slots', JSON.stringify(defaultSlots));
    }
  };

  const handleStartEdit = (slot: Slot) => {
    setEditingSlotId(slot.id);
    setEditTitle(slot.title);
    setEditDescription(slot.description);
    setEditSlotType(slot.type);
  };

  const handleSaveEdit = (id: string) => {
    setSlots(prev => {
      const updated = prev.map(slot => {
        if (slot.id === id) {
          return { 
            ...slot, 
            title: editTitle, 
            description: editDescription, 
            type: editSlotType 
          };
        }
        return slot;
      });
      localStorage.setItem('studypulse_timetable_slots', JSON.stringify(updated));
      return updated;
    });
    setEditingSlotId(null);
  };

  const toggleComplete = (id: string) => {
    setSlots(prev => {
      const updated = prev.map(slot => slot.id === id ? { ...slot, completed: !slot.completed } : slot);
      localStorage.setItem('studypulse_timetable_slots', JSON.stringify(updated));
      return updated;
    });
  };

  // Accurate Active Slot Finder: Returns slot only if current time falls in range, else null
  const getCurrentActiveSlot = () => {
    if (!slots || slots.length === 0) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const slot of slots) {
      let startMins = parseTimeToMinutes(slot.startTime);
      let endMins = parseTimeToMinutes(slot.endTime);

      if (endMins <= startMins) {
        endMins += 24 * 60; // Crosses midnight
      }

      if (currentMinutes >= startMins && currentMinutes < endMins) {
        return slot;
      }
    }
    return null; // Return null if no slot matches current time so "No slots available" shows up
  };

  const currentBannerSlot = getCurrentActiveSlot();

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-200 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Daily Timetable & Routine</h1>
          <p className="text-xs text-slate-400 font-medium">Manage your structured study blocks and jump straight into live focus sessions.</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl border border-slate-700/50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
            title="Reset to default slots"
          >
            <RotateCcw size={14} /> Reset
          </button>

          <div className="flex items-center gap-2 bg-[#0b101d]/75 backdrop-blur-xl text-blue-400 px-4 py-2 rounded-2xl border border-slate-700/50 text-xs font-bold shadow-xl">
            <Clock size={16} />
            <span>{slots.length} Active Slots</span>
          </div>

          <button
            onClick={() => setIsEditingRoutine(!isEditingRoutine)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shadow-xl transition-all flex items-center gap-2 border ${
              isEditingRoutine 
                ? 'bg-blue-600 border-blue-500 text-white' 
                : 'bg-[#0b101d]/75 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800 text-white'
            }`}
          >
            <Edit3 size={16} /> {isEditingRoutine ? 'Done Editing' : 'Edit Routine'}
          </button>
        </div>
      </div>

      {/* Routine Management Panel */}
      {isEditingRoutine && (
        <div className="bg-[#0b101d]/75 backdrop-blur-xl text-white rounded-3xl p-6 shadow-xl border border-slate-700/50 animate-fadeIn space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Plus size={16} className="text-blue-400" /> Routine Management Panel
            </h2>
            <button
              onClick={() => setIsAddingSlot(!isAddingSlot)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus size={14} /> {isAddingSlot ? 'Close Add Form' : 'Add New Slot'}
            </button>
          </div>

          {isAddingSlot && (
            <form onSubmit={handleAddSlot} className="space-y-4 pt-4 border-t border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Start Timing</label>
                  <div className="flex items-center gap-2">
                    <select 
                      value={startHour} 
                      onChange={(e) => setStartHour(e.target.value)}
                      className="bg-slate-800 text-white text-xs font-semibold rounded-xl px-2 py-2 outline-none border border-slate-700"
                    >
                      {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span className="text-slate-400 font-bold">:</span>
                    <select 
                      value={startMinute} 
                      onChange={(e) => setStartMinute(e.target.value)}
                      className="bg-slate-800 text-white text-xs font-semibold rounded-xl px-2 py-2 outline-none border border-slate-700"
                    >
                      {['00','15','30','45'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select 
                      value={startAmPm} 
                      onChange={(e) => setStartAmPm(e.target.value)}
                      className="bg-blue-600 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none border border-blue-500"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">End Timing</label>
                  <div className="flex items-center gap-2">
                    <select 
                      value={endHour} 
                      onChange={(e) => setEndHour(e.target.value)}
                      className="bg-slate-800 text-white text-xs font-semibold rounded-xl px-2 py-2 outline-none border border-slate-700"
                    >
                      {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span className="text-slate-400 font-bold">:</span>
                    <select 
                      value={endMinute} 
                      onChange={(e) => setEndMinute(e.target.value)}
                      className="bg-slate-800 text-white text-xs font-semibold rounded-xl px-2 py-2 outline-none border border-slate-700"
                    >
                      {['00','15','30','45'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select 
                      value={endAmPm} 
                      onChange={(e) => setEndAmPm(e.target.value)}
                      className="bg-blue-600 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none border border-blue-500"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Slot Type</label>
                  <select
                    value={slotType}
                    onChange={(e) => setSlotType(e.target.value as 'Study' | 'Rest')}
                    className="w-full bg-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2.5 outline-none border border-slate-700 mt-1"
                  >
                    <option value="Study">📚 Study Slot</option>
                    <option value="Rest">☕ Rest / Break</option>
                  </select>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Session Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Physics Mock Test"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-white text-xs font-medium placeholder-slate-500 outline-none pt-1"
                    required
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Chapter 1 to 4 revision"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-transparent text-white text-xs font-medium placeholder-slate-500 outline-none pt-1"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Save Routine Slot
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* WHAT TO DO NOW BANNER */}
      {currentBannerSlot ? (
        <div className="bg-[#0b101d]/75 backdrop-blur-xl text-white rounded-3xl p-6 shadow-xl border border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">What to Do Now</span>
            <h2 className="text-xl font-black tracking-tight">{currentBannerSlot.title}</h2>
            <p className="text-xs text-slate-400 font-medium">
              {currentBannerSlot.startTime} - {currentBannerSlot.endTime} • {currentBannerSlot.description || currentBannerSlot.type}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {currentBannerSlot.type === 'Study' ? (
              <button
                onClick={() => onStartSession(currentBannerSlot.title, currentBannerSlot.durationMins)}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                <Play size={14} fill="currentColor" /> Start Session <span className="text-[10px] opacity-85 font-normal">({currentBannerSlot.durationMins} Mins)</span>
              </button>
            ) : (
              <div className="bg-slate-950/60 border border-slate-800/80 px-5 py-3 rounded-2xl text-xs font-bold text-slate-300">
                ☕ Relaxing Time ({currentBannerSlot.durationMins} Mins)
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#0b101d]/75 backdrop-blur-xl text-white rounded-3xl p-6 shadow-xl border border-slate-700/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">What to Do Now</span>
            <h2 className="text-xl font-black tracking-tight text-amber-400 mt-1">No slots available</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Is waqt koi slot scheduled nahi hai.</p>
          </div>
        </div>
      )}

      {/* Routine Slots List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Today's Schedule Slots</h3>
        
        {slots.length === 0 ? (
          <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 text-center text-slate-400 text-xs shadow-xl space-y-4">
            <p>No slots scheduled for today.</p>
            <button onClick={handleResetDefaults} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
              Load Default Slots
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {slots.map((slot) => {
              const hours = Math.floor(slot.durationMins / 60);
              const mins = slot.durationMins % 60;
              const durationText = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;
              const isEditing = editingSlotId === slot.id;

              return (
                <div 
                  key={slot.id}
                  className={`backdrop-blur-xl border rounded-3xl p-6 shadow-xl flex flex-col gap-4 transition-all text-white ${
                    slot.completed 
                      ? 'border-emerald-500/50 bg-emerald-950/30' 
                      : 'bg-[#0b101d]/75 border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <button 
                        onClick={() => toggleComplete(slot.id)}
                        className={`mt-1 p-2 rounded-2xl border transition-all ${
                          slot.completed 
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm' 
                            : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 size={18} />
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className="px-3 py-1 bg-slate-950/60 text-slate-300 rounded-xl text-xs font-bold border border-slate-800/80">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-950/60 text-blue-400 rounded-xl border border-slate-800/80">
                            Duration: {durationText}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl border ${
                            slot.type === 'Study' ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60' : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                          }`}>
                            {slot.type === 'Study' ? '📚 Study' : '☕ Rest'}
                          </span>
                        </div>

                        {isEditing ? (
                          <div className="space-y-3 mt-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white outline-none"
                                placeholder="Slot Title"
                              />
                              <select
                                value={editSlotType}
                                onChange={(e) => setEditSlotType(e.target.value as 'Study' | 'Rest')}
                                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                              >
                                <option value="Study">📚 Study Slot</option>
                                <option value="Rest">☕ Rest / Break</option>
                              </select>
                            </div>
                            <input
                              type="text"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 outline-none"
                              placeholder="Description"
                            />
                          </div>
                        ) : (
                          <>
                            <h4 className={`text-base font-bold ${slot.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                              {slot.title}
                            </h4>
                            {slot.description && (
                              <p className="text-xs text-slate-400 mt-0.5">{slot.description}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                      {slot.type === 'Study' && !isEditing && (
                        <button
                          onClick={() => onStartSession(slot.title, slot.durationMins)}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                        >
                          <Play size={14} fill="currentColor" /> Start Session
                        </button>
                      )}

                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveEdit(slot.id)}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSlotId(null)}
                            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold transition-all border border-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        isEditingRoutine && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEdit(slot)}
                              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 shadow-md"
                            >
                              <Edit3 size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="p-2.5 bg-rose-950/50 text-rose-400 hover:bg-rose-900/60 rounded-2xl border border-rose-800/60 transition-all"
                              title="Delete Slot"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}