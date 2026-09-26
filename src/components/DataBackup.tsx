import React, { useState } from 'react';
import { Database, Download, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DataBackup() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Export all localStorage data to a JSON file
  const handleExportData = () => {
    try {
      const exportData: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('studypulse_')) {
          exportData[key] = localStorage.getItem(key);
        }
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `studypulse_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setStatusMessage('Data exported successfully!');
    } catch (e) {
      setStatusMessage('Failed to export data.');
    }
  };

  // Import JSON file data into localStorage
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target?.result as string);
          Object.keys(parsedData).forEach(key => {
            if (key.startsWith('studypulse_')) {
              localStorage.setItem(key, parsedData[key]);
            }
          });
          setStatusMessage('Data imported successfully! Please refresh the page.');
        } catch (err) {
          setStatusMessage('Invalid backup file format.');
        }
      };
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] rounded-3xl border border-slate-700/50 bg-[#0b101d]/75 backdrop-blur-xl shadow-xl overflow-y-auto text-slate-200 p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-700/50 pb-4">
        <div className="p-2.5 rounded-2xl bg-blue-950/60 border border-blue-800/50 text-blue-400">
          <Database className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Data Backup & Recovery</h2>
          <p className="text-xs text-slate-400">Securely export your study logs or restore them on any device</p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 flex items-center gap-3 text-xs">
          {statusMessage.includes('successfully') ? (
            <CheckCircle2 className="text-emerald-400 h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="text-amber-400 h-5 w-5 flex-shrink-0" />
          )}
          <span className="text-slate-200">{statusMessage}</span>
        </div>
      )}

      {/* Export & Import Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/70 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Export Backup (JSON)</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Download all your progress, timetable schedules, streak counts, and custom settings as a backup file.
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all"
          >
            <Download size={16} /> Export Study Data
          </button>
        </div>

        {/* Import Card */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/70 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Restore Backup</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Upload a previously exported StudyPulse JSON backup file to restore your data on this browser.
            </p>
          </div>
          <label className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all">
            <Upload size={16} /> Choose Backup File
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>
        </div>

      </div>

    </div>
  );
}