import AsyncStorage from '@react-native-async-storage/async-storage'
import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const DEFAULT_POMODORO_MINUTES = 25
const DEFAULT_SHORT_BREAK_MINUTES = 5
const DEFAULT_LONG_BREAK_MINUTES = 15
const DEFAULT_ROUNDS_BEFORE_LONG_BREAK = 4
const DEFAULT_AUTO_START_BREAKS = true
const DEFAULT_AUTO_START_FOCUS = false

const MIN_POMODORO_MINUTES = 5
const MAX_POMODORO_MINUTES = 90
const MIN_SHORT_BREAK_MINUTES = 1
const MAX_SHORT_BREAK_MINUTES = 15
const MIN_LONG_BREAK_MINUTES = 5
const MAX_LONG_BREAK_MINUTES = 45
const MIN_ROUNDS_BEFORE_LONG_BREAK = 0
const MAX_ROUNDS_BEFORE_LONG_BREAK = 4

type PomodoroTimerSettings = {
  pomodoroMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  roundsBeforeLongBreak: number
  autoStartBreaks: boolean
  autoStartFocus: boolean
}

interface PomodoroTimerSettingsStore extends PomodoroTimerSettings {
  setPomodoroMinutes: (pomodoroMinutes: number) => void
  setShortBreakMinutes: (shortBreakMinutes: number) => void
  setLongBreakMinutes: (longBreakMinutes: number) => void
  setRoundsBeforeLongBreak: (roundsBeforeLongBreak: number) => void
  setAutoStartBreaks: (autoStartBreaks: boolean) => void
  setAutoStartFocus: (autoStartFocus: boolean) => void
  setPomodoroTimerSettings: (settings: PomodoroTimerSettings) => void
  resetPomodoroTimerSettings: () => void
}

function isValidInteger(
  value: unknown,
  min: number,
  max: number,
): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  )
}

function getValidValue(
  value: unknown,
  min: number,
  max: number,
  defaultValue: number,
) {
  return isValidInteger(value, min, max) ? value : defaultValue
}

function getValidBoolean(value: unknown, defaultValue: boolean) {
  return typeof value === 'boolean' ? value : defaultValue
}

function getValidPomodoroTimerSettings(
  settings: Partial<PomodoroTimerSettings>,
): PomodoroTimerSettings {
  return {
    pomodoroMinutes: getValidValue(
      settings.pomodoroMinutes,
      MIN_POMODORO_MINUTES,
      MAX_POMODORO_MINUTES,
      DEFAULT_POMODORO_MINUTES,
    ),
    shortBreakMinutes: getValidValue(
      settings.shortBreakMinutes,
      MIN_SHORT_BREAK_MINUTES,
      MAX_SHORT_BREAK_MINUTES,
      DEFAULT_SHORT_BREAK_MINUTES,
    ),
    longBreakMinutes: getValidValue(
      settings.longBreakMinutes,
      MIN_LONG_BREAK_MINUTES,
      MAX_LONG_BREAK_MINUTES,
      DEFAULT_LONG_BREAK_MINUTES,
    ),
    roundsBeforeLongBreak: getValidValue(
      settings.roundsBeforeLongBreak,
      MIN_ROUNDS_BEFORE_LONG_BREAK,
      MAX_ROUNDS_BEFORE_LONG_BREAK,
      DEFAULT_ROUNDS_BEFORE_LONG_BREAK,
    ),
    autoStartBreaks: getValidBoolean(
      settings.autoStartBreaks,
      DEFAULT_AUTO_START_BREAKS,
    ),
    autoStartFocus: getValidBoolean(
      settings.autoStartFocus,
      DEFAULT_AUTO_START_FOCUS,
    ),
  }
}

const pomodoroTimerSettingsStore: StateCreator<PomodoroTimerSettingsStore> = (
  set,
) => ({
  pomodoroMinutes: DEFAULT_POMODORO_MINUTES,
  shortBreakMinutes: DEFAULT_SHORT_BREAK_MINUTES,
  longBreakMinutes: DEFAULT_LONG_BREAK_MINUTES,
  roundsBeforeLongBreak: DEFAULT_ROUNDS_BEFORE_LONG_BREAK,
  autoStartBreaks: DEFAULT_AUTO_START_BREAKS,
  autoStartFocus: DEFAULT_AUTO_START_FOCUS,

  setPomodoroMinutes: (pomodoroMinutes) =>
    set((state) => ({
      pomodoroMinutes: getValidValue(
        pomodoroMinutes,
        MIN_POMODORO_MINUTES,
        MAX_POMODORO_MINUTES,
        state.pomodoroMinutes,
      ),
    })),

  setShortBreakMinutes: (shortBreakMinutes) =>
    set((state) => ({
      shortBreakMinutes: getValidValue(
        shortBreakMinutes,
        MIN_SHORT_BREAK_MINUTES,
        MAX_SHORT_BREAK_MINUTES,
        state.shortBreakMinutes,
      ),
    })),

  setLongBreakMinutes: (longBreakMinutes) =>
    set((state) => ({
      longBreakMinutes: getValidValue(
        longBreakMinutes,
        MIN_LONG_BREAK_MINUTES,
        MAX_LONG_BREAK_MINUTES,
        state.longBreakMinutes,
      ),
    })),

  setRoundsBeforeLongBreak: (roundsBeforeLongBreak) =>
    set((state) => ({
      roundsBeforeLongBreak: getValidValue(
        roundsBeforeLongBreak,
        MIN_ROUNDS_BEFORE_LONG_BREAK,
        MAX_ROUNDS_BEFORE_LONG_BREAK,
        state.roundsBeforeLongBreak,
      ),
    })),

  setAutoStartBreaks: (autoStartBreaks) =>
    set((state) => ({
      autoStartBreaks: getValidBoolean(autoStartBreaks, state.autoStartBreaks),
    })),

  setAutoStartFocus: (autoStartFocus) =>
    set((state) => ({
      autoStartFocus: getValidBoolean(autoStartFocus, state.autoStartFocus),
    })),

  setPomodoroTimerSettings: (settings) =>
    set(() => getValidPomodoroTimerSettings(settings)),

  resetPomodoroTimerSettings: () =>
    set(() => ({
      pomodoroMinutes: DEFAULT_POMODORO_MINUTES,
      shortBreakMinutes: DEFAULT_SHORT_BREAK_MINUTES,
      longBreakMinutes: DEFAULT_LONG_BREAK_MINUTES,
      roundsBeforeLongBreak: DEFAULT_ROUNDS_BEFORE_LONG_BREAK,
      autoStartBreaks: DEFAULT_AUTO_START_BREAKS,
      autoStartFocus: DEFAULT_AUTO_START_FOCUS,
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
      autoStartBreaks: state.autoStartBreaks,
      autoStartFocus: state.autoStartFocus,
    }),
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...getValidPomodoroTimerSettings(
        (persistedState as Partial<PomodoroTimerSettings>) ?? {},
      ),
    }),
    onRehydrateStorage: () => (state) => {
      if (!state) return

      state.setPomodoroTimerSettings(state)
    },
  }),
)

export default usePomodoroTimerSettings
