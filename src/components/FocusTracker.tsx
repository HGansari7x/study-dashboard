import React, { useRef, useState } from 'react';

interface FocusTrackerProps {
  onStatusChange: (isFocused: boolean) => void;
}

export const FocusTracker: React.FC<FocusTrackerProps> = ({ onStatusChange }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsActive(true);
        setIsFocused(true);
        onStatusChange(true); // Camera on hote hi timer auto-start
      }
    } catch (err) {
      alert("Webcam permission error ya camera nahi mil raha.");
      console.error(err);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setIsFocused(false);
    onStatusChange(false);
  };

  const toggleAwayBreak = () => {
    const nextState = !isFocused;
    setIsFocused(nextState);
    onStatusChange(nextState); // Break par jaane ya wapas aane par timer control hoga
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          📹 AI Webcam Focus Tracker
        </h4>
        <div className="flex items-center gap-2">
          {isActive && (
            <button
              onClick={toggleAwayBreak}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                isFocused 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
              }`}
            >
              {isFocused ? '☕ Take Break (Away)' : '▶ Resume Studying'}
            </button>
          )}
          <button
            onClick={isActive ? stopWebcam : startWebcam}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              isActive 
                ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {isActive ? 'Stop Camera' : 'Turn On Camera'}
          </button>
        </div>
      </div>

      <div className="relative w-full h-[450px] bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
        <video
          ref={videoRef}
          style={{ transform: 'scaleX(-1)' }}
          className="w-full h-full object-contain rounded-lg"
          autoPlay
          playsInline
        />

        {!isActive && (
          <p className="text-xs text-slate-500 text-center px-4">
            Camera on karein — timer automatic shuru ho jayega. Break ke liye upar button dabayein.
          </p>
        )}

        {isActive && (
          <div className="absolute top-2 left-2 flex items-center gap-2 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-full text-xs">
            <span className={`w-2 h-2 rounded-full ${isFocused ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className={isFocused ? 'text-emerald-300 font-semibold' : 'text-amber-300 font-semibold'}>
              {isFocused ? 'Focused / Studying (Timer Running)' : 'On Break / Paused'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusTracker;