import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimerStore } from '../store/useTimerStore';
import type { Mode } from '../types';

export const Timer: React.FC = () => {
  const mode = useTimerStore((state) => state.mode);
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const isActive = useTimerStore((state) => state.isActive);
  const settings = useTimerStore((state) => state.settings);
  const setMode = useTimerStore((state) => state.setMode);
  const setTimeLeft = useTimerStore((state) => state.setTimeLeft);
  const setIsActive = useTimerStore((state) => state.setIsActive);
  const resetTimer = useTimerStore((state) => state.resetTimer);

  // Calculate total time for current mode
  const totalTime = React.useMemo(() => {
    switch (mode) {
      case 'pomodoro': return settings.pomodoroTime;
      case 'shortBreak': return settings.shortBreakTime;
      case 'longBreak': return settings.longBreakTime;
      default: return settings.pomodoroTime;
    }
  }, [mode, settings]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, setTimeLeft, setIsActive]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG Progress Ring calculations
  const radius = 130;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const getStrokeColor = () => {
    switch (mode) {
      case 'pomodoro': return 'stroke-indigo-500';
      case 'shortBreak': return 'stroke-emerald-400';
      case 'longBreak': return 'stroke-teal-400';
      default: return 'stroke-indigo-500';
    }
  };

  const getButtonBgColor = () => {
    switch (mode) {
      case 'pomodoro': return 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200';
      case 'shortBreak': return 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200';
      case 'longBreak': return 'bg-teal-500 hover:bg-teal-600 shadow-teal-200';
      default: return 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200';
    }
  };

  const getActiveTabColor = (m: Mode) => {
    switch (m) {
      case 'pomodoro': return 'text-indigo-600';
      case 'shortBreak': return 'text-emerald-500';
      case 'longBreak': return 'text-teal-500';
      default: return 'text-indigo-600';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[2rem] shadow-xl w-full max-w-md mx-auto">
      <div className="flex space-x-2 mb-10 bg-gray-100 p-1.5 rounded-2xl w-full">
        {(['pomodoro', 'shortBreak', 'longBreak'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              mode === m
                ? `bg-white shadow-sm ${getActiveTabColor(m)}`
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {m === 'pomodoro' ? 'Pomodoro' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center mb-10">
        <svg
          className="transform -rotate-90 transition-all duration-300"
          width="280"
          height="280"
          viewBox="0 0 280 280"
        >
          {/* Background Ring */}
          <circle
            className="stroke-gray-100"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="140"
            cy="140"
          />
          {/* Progress Ring */}
          <circle
            className={`${getStrokeColor()} transition-all duration-1000 ease-linear`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="140"
            cy="140"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-6xl font-bold text-gray-800 font-mono tracking-tighter">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button
          onClick={toggleTimer}
          className={`flex items-center justify-center w-20 h-20 text-white rounded-full transition-all shadow-lg ${getButtonBgColor()} active:scale-95`}
          aria-label={isActive ? "Pause timer" : "Start timer"}
        >
          {isActive ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-2" />}
        </button>

        <button
          onClick={() => resetTimer()}
          className="flex items-center justify-center w-14 h-14 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors active:scale-95"
          aria-label="Reset timer"
        >
          <RotateCcw size={28} />
        </button>
      </div>
    </div>
  );
};