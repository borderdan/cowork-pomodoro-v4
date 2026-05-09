import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODES: Record<Mode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const Timer: React.FC = () => {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(MODES.pomodoro);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode]);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(MODES[newMode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto">
      <div className="flex space-x-2 mb-8 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => switchMode('pomodoro')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            mode === 'pomodoro' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            mode === 'shortBreak' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            mode === 'longBreak' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Long Break
        </button>
      </div>

      <div className="text-8xl font-bold text-gray-800 mb-8 font-mono tracking-tighter">
        {formatTime(timeLeft)}
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTimer}
          className="flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          aria-label={isActive ? "Pause timer" : "Start timer"}
        >
          {isActive ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-1" />}
        </button>

        <button
          onClick={resetTimer}
          className="flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Reset timer"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};
