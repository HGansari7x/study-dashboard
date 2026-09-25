import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, ChevronRight, ChevronDown, Trophy } from 'lucide-react';

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

const DEFAULT_CLASSES: ClassData[] = [
  {
    id: 'class-12',
    name: 'Class 12',
    subjects: [
      {
        id: 'sub-1',
        name: 'Physics',
        chapters: [
          { id: 'chap-1', name: 'Electric Charges and Fields', lecture: false, ncert: false, pyqs: false, revision: false },
          { id: 'chap-2', name: 'Current Electricity', lecture: false, ncert: false, pyqs: false, revision: false }
        ]
      },
      {
        id: 'sub-2',
        name: 'Chemistry',
        chapters: [
          { id: 'chap-3', name: 'Solutions', lecture: false, ncert: false, pyqs: false, revision: false }
        ]
      }
    ]
  }
];

export default function SyllabusTracker() {
  const [classes, setClasses] = useState<ClassData[]>(() => {
    try {
      const saved = localStorage.getItem('studypulse_syllabus_classes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Storage load error:", e);
    }
    return DEFAULT_CLASSES;
  });

  const [activeClassId, setActiveClassId] = useState<string>(() => {
    return classes[0]?.id || 'class-12';
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [expandedChapters, setExpandedChapters] = useState<{ [key: string]: boolean }>({});
  
  const [newSubjectName, setNewSubjectName] = useState<string>('');
  const [newChapterNames, setNewChapterNames] = useState<{ [key: string]: string }>({});
  const [newClassName, setNewClassName] = useState<string>('');
  const [showAddClassModal, setShowAddClassModal] = useState<boolean>(false);

  // Sync with LocalStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('studypulse_syllabus_classes', JSON.stringify(classes));
    } catch (e) {
      console.error("Storage save error:", e);
    }
  }, [classes]);

  const activeClass = classes.find(c => c.id === activeClassId) || classes[0] || DEFAULT_CLASSES[0];
  const subjectsList = activeClass?.subjects || [];

  const toggleChapterExpand = (chapId: string) => {
    setExpandedChapters(prev => ({ ...prev, [chapId]: !prev[chapId] }));
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    const updated = classes.map(cls => {
      if (cls.id === activeClassId) {
        return {
          ...cls,
          subjects: [...(cls.subjects || []), { id: 'sub-' + Date.now(), name: newSubjectName.trim(), chapters: [] }]
        };
      }
      return cls;
    });
    setClasses(updated);
    setNewSubjectName('');
  };

  const handleDeleteSubject = (subId: string) => {
    const updated = classes.map(cls => {
      if (cls.id === activeClassId) {
        return {
          ...cls,
          subjects: (cls.subjects || []).filter(s => s.id !== subId)
        };
      }
      return cls;
    });
    setClasses(updated);
  };

  const handleAddChapter = (subId: string) => {
    const chapName = newChapterNames[subId];
    if (!chapName || !chapName.trim()) return;

    const updated = classes.map(cls => {
      if (cls.id === activeClassId) {
        return {
          ...cls,
          subjects: (cls.subjects || []).map(sub => {
            if (sub.id === subId) {
              return {
                ...sub,
                chapters: [
                  ...(sub.chapters || []),
                  { id: 'chap-' + Date.now(), name: chapName.trim(), lecture: false, ncert: false, pyqs: false, revision: false }
                ]
              };
            }
            return sub;
          })
        };
      }
      return cls;
    });

    setClasses(updated);
    setNewChapterNames({ ...newChapterNames, [subId]: '' });
  };

  const handleDeleteChapter = (subId: string, chapId: string) => {
    const updated = classes.map(cls => {
      if (cls.id === activeClassId) {
        return {
          ...cls,
          subjects: (cls.subjects || []).map(sub => {
            if (sub.id === subId) {
              return {
                ...sub,
                chapters: (sub.chapters || []).filter(ch => ch.id !== chapId)
              };
            }
            return sub;
          })
        };
      }
      return cls;
    });
    setClasses(updated);
  };

  const handleToggleCheckbox = (subId: string, chapId: string, field: 'lecture' | 'ncert' | 'pyqs' | 'revision') => {
    const updated = classes.map(cls => {
      if (cls.id === activeClassId) {
        return {
          ...cls,
          subjects: (cls.subjects || []).map(sub => {
            if (sub.id === subId) {
              return {
                ...sub,
                chapters: (sub.chapters || []).map(ch => {
                  if (ch.id === chapId) {
                    return { ...ch, [field]: !ch[field] };
                  }
                  return ch;
                })
              };
            }
            return sub;
          })
        };
      }
      return cls;
    });
    setClasses(updated);
  };

  const handleCreateClass = () => {
    if (!newClassName.trim()) return;
    const newId = 'class-' + Date.now();
    const updated = [...classes, { id: newId, name: newClassName.trim(), subjects: [] }];
    setClasses(updated);
    setActiveClassId(newId);
    setNewClassName('');
    setShowAddClassModal(false);
  };

  const handleDeleteClass = (classId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (classes.length <= 1) {
      alert("Kam se kam ek class honi zaroori hai!");
      return;
    }
    const updatedClasses = classes.filter(cls => cls.id !== classId);
    setClasses(updatedClasses);
    if (activeClassId === classId) {
      setActiveClassId(updatedClasses[0].id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-200 pb-12 relative p-4 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {classes.map(cls => (
            <div
              key={cls.id}
              onClick={() => setActiveClassId(cls.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeClassId === cls.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-[#0b101d] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{cls.name}</span>
              {isEditMode && classes.length > 1 && (
                <button
                  onClick={(e) => handleDeleteClass(cls.id, e)}
                  className="text-rose-300 hover:text-rose-100 p-0.5 ml-1 rounded transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}

          <button 
            onClick={() => setShowAddClassModal(true)}
            className="w-10 h-10 bg-[#0b101d] hover:bg-slate-800 border border-slate-700/80 rounded-xl flex items-center justify-center text-blue-400 hover:text-white transition-all shadow-sm"
          >
            <Plus size={18} />
          </button>
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

      {showAddClassModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-slate-700 p-6 rounded-3xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Add New Class / Category</h3>
            <input 
              type="text" 
              placeholder="e.g., Dropper Batch, Revision..." 
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowAddClassModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateClass}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
              >
                Create Class
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjectsList.map(sub => {
          const chapters = sub.chapters || [];
          const totalTasks = chapters.length * 4;
          const completedTasks = chapters.reduce((acc, ch) => {
            return acc + (ch.lecture ? 1 : 0) + (ch.ncert ? 1 : 0) + (ch.pyqs ? 1 : 0) + (ch.revision ? 1 : 0);
          }, 0);
          const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return (
            <div key={sub.id} className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-5 rounded-3xl shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{sub.name}</h4>
                {isEditMode && (
                  <button onClick={() => handleDeleteSubject(sub.id)} className="text-rose-400 hover:text-rose-300">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="text-sm font-black text-slate-200">
                {completedTasks} / {totalTasks} <span className="text-[10px] text-slate-400 font-normal">tasks</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${percent}%` }}></div>
              </div>
              <div className="text-[10px] text-slate-400">{percent}% complete</div>
            </div>
          );
        })}
      </div>

      {isEditMode && (
        <div className="bg-[#0b101d]/75 backdrop-blur-xl border border-blue-500/40 p-4 rounded-3xl shadow-xl flex items-center gap-3">
          <input 
            type="text"
            placeholder="Add new subject (e.g., Biology, Organic Chemistry)..."
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <button 
            onClick={handleAddSubject}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <Plus size={16} /> Add Subject
          </button>
        </div>
      )}

      {/* Chapters List */}
      <div className="space-y-6">
        {subjectsList.map(sub => (
          <div key={sub.id} className="bg-[#0b101d]/75 backdrop-blur-xl border border-slate-700/50 p-5 rounded-3xl shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white">{sub.name}</h3>
              <span className="text-[11px] text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                {(sub.chapters || []).length} chapters
              </span>
            </div>

            <div className="space-y-2">
              {(sub.chapters || []).map((chap, index) => {
                const isExpanded = expandedChapters[chap.id];
                const completedCount = (chap.lecture ? 1 : 0) + (chap.ncert ? 1 : 0) + (chap.pyqs ? 1 : 0) + (chap.revision ? 1 : 0);

                return (
                  <div key={chap.id} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden transition-all">
                    <div 
                      onClick={() => toggleChapterExpand(chap.id)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/40"
                    >
                      <div className="flex items-center gap-3">
                        <button className="text-slate-400">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <span className="text-xs font-mono text-slate-500">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-xs font-medium text-slate-200">{chap.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-slate-400">{completedCount}/4</span>
                        {isEditMode && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteChapter(sub.id, chap.id); }}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-5 py-3 bg-slate-900/50 border-t border-slate-800/60 flex items-center gap-6 text-xs text-slate-300">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                          <input 
                            type="checkbox" 
                            checked={chap.lecture} 
                            onChange={() => handleToggleCheckbox(sub.id, chap.id, 'lecture')}
                            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                          /> Lecture
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                          <input 
                            type="checkbox" 
                            checked={chap.ncert} 
                            onChange={() => handleToggleCheckbox(sub.id, chap.id, 'ncert')}
                            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                          /> NCERT
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                          <input 
                            type="checkbox" 
                            checked={chap.pyqs} 
                            onChange={() => handleToggleCheckbox(sub.id, chap.id, 'pyqs')}
                            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                          /> PYQs
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                          <input 
                            type="checkbox" 
                            checked={chap.revision} 
                            onChange={() => handleToggleCheckbox(sub.id, chap.id, 'revision')}
                            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                          /> Revision
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {isEditMode && (
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="text"
                  placeholder={`Add chapter to ${sub.name}...`}
                  value={newChapterNames[sub.id] || ''}
                  onChange={(e) => setNewChapterNames({ ...newChapterNames, [sub.id]: e.target.value })}
                  className="flex-1 bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button 
                  onClick={() => handleAddChapter(sub.id)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-2xl shadow transition-all shrink-0"
                >
                  Add Chapter
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}