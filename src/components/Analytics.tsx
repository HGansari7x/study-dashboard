import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart3, TrendingUp, Clock, Award } from 'lucide-react';

const studyData = [
  { day: 'Mon', hours: 4.5 },
  { day: 'Tue', hours: 6.0 },
  { day: 'Wed', hours: 3.5 },
  { day: 'Thu', hours: 5.5 },
  { day: 'Fri', hours: 7.0 },
  { day: 'Sat', hours: 8.2 },
  { day: 'Sun', hours: 5.0 },
];

export default function Analytics() {
  const totalHours = studyData.reduce((acc, curr) => acc + curr.hours, 0);
  const avgHours = (totalHours / studyData.length).toFixed(1);

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] rounded-3xl border border-slate-700/50 bg-[#0b101d]/75 backdrop-blur-xl shadow-xl overflow-y-auto text-slate-200 p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-950/60 border border-blue-800/50 text-blue-400">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Study Analytics & Trends
            </h2>
            <p className="text-xs text-slate-400">Track your daily focus hours and productivity performance</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Study Time (This Week)</p>
            <h3 className="text-xl font-bold text-white">{totalHours} Hours</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Daily Average</p>
            <h3 className="text-xl font-bold text-white">{avgHours} Hrs / day</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Productivity Score</p>
            <h3 className="text-xl font-bold text-white">92% (High)</h3>
          </div>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/70 shadow-lg flex-1 min-h-[300px] flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Weekly Study Hours Breakdown</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={studyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
              />
              <Bar dataKey="hours" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}