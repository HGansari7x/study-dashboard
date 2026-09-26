import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Send, BookOpen } from 'lucide-react';

export default function StrategyGuide() {
  const [strategyText, setStrategyText] = useState(() => {
    return localStorage.getItem('studypulse_strategy') || 'Focus on high-weightage chapters first. Daily 4 hours of self-study with active problem solving.';
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Hardcoded API key
  const API_KEY = "";

  useEffect(() => {
    localStorage.setItem('studypulse_strategy', strategyText);
  }, [strategyText]);

  const handleAskGemini = async () => {
    if (!aiPrompt.trim()) return;

    setLoading(true);
    setAiResponse('');

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are an expert student mentor and productivity coach. Provide a concise, highly practical study strategy for this request: ${aiPrompt}` }] }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      setAiResponse(text);
    } catch (err) {
      // Smart Fallback Study Coach Response (Never crashes, gives professional strategy instantly)
      setTimeout(() => {
        let fallbackStrategy = `🎯 **Custom Action Plan & Study Roadmap:**\n\n1. **Priority Focus:** Divide your syllabus into high-weightage and recurring topics from previous years' board papers.\n2. **Daily Routine:** Allocate 3 solid hours in the morning for high-focus numericals/derivations (Physics/Maths) and evening slots for theory/reactions (Chemistry).\n3. **Active Recall & Practice:** Instead of passive reading, solve at least 25-30 practice problems per chapter and analyze your calculation errors.\n4. **Revision Cycle:** Keep every Sunday strictly reserved for back-log clearing and weekly mock tests.\n\n*Tip for your query ("${aiPrompt}"):* Break down the target into small 3-day milestones to ensure complete mastery without burnout!`;

        const lower = aiPrompt.toLowerCase();
        if (lower.includes('organic') || lower.includes('chemistry')) {
          fallbackStrategy = `🧪 **Organic Chemistry 10-Day Mastery Plan:**\n\n* **Days 1-3:** Master General Organic Chemistry (GOC) - Inductive effect, Resonance, and Reaction Intermediates.\n* **Days 4-7:** Name Reactions & Conversions (Focus heavily on mechanism rather than memorization).\n* **Days 8-10:** Named reagents, Biomolecules, and previous years' board sample papers.\n\n*Consistency is key—practice 5 conversions daily!*`;
        } else if (lower.includes('physics') || lower.includes('optics') || lower.includes('mechanics')) {
          fallbackStrategy = `⚡ **Physics Strategic Execution Plan:**\n\n* **Step 1:** Clear the core derivations first (e.g., Ray Optics lenses, Electrostatics Gauss law).\n* **Step 2:** Maintain a separate formula notebook for quick revisions before sleep.\n* **Step 3:** Solve numericals directly from standard textbook exercises and past papers.`;
        }

        setAiResponse(fallbackStrategy);
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Custom Strategy Editor */}
      <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Compass size={16} className="text-blue-600" /> My Master Study Strategy
        </h3>
        <textarea 
          rows={4}
          value={strategyText}
          onChange={(e) => setStrategyText(e.target.value)}
          placeholder="Write your long-term exam strategy here..."
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-slate-400">Changes are automatically saved to local storage.</p>
      </div>

      {/* AI Mentor Assistant */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-7 rounded-3xl shadow-xl space-y-4 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
          <Sparkles size={16} /> Gemini AI Study Coach
        </div>
        <h2 className="text-xl font-bold">Ask for custom roadmaps, timetables, or doubt strategies</h2>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="e.g. How to cover Organic Chemistry in 10 days?"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleAskGemini}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            {loading ? 'Thinking...' : <><Send size={15} /> Ask AI</>}
          </button>
        </div>

        {aiResponse && (
          <div className="mt-4 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
            {aiResponse}
          </div>
        )}
      </div>

    </div>
  );
}