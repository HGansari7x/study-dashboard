import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface DayLog {
  studied: number;
  wasted: number;
  status: 'on-track' | 'distracted' | 'on-break' | null;
}

const emptyLog: DayLog = { studied: 0, wasted: 0, status: null };

export function todayKey() {
  return new Date().toISOString().split('T')[0];
}

export function useDayLog() {
  const [logs, setLogs] = useLocalStorage<Record<string, DayLog>>('hg_day_logs', {});
  const today = todayKey();
  const dayLog = logs[today] ?? emptyLog;

  const setLog = (patch: Partial<DayLog>) =>
    setLogs({ ...logs, [today]: { ...dayLog, ...patch } });

  const addStudiedHours = (hours: number) =>
    setLogs({ ...logs, [today]: { ...dayLog, studied: dayLog.studied + hours } });

  return { dayLog, setLog, addStudiedHours };
}
