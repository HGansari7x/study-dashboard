import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ClipboardList, TrendingUp, Award, AlertTriangle } from 'lucide-react';

interface MockTest {
  id: string;
  name: string;
  physics: number;
  chemistry: number;
  maths: number;
  total: number;
  maxTotal: number;
  date: string;
}

export default function TestScoreAnalyzer() {
  const [tests, setTests] = useLocalStorage<MockTest[]>('hg_mock_tests', []);
  const [name, setName] = useState('');
  const [physics, setPhysics] = useState('');
  const [chemistry, setChemistry] = useState('');
  const [maths, setMaths] = useState('');
  const [maxTotal, setMaxTotal] = useState('300');

  const addTest = () => {
    if (!name.trim()) return;
    const p = parseFloat(physics) || 0;
    const c = parseFloat(chemistry) || 0;
    const m = parseFloat(maths) || 0;
    const mt = parseFloat(maxTotal) || 300;
    setTests([
      ...tests,
      {
        id: Date.now().toString(),
        name: name.trim(),
        physics: p,
        chemistry: c,
        maths: m,
        total: p + c + m,
        maxTotal: mt,
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    setName('');
    setPhysics('');
    setChemistry('');
    setMaths('');
  };

  const deleteTest = (id: string) => setTests(tests.filter((t) => t.id !== id));

  const avgPct = tests.length
    ? Math.round((tests.reduce((sum, t) => sum + t.total / t.maxTotal, 0) / tests.length) * 100)
    : 0;

  const weakest = tests.length
    ? (['physics', 'chemistry', 'maths'] as const).reduce((weak, subj) => {
        const avg = tests.reduce((s, t) => s + t[subj], 0) / tests.length;
        return avg < tests.reduce((s, t) => s + t[weak], 0) / tests.length ? subj : weak;
      }, 'physics' as 'physics' | 'chemistry' | 'maths')
    : null;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      {tests.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase">Avg Score</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{avgPct}%</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Award className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase">Best Test</span>
            </div>
            <p className="mt-2 text-lg font-bold text-emerald-400">
              {tests.reduce((best, t) => (t.total / t.maxTotal > best.total / best.maxTotal ? t : best)).name}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase">Weakest Subject</span>
            </div>
            <p className="mt-2 text-lg font-bold text-amber-400 capitalize">{weakest}</p>
          </div>
        </div>
      )}

      {/* Add test form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex items-center gap-2 text-slate-400">
          <ClipboardList className="h-5 w-5" />
          <h2 className="text-sm font-semibold uppercase tracking-wide">Log a Mock Test</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Test name"
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            value={physics}
            onChange={(e) => setPhysics(e.target.value)}
            placeholder="Physics"
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            value={chemistry}
            onChange={(e) => setChemistry(e.target.value)}
            placeholder="Chemistry"
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            value={maths}
            onChange={(e) => setMaths(e.target.value)}
            placeholder="Maths"
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            value={maxTotal}
            onChange={(e) => setMaxTotal(e.target.value)}
            placeholder="Max total"
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={addTest}
          className="mt-3 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Add Test
        </button>
      </div>

      {/* Test list */}
      {tests.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800 bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-400">Test</th>
                <th className="px-4 py-3 text-center font-semibold text-blue-400">Physics</th>
                <th className="px-4 py-3 text-center font-semibold text-emerald-400">Chemistry</th>
                <th className="px-4 py-3 text-center font-semibold text-amber-400">Maths</th>
                <th className="px-4 py-3 text-center font-semibold text-white">Total</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-400">%</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {tests.map((t) => {
                const pct = Math.round((t.total / t.maxTotal) * 100);
                return (
                  <tr key={t.id} className="hover:bg-slate-800/20">
                    <td className="px-4 py-3 font-medium text-slate-200">{t.name}</td>
                    <td className="px-4 py-3 text-center text-blue-300">{t.physics}</td>
                    <td className="px-4 py-3 text-center text-emerald-300">{t.chemistry}</td>
                    <td className="px-4 py-3 text-center text-amber-300">{t.maths}</td>
                    <td className="px-4 py-3 text-center font-bold text-white">{t.total}/{t.maxTotal}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${pct >= 70 ? 'text-emerald-400' : pct >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                        {pct}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteTest(t.id)}
                        className="text-slate-600 hover:text-red-400"
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
