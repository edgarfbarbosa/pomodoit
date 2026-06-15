import AsyncStorage from '@react-native-async-storage/async-storage'
import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const DEFAULT_POMODORO_MINUTES = 25
const DEFAULT_SHORT_BREAK_MINUTES = 5
const DEFAULT_LONG_BREAK_MINUTES = 15
const DEFAULT_ROUNDS_BEFORE_LONG_BREAK = 4

interface PomodoroTimerSettingsStore {
  pomodoroMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  roundsBeforeLongBreak: number
  setPomodoroMinutes: (pomodoroMinutes: number) => void
  setShortBreakMinutes: (shortBreakMinutes: number) => void
  setLongBreakMinutes: (longBreakMinutes: number) => void
  setRoundsBeforeLongBreak: (roundsBeforeLongBreak: number) => void
  resetPomodoroTimerSettings: () => void
}

const pomodoroTimerSettingsStore: StateCreator<PomodoroTimerSettingsStore> = (
  set,
) => ({
  pomodoroMinutes: DEFAULT_POMODORO_MINUTES,
  shortBreakMinutes: DEFAULT_SHORT_BREAK_MINUTES,
  longBreakMinutes: DEFAULT_LONG_BREAK_MINUTES,
  roundsBeforeLongBreak: DEFAULT_ROUNDS_BEFORE_LONG_BREAK,

  setPomodoroMinutes: (pomodoroMinutes) =>
    set(() => ({
      pomodoroMinutes,
    })),

  setShortBreakMinutes: (shortBreakMinutes) =>
    set(() => ({
      shortBreakMinutes,
    })),

  setLongBreakMinutes: (longBreakMinutes) =>
    set(() => ({
      longBreakMinutes,
    })),

  setRoundsBeforeLongBreak: (roundsBeforeLongBreak) =>
    set(() => ({
      roundsBeforeLongBreak,
    })),

  resetPomodoroTimerSettings: () =>
    set(() => ({
      pomodoroMinutes: DEFAULT_POMODORO_MINUTES,
      shortBreakMinutes: DEFAULT_SHORT_BREAK_MINUTES,
      longBreakMinutes: DEFAULT_LONG_BREAK_MINUTES,
      roundsBeforeLongBreak: DEFAULT_ROUNDS_BEFORE_LONG_BREAK,
    })),
})

const usePomodoroTimerSettings = create<PomodoroTimerSettingsStore>()(
  persist(pomodoroTimerSettingsStore, {
    name: 'pomodoit-pomodoro-timer-settings-store',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      pomodoroMinutes: state.pomodoroMinutes,
      shortBreakMinutes: state.shortBreakMinutes,
      longBreakMinutes: state.longBreakMinutes,
      roundsBeforeLongBreak: state.roundsBeforeLongBreak,
    }),
  }),
)

export default usePomodoroTimerSettings
