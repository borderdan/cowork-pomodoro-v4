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

      tick: () => {
        const state = get();
        if (!state.isActive) return;

        if (state.timeLeft > 0) {
          set({ timeLeft: state.timeLeft - 1 });
        }

        // Use the newly updated time left to check if it just hit 0
        const updatedTimeLeft = get().timeLeft;
        if (updatedTimeLeft === 0) {
          const { mode, settings, history } = get();

          // Calculate duration for the history record
          let duration = settings.pomodoroTime;
          if (mode === 'shortBreak') duration = settings.shortBreakTime;
          if (mode === 'longBreak') duration = settings.longBreakTime;

          // Add to history only if it was a pomodoro work session
          let newHistory = history;
          if (mode === 'pomodoro') {
            const newRecord = {
              id: crypto.randomUUID(),
              mode,
              duration,
              completedAt: new Date().toISOString(),
            };
            newHistory = [...history, newRecord];
          }

          // Determine next mode and whether to auto-start
          let nextMode: Mode;
          let autoStart: boolean;

          if (mode === 'pomodoro') {
            const pomodorosSinceLongBreak = newHistory.filter(h => h.mode === 'pomodoro').length;
            if (pomodorosSinceLongBreak > 0 && pomodorosSinceLongBreak % settings.longBreakInterval === 0) {
              nextMode = 'longBreak';
            } else {
              nextMode = 'shortBreak';
            }
            autoStart = settings.autoStartBreaks;
          } else {
            nextMode = 'pomodoro';
            autoStart = settings.autoStartPomodoros;
          }

          let nextTime = settings.pomodoroTime;
          if (nextMode === 'shortBreak') nextTime = settings.shortBreakTime;
          if (nextMode === 'longBreak') nextTime = settings.longBreakTime;

          // Play notification sound
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // 800 Hz beep

            // Envelope
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.5);
          } catch (e) {
            console.error('Audio play failed', e);
          }

          set({
            isActive: autoStart,
            mode: nextMode,
            timeLeft: nextTime,
            history: newHistory,
          });
        }
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
  tick: state.tick,
}));
