import React, { useState, useEffect } from 'react';
import { Settings, User, Key, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: {
    name: string;
    email: string;
    classTarget: string;
    examDate: string;
  };
  setUserProfile: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    classTarget: string;
    examDate: string;
  }>>;
}

export default function SettingsModal({ isOpen, onClose, userProfile, setUserProfile }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('studypulse_gemini_key') || '');
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('studypulse_gemini_key', apiKey);
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
            <Settings size={20} className="text-blue-600" /> Settings
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Profile Card */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-slate-800">{userProfile.name}</div>
              <div className="text-xs text-slate-500">{userProfile.email}</div>
            </div>
          </div>

          {/* Edit Profile Fields */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Manage Profile</h4>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Your Name</label>
              <input 
                type="text" 
                value={userProfile.name} 
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Class / Target Exam</label>
              <input 
                type="text" 
                value={userProfile.classTarget} 
                onChange={(e) => setUserProfile({...userProfile, classTarget: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Exam Target Date</label>
              <input 
                type="date" 
                value={userProfile.examDate} 
                onChange={(e) => setUserProfile({...userProfile, examDate: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Hidden Gemini API Configuration Accordion */}
          <div className="border-t border-slate-100 pt-4">
            <details className="group">
              <summary className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer list-none py-1">
                <span className="flex items-center gap-1.5"><Key size={14} /> Gemini API Configuration</span>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 space-y-2">
                <input 
                  type="password" 
                  placeholder="Enter Gemini API Key" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400">Stored securely in your browser's local storage.</p>
              </div>
            </details>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            {savedMessage ? <><Check size={14} /> Saved!</> : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}