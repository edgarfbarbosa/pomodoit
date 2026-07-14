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

type PomodoroSessionPreview = {
  timeLabel: string
  progressPercentage: number
}

interface PomodoroStore extends PomodoroTimerSettings {
  setPomodoroMinutes: (pomodoroMinutes: number) => void
  setShortBreakMinutes: (shortBreakMinutes: number) => void
  setLongBreakMinutes: (longBreakMinutes: number) => void
  setRoundsBeforeLongBreak: (roundsBeforeLongBreak: number) => void
  setAutoStartBreaks: (autoStartBreaks: boolean) => void
  setAutoStartFocus: (autoStartFocus: boolean) => void
  setPomodoroTimerSettings: (settings: PomodoroTimerSettings) => void
  resetPomodoroTimerSettings: () => void
  hasTimerRunning: boolean
  setHasTimerRunning: (hasTimerRunning: boolean) => void
  focusSessionTimeLabel: string
  focusSessionProgressPercentage: number
  setFocusSessionPreview: (preview: PomodoroSessionPreview) => void
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

function getValidProgressPercentage(value: number) {
  if (!Number.isFinite(value)) return 0

  return Math.min(100, Math.max(0, value))
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

const pomodoroStore: StateCreator<PomodoroStore> = (set) => ({
  pomodoroMinutes: DEFAULT_POMODORO_MINUTES,
  shortBreakMinutes: DEFAULT_SHORT_BREAK_MINUTES,
  longBreakMinutes: DEFAULT_LONG_BREAK_MINUTES,
  roundsBeforeLongBreak: DEFAULT_ROUNDS_BEFORE_LONG_BREAK,
  autoStartBreaks: DEFAULT_AUTO_START_BREAKS,
  autoStartFocus: DEFAULT_AUTO_START_FOCUS,
  hasTimerRunning: false,
  focusSessionTimeLabel: '25:00',
  focusSessionProgressPercentage: 0,

  /**
   * Atualiza a duração da sessão de foco.
   *
   * Valores fora do intervalo permitido mantêm o valor atual.
   *
   * @param pomodoroMinutes Nova duração do foco em minutos.
   */
  setPomodoroMinutes: (pomodoroMinutes) =>
    set((state) => ({
      pomodoroMinutes: getValidValue(
        pomodoroMinutes,
        MIN_POMODORO_MINUTES,
        MAX_POMODORO_MINUTES,
        state.pomodoroMinutes,
      ),
    })),

  /**
   * Atualiza a duração da pausa curta.
   *
   * Valores fora do intervalo permitido mantêm o valor atual.
   *
   * @param shortBreakMinutes Nova duração da pausa curta em minutos.
   */
  setShortBreakMinutes: (shortBreakMinutes) =>
    set((state) => ({
      shortBreakMinutes: getValidValue(
        shortBreakMinutes,
        MIN_SHORT_BREAK_MINUTES,
        MAX_SHORT_BREAK_MINUTES,
        state.shortBreakMinutes,
      ),
    })),

  /**
   * Atualiza a duração da pausa longa.
   *
   * Valores fora do intervalo permitido mantêm o valor atual.
   *
   * @param longBreakMinutes Nova duração da pausa longa em minutos.
   */
  setLongBreakMinutes: (longBreakMinutes) =>
    set((state) => ({
      longBreakMinutes: getValidValue(
        longBreakMinutes,
        MIN_LONG_BREAK_MINUTES,
        MAX_LONG_BREAK_MINUTES,
        state.longBreakMinutes,
      ),
    })),

  /**
   * Atualiza quantos focos concluídos são necessários antes da pausa longa.
   *
   * O valor 0 desativa a pausa longa. Valores fora do intervalo permitido
   * mantêm o valor atual.
   *
   * @param roundsBeforeLongBreak Nova quantidade de focos antes da pausa longa.
   */
  setRoundsBeforeLongBreak: (roundsBeforeLongBreak) =>
    set((state) => ({
      roundsBeforeLongBreak: getValidValue(
        roundsBeforeLongBreak,
        MIN_ROUNDS_BEFORE_LONG_BREAK,
        MAX_ROUNDS_BEFORE_LONG_BREAK,
        state.roundsBeforeLongBreak,
      ),
    })),

  /**
   * Define se as pausas começam automaticamente após uma sessão de foco.
   *
   * Valores não booleanos mantêm a preferência atual.
   *
   * @param autoStartBreaks Nova preferência de início automático das pausas.
   */
  setAutoStartBreaks: (autoStartBreaks) =>
    set((state) => ({
      autoStartBreaks: getValidBoolean(autoStartBreaks, state.autoStartBreaks),
    })),

  /**
   * Define se o foco começa automaticamente após uma pausa.
   *
   * Valores não booleanos mantêm a preferência atual.
   *
   * @param autoStartFocus Nova preferência de início automático do foco.
   */
  setAutoStartFocus: (autoStartFocus) =>
    set((state) => ({
      autoStartFocus: getValidBoolean(autoStartFocus, state.autoStartFocus),
    })),

  /**
   * Atualiza todas as configurações persistidas do temporizador.
   *
   * Cada campo é validado antes de entrar na store para evitar configurações
   * inválidas vindas da UI ou do armazenamento local.
   *
   * @param settings Configurações do temporizador que serão normalizadas.
   */
  setPomodoroTimerSettings: (settings) =>
    set(() => getValidPomodoroTimerSettings(settings)),

  /**
   * Restaura as configurações padrão do temporizador.
   */
  resetPomodoroTimerSettings: () =>
    set(() => ({
      pomodoroMinutes: DEFAULT_POMODORO_MINUTES,
      shortBreakMinutes: DEFAULT_SHORT_BREAK_MINUTES,
      longBreakMinutes: DEFAULT_LONG_BREAK_MINUTES,
      roundsBeforeLongBreak: DEFAULT_ROUNDS_BEFORE_LONG_BREAK,
      autoStartBreaks: DEFAULT_AUTO_START_BREAKS,
      autoStartFocus: DEFAULT_AUTO_START_FOCUS,
    })),

  /**
   * Informa se existe uma sessão de timer em execução.
   *
   * Esse estado é usado fora da tela Foco para refletir o andamento da sessão.
   *
   * @param hasTimerRunning Novo estado de execução do timer.
   */
  setHasTimerRunning: (hasTimerRunning: boolean) =>
    set(() => ({ hasTimerRunning })),

  /**
   * Atualiza o resumo da sessão em foco exibido fora da tela Foco.
   *
   * A porcentagem é limitada entre 0 e 100 antes de entrar na store.
   *
   * @param preview Tempo formatado e progresso atual da sessão.
   */
  setFocusSessionPreview: ({ timeLabel, progressPercentage }) =>
    set(() => ({
      focusSessionTimeLabel: timeLabel,
      focusSessionProgressPercentage:
        getValidProgressPercentage(progressPercentage),
    })),
})

const usePomodoroStore = create<PomodoroStore>()(
  persist(pomodoroStore, {
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

export default usePomodoroStore
