import React, { useState } from 'react';
import { useTimerStore } from '../store/useTimerStore';
import { X } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const settings = useTimerStore((state) => state.settings);
  const updateSettings = useTimerStore((state) => state.updateSettings);

  const [pomodoroTime, setPomodoroTime] = useState(settings.pomodoroTime / 60);
  const [shortBreakTime, setShortBreakTime] = useState(settings.shortBreakTime / 60);
  const [longBreakTime, setLongBreakTime] = useState(settings.longBreakTime / 60);
  const [wasOpen, setWasOpen] = useState(isOpen);

  if (isOpen !== wasOpen) {
    if (isOpen) {
      setPomodoroTime(settings.pomodoroTime / 60);
      setShortBreakTime(settings.shortBreakTime / 60);
      setLongBreakTime(settings.longBreakTime / 60);
    }
    setWasOpen(isOpen);
  }

  if (!isOpen) return null;

  const handleSave = () => {
    // Basic validation
    const pTime = Math.max(1, Math.min(60, Math.floor(pomodoroTime)));
    const sTime = Math.max(1, Math.min(30, Math.floor(shortBreakTime)));
    const lTime = Math.max(1, Math.min(30, Math.floor(longBreakTime)));

    updateSettings({
      pomodoroTime: pTime * 60,
      shortBreakTime: sTime * 60,
      longBreakTime: lTime * 60,
    });

    // Setting changes persist in store, and are read by setMode/resetTimer
    // They will not affect the currently running session.
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 font-medium">Work Duration (min)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={pomodoroTime}
              onChange={(e) => setPomodoroTime(Number(e.target.value))}
              className="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-gray-700 font-medium">Short Break (min)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={shortBreakTime}
              onChange={(e) => setShortBreakTime(Number(e.target.value))}
              className="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-gray-700 font-medium">Long Break (min)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={longBreakTime}
              onChange={(e) => setLongBreakTime(Number(e.target.value))}
              className="w-20 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mr-3"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
