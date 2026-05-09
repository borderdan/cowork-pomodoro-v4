export type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface Settings {
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
}

export interface SessionRecord {
  id: string;
  mode: Mode;
  duration: number; // in seconds
  completedAt: string; // ISO 8601 timestamp
}

export interface TimerState {
  mode: Mode;
  timeLeft: number;
  isActive: boolean;
  settings: Settings;
  history: SessionRecord[];

  // Actions
  setMode: (mode: Mode) => void;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  setIsActive: (isActive: boolean | ((prev: boolean) => boolean)) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addSessionRecord: (record: Omit<SessionRecord, 'id' | 'completedAt'>) => void;
  clearHistory: () => void;
  resetTimer: () => void;
}
