import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Chapter {
  id: string;
  name: string;
  type: string;
  completed: boolean;
}

export interface Subject {
  id: string;
  name: string;
  category: string;
  chapters: Chapter[];
  studiedHours: number;
}

export interface TimetableSlot {
  id: string;
  time: string;
  task: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
}

interface StudyContextType {
  userName: string;
  setUserName: (name: string) => void;
  boardName: string;
  setBoardName: (board: string) => void;
  categories: Category[];
  addCategory: (name: string) => void;
  editCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  subjects: Subject[];
  addSubject: (name: string, category: string) => void;
  deleteSubject: (id: string) => void;
  addChapter: (subjectId: string, chapterName: string, type?: string) => void;
  deleteChapter: (subjectId: string, chapterId: string) => void;
  toggleChapter: (sId: string, cId: string) => void;
  timetableSlots: TimetableSlot[];
  addTimetableSlot: (time: string, task: string, category: string) => void;
  deleteTimetableSlot: (id: string) => void;
  targetHours: number;
  setTargetHours: (hrs: number) => void;
  studiedHoursToday: number;
  wastedHoursToday: number;
  addStudiedTime: (mins: number) => void;
  addWastedTime: (mins: number) => void;
  setStudiedHoursToday: React.Dispatch<React.SetStateAction<number>>;
  setWastedHoursToday: React.Dispatch<React.SetStateAction<number>>;
  activeSubject: string;
  setActiveSubject: (name: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  targetLeft: number;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState(() => localStorage.getItem('study_user_name') || 'HAMID GAZALI');
  const [boardName, setBoardName] = useState(() => localStorage.getItem('study_board_name') || 'CBSE');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('study_api_key') || '');
  const [targetHours, setTargetHours] = useState(() => parseFloat(localStorage.getItem('study_target_hours') || '10'));

  const [categories, setCategories] = useState<Category[]>(() => 
    JSON.parse(localStorage.getItem('study_categories') || 'null') || [
      { id: '1', name: 'Class 11' },
      { id: '2', name: 'Class 12' }
    ]
  );

  const [subjects, setSubjects] = useState<Subject[]>(() => 
    JSON.parse(localStorage.getItem('study_subjects') || 'null') || [
      {
        id: 's1',
        name: 'Physics',
        category: 'Class 12',
        studiedHours: 0,
        chapters: [
          { id: 'c1', name: '01 Electric Charges', type: 'Theory', completed: false },
          { id: 'c2', name: '02 Electrostatic Potential', type: 'Theory', completed: false }
        ]
      },
      {
        id: 's2',
        name: 'Chemistry',
        category: 'Class 12',
        studiedHours: 0,
        chapters: [
          { id: 'c3', name: '01 Solutions', type: 'Theory', completed: false },
          { id: 'c4', name: '02 Electrochemistry', type: 'Theory', completed: false }
        ]
      },
      {
        id: 's3',
        name: 'Maths',
        category: 'Class 12',
        studiedHours: 0,
        chapters: [
          { id: 'c5', name: '01 Matrices', type: 'Theory', completed: false },
          { id: 'c6', name: '02 Determinants', type: 'Theory', completed: false }
        ]
      }
    ]
  );

  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(() => 
    JSON.parse(localStorage.getItem('study_timetable') || 'null') || [
      { id: 't1', time: '00:00 - 00:30', task: 'Wind Down & Sleep Prep', category: 'Class 12' },
      { id: 't2', time: '06:00 AM - 08:00 AM', task: 'Physics Electrostatics Practice', category: 'Class 12' }
    ]
  );

  const [studiedHoursToday, setStudiedHoursToday] = useState(() => parseFloat(localStorage.getItem('study_studied_hours') || '0.00'));
  const [wastedHoursToday, setWastedHoursToday] = useState(() => parseFloat(localStorage.getItem('study_wasted_hours') || '0.06'));
  const [activeSubject, setActiveSubject] = useState(() => localStorage.getItem('study_active_subject') || 'Physics');

  useEffect(() => {
    localStorage.setItem('study_user_name', userName);
    localStorage.setItem('study_board_name', boardName);
    localStorage.setItem('study_api_key', apiKey);
    localStorage.setItem('study_target_hours', targetHours.toString());
    localStorage.setItem('study_categories', JSON.stringify(categories));
    localStorage.setItem('study_subjects', JSON.stringify(subjects));
    localStorage.setItem('study_timetable', JSON.stringify(timetableSlots));
    localStorage.setItem('study_studied_hours', studiedHoursToday.toString());
    localStorage.setItem('study_wasted_hours', wastedHoursToday.toString());
    localStorage.setItem('study_active_subject', activeSubject);
  }, [userName, boardName, apiKey, targetHours, categories, subjects, timetableSlots, studiedHoursToday, wastedHoursToday, activeSubject]);

  const addCategory = (name: string) => {
    if (!name.trim()) return;
    setCategories(prev => [...prev, { id: Date.now().toString(), name: name.trim() }]);
  };

  const editCategory = (id: string, name: string) => {
    if (!name.trim()) return;
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name: name.trim() } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addSubject = (name: string, category: string) => {
    if (!name.trim()) return;
    setSubjects(prev => [...prev, { id: Date.now().toString(), name: name.trim(), category, studiedHours: 0, chapters: [] }]);
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const addChapter = (subjectId: string, chapterName: string, type: string = 'Theory') => {
    if (!chapterName.trim()) return;
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      return {
        ...s,
        chapters: [...s.chapters, { id: Date.now().toString(), name: chapterName.trim(), type, completed: false }]
      };
    }));
  };

  const deleteChapter = (subjectId: string, chapterId: string) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s;
      return {
        ...s,
        chapters: s.chapters.filter(c => c.id !== chapterId)
      };
    }));
  };

  const toggleChapter = (sId: string, cId: string) => {
    setSubjects(prev => prev.map(s => s.id !== sId ? s : {
      ...s,
      chapters: s.chapters.map(c => c.id === cId ? { ...c, completed: !c.completed } : c)
    }));
  };

  const addTimetableSlot = (time: string, task: string, category: string) => {
    setTimetableSlots(prev => [...prev, { id: Date.now().toString(), time, task, category }]);
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetableSlots(prev => prev.filter(s => s.id !== id));
  };

  const addStudiedTime = (mins: number) => {
    setStudiedHoursToday(prev => parseFloat((prev + mins / 60).toFixed(2)));
  };

  const addWastedTime = (mins: number) => {
    setWastedHoursToday(prev => parseFloat((prev + mins / 60).toFixed(2)));
  };

  const targetLeft = Math.max(0, parseFloat((targetHours - studiedHoursToday).toFixed(2)));

  return (
    <StudyContext.Provider value={{
      userName, setUserName, boardName, setBoardName,
      categories, addCategory, editCategory, deleteCategory,
      subjects, addSubject, deleteSubject, addChapter, deleteChapter, toggleChapter,
      timetableSlots, addTimetableSlot, deleteTimetableSlot,
      targetHours, setTargetHours, studiedHoursToday, wastedHoursToday,
      addStudiedTime, addWastedTime, setStudiedHoursToday, setWastedHoursToday,
      activeSubject, setActiveSubject, apiKey, setApiKey, targetLeft
    }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used within a StudyProvider');
  return ctx;
};