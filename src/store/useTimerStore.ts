import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimerState, Mode, Settings } from '../types';

const defaultSettings: Settings = {
  pomodoroTime: 25 * 60,
  shortBreakTime: 5 * 60,
  longBreakTime: 15 * 60,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      mode: 'pomodoro',
      timeLeft: defaultSettings.pomodoroTime,
      isActive: false,
      settings: defaultSettings,
      history: [],

      setMode: (mode: Mode) => {
        const { settings } = get();
        let time = settings.pomodoroTime;
        if (mode === 'shortBreak') time = settings.shortBreakTime;
        if (mode === 'longBreak') time = settings.longBreakTime;

        set({ mode, timeLeft: time, isActive: false });
      },

      setTimeLeft: (time) =>
        set((state) => ({
          timeLeft: typeof time === 'function' ? time(state.timeLeft) : time
        })),

      setIsActive: (isActive) =>
        set((state) => ({
          isActive: typeof isActive === 'function' ? isActive(state.isActive) : isActive
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),

      addSessionRecord: (record) =>
        set((state) => ({
          history: [
            ...state.history,
            {
              ...record,
              id: crypto.randomUUID(),
              completedAt: new Date().toISOString(),
            }
          ]
        })),

      clearHistory: () => set({ history: [] }),

      resetTimer: () => {
        const { mode, settings } = get();
        let time = settings.pomodoroTime;
        if (mode === 'shortBreak') time = settings.shortBreakTime;
        if (mode === 'longBreak') time = settings.longBreakTime;

        set({ timeLeft: time, isActive: false });
      },
    }),
    {
      name: 'pomodoro-storage',
      partialize: (state) => ({
        settings: state.settings,
        history: state.history
      }), // Persist only settings and history
    }
  )
);

// Typed selectors
export const useMode = () => useTimerStore((state) => state.mode);
export const useTimeLeft = () => useTimerStore((state) => state.timeLeft);
export const useIsActive = () => useTimerStore((state) => state.isActive);
export const useSettings = () => useTimerStore((state) => state.settings);
export const useHistory = () => useTimerStore((state) => state.history);
export const useTimerActions = () => useTimerStore((state) => ({
  setMode: state.setMode,
  setTimeLeft: state.setTimeLeft,
  setIsActive: state.setIsActive,
  updateSettings: state.updateSettings,
  addSessionRecord: state.addSessionRecord,
  clearHistory: state.clearHistory,
  resetTimer: state.resetTimer,
}));
