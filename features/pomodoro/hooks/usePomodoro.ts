import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppState } from 'react-native'

const DEFAULT_POMODORO_MINUTES = 25
const DEFAULT_SHORT_BREAK_MINUTES = 5
const DEFAULT_LONG_BREAK_MINUTES = 15
const DEFAULT_ROUNDS_BEFORE_LONG_BREAK = 4
const DEFAULT_AUTO_START_BREAKS = true
const DEFAULT_AUTO_START_FOCUS = false

/**
 * Retorna o horário atual em segundos para comparar com o fim real da sessão.
 */
const getTimestampInSeconds = () => Date.now() / 1000

/**
 * Calcula quantos segundos ainda faltam até `sessionEndAt`.
 *
 * O timestamp atual é comparado com o fim da sessão, `Math.ceil` evita perder
 * visualmente o último segundo e `Math.max` impede valores negativos.
 */
function getRemainingSeconds(sessionEndAt: number) {
  const timestamp = getTimestampInSeconds()

  return Math.max(0, Math.ceil(sessionEndAt - timestamp))
}

export function usePomodoro(
  pomodoro: number = DEFAULT_POMODORO_MINUTES,
  shortBreak: number = DEFAULT_SHORT_BREAK_MINUTES,
  longBreak: number = DEFAULT_LONG_BREAK_MINUTES,
  onPomodoroComplete?: () => void,
  onBreakComplete?: () => void,
  roundsBeforeLongBreak: number = DEFAULT_ROUNDS_BEFORE_LONG_BREAK,
  autoStartBreaks: boolean = DEFAULT_AUTO_START_BREAKS,
  autoStartFocus: boolean = DEFAULT_AUTO_START_FOCUS,
) {
  const pomodoroInSeconds = pomodoro * 60
  const shortBreakInSeconds = shortBreak * 60
  const longBreakInSeconds = longBreak * 60

  const [countdown, setCountdown] = useState(pomodoroInSeconds)
  const [sessionEndAt, setSessionEndAt] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isPomodoroCompleted, setIsPomodoroCompleted] = useState(false)
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0)
  const [hasStartedCurrentSession, setHasStartedCurrentSession] =
    useState(false)

  const [pomodoroState, setPomodoroState] = useState<
    'pomodoro' | 'shortBreak' | 'longBreak'
  >('pomodoro')

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  /**
   * Memoriza o texto exibido no timer.
   *
   * O `useMemo` evita recriar a string formatada enquanto `minutes` e `seconds`
   * continuam iguais.
   */
  const formattedTime = useMemo(() => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [minutes, seconds])

  /**
   * Define o `countdown` inicial da etapa atual enquanto ela ainda não começou.
   *
   * Se a sessão já começou, o efeito não sobrescreve o tempo restante. Caso
   * contrário, escolhe a duração correta de foco, pausa curta ou pausa longa.
   */
  useEffect(() => {
    if (hasStartedCurrentSession) return

    if (pomodoroState === 'pomodoro') {
      setCountdown(pomodoroInSeconds)
      return
    }

    if (pomodoroState === 'shortBreak') {
      setCountdown(shortBreakInSeconds)
      return
    }

    setCountdown(longBreakInSeconds)
  }, [
    hasStartedCurrentSession,
    longBreakInSeconds,
    pomodoroInSeconds,
    pomodoroState,
    shortBreakInSeconds,
  ])

  /**
   * Inicia a etapa atual usando o tempo restante do `countdown`.
   *
   * Se o contador está zerado, não há sessão para iniciar.
   * O timestamp atual serve de base para calcular o horário real de término.
   * `setHasStartedCurrentSession(true)` protege o countdown contra mudanças de configuração.
   * `setSessionEndAt(...)` registra quando a sessão deve terminar no relógio real.
   * `setIsRunning(true)` ativa os efeitos responsáveis por sincronizar o timer.
   */
  function startTimer() {
    if (countdown === 0) return

    const currentTimestamp = getTimestampInSeconds()

    setHasStartedCurrentSession(true)
    setSessionEndAt(currentTimestamp + countdown)
    setIsRunning(true)
  }

  /**
   * Pausa a etapa atual preservando o tempo restante.
   *
   * Quando existe `sessionEndAt`, o tempo restante é recalculado pelo relógio real.
   * `setCountdown(...)` grava esse tempo para permitir retomar a sessão depois.
   * `setSessionEndAt(null)` remove o horário de término enquanto o timer está pausado.
   * `setIsRunning(false)` interrompe a sincronização ativa do contador.
   */
  function pauseTimer() {
    if (sessionEndAt) {
      const remainingSeconds = getRemainingSeconds(sessionEndAt)

      setCountdown(remainingSeconds)
    }

    setSessionEndAt(null)
    setIsRunning(false)
  }

  useEffect(() => {
    if (roundsBeforeLongBreak === 0) {
      setCompletedFocusSessions(0)
    }
  }, [roundsBeforeLongBreak])

  /**
   * Prepara o horário de término da próxima etapa.
   *
   * Se a próxima etapa não deve iniciar automaticamente, `sessionEndAt` é
   * limpo para manter o timer parado. Se deve iniciar, a duração recebida é
   * somada ao timestamp atual para registrar o novo fim real da sessão.
   */
  const setNextSessionEndAt = useCallback(
    (durationInSeconds: number, shouldAutoStart: boolean) => {
      if (!shouldAutoStart) {
        setSessionEndAt(null)
        return
      }

      const currentTimestamp = getTimestampInSeconds()

      setSessionEndAt(currentTimestamp + durationInSeconds)
    },
    [],
  )

  const getCurrentSessionDurationInSeconds = useCallback(() => {
    if (pomodoroState === 'pomodoro') return pomodoroInSeconds

    if (pomodoroState === 'shortBreak') return shortBreakInSeconds

    return longBreakInSeconds
  }, [
    longBreakInSeconds,
    pomodoroInSeconds,
    pomodoroState,
    shortBreakInSeconds,
  ])

  function resetCurrentSession() {
    setCountdown(getCurrentSessionDurationInSeconds())
    setSessionEndAt(null)
    setIsRunning(false)
    setIsPomodoroCompleted(false)
    setHasStartedCurrentSession(false)
  }

  /**
   * Alterna para a próxima etapa do ciclo Pomodoro.
   *
   * Primeiro decide se a próxima etapa pode iniciar automaticamente. Essa
   * decisão depende da ação que chamou a troca e das preferências do usuário:
   * ao sair de foco, usa `autoStartBreaks`; ao sair de pausa, usa
   * `autoStartFocus`.
   *
   * Em seguida, sincroniza os estados compartilhados da nova etapa:
   * `setIsRunning(...)` liga ou mantém parado o timer da próxima sessão;
   * `setIsPomodoroCompleted(false)` limpa a marca da sessão de foco anterior;
   * `setHasStartedCurrentSession(...)` indica se a próxima sessão já começou.
   *
   * Quando a etapa atual é foco, a função registra mais uma sessão concluída
   * e decide entre pausa curta e pausa longa. Quando a etapa atual é pausa
   * curta ou longa, a função volta para foco.
   *
   * Cada troca também atualiza `pomodoroState`, define o novo `countdown` e
   * delega para `setNextSessionEndAt` o agendamento real do fim da sessão.
   */
  const switchPomodoroState = useCallback(
    (shouldAutoStart = false) => {
      const shouldAutoStartNextSession =
        shouldAutoStart &&
        (pomodoroState === 'pomodoro' ? autoStartBreaks : autoStartFocus)

      setIsRunning(shouldAutoStartNextSession)
      setIsPomodoroCompleted(false)
      setHasStartedCurrentSession(shouldAutoStartNextSession)

      if (pomodoroState === 'pomodoro') {
        // Conta apenas focos realmente concluídos para decidir a pausa longa.
        if (isPomodoroCompleted && roundsBeforeLongBreak > 0) {
          const nextCompletedFocusSessions = completedFocusSessions + 1

          if (nextCompletedFocusSessions >= roundsBeforeLongBreak) {
            setCompletedFocusSessions(0)
            setPomodoroState('longBreak')
            setCountdown(longBreakInSeconds)
            setNextSessionEndAt(longBreakInSeconds, shouldAutoStartNextSession)
            return
          }

          setCompletedFocusSessions(nextCompletedFocusSessions)
        }

        setPomodoroState('shortBreak')
        setCountdown(shortBreakInSeconds)
        setNextSessionEndAt(shortBreakInSeconds, shouldAutoStartNextSession)
        return
      }

      if (pomodoroState === 'shortBreak' || pomodoroState === 'longBreak') {
        setPomodoroState('pomodoro')
        setCountdown(pomodoroInSeconds)
        setNextSessionEndAt(pomodoroInSeconds, shouldAutoStartNextSession)
        return
      }
    },
    [
      pomodoroState,
      autoStartBreaks,
      autoStartFocus,
      isPomodoroCompleted,
      completedFocusSessions,
      roundsBeforeLongBreak,
      longBreakInSeconds,
      shortBreakInSeconds,
      pomodoroInSeconds,
      setNextSessionEndAt,
    ],
  )

  /**
   * Finaliza a etapa atual antes de trocar para a próxima.
   *
   * `setIsRunning(false)` para a sincronização do timer.
   * `setSessionEndAt(null)` remove o fim real da sessão finalizada.
   * Em foco, marca o Pomodoro como concluído e dispara `onPomodoroComplete`.
   * Em pausa curta ou longa, dispara `onBreakComplete`.
   */
  const completeCurrentSession = useCallback(() => {
    setIsRunning(false)
    setSessionEndAt(null)

    if (pomodoroState === 'pomodoro') {
      setIsPomodoroCompleted(true)
      onPomodoroComplete?.()
    }

    if (pomodoroState === 'shortBreak' || pomodoroState === 'longBreak') {
      onBreakComplete?.()
    }
  }, [onBreakComplete, onPomodoroComplete, pomodoroState])

  /**
   * Sincroniza o contador visual com o horário real de término da sessão.
   *
   * Sem `sessionEndAt`, não há sessão ativa para sincronizar.
   * O tempo restante é recalculado pelo relógio real para cobrir intervalos,
   * app em segundo plano e retorno ao app.
   * `setCountdown(...)` atualiza o valor exibido na tela.
   * Quando o tempo chega a zero, `completeCurrentSession()` encerra a etapa.
   */
  const syncCountdownWithSessionEnd = useCallback(() => {
    if (!sessionEndAt) return

    const remainingSeconds = getRemainingSeconds(sessionEndAt)

    setCountdown(remainingSeconds)

    if (remainingSeconds <= 0) {
      completeCurrentSession()
    }
  }, [completeCurrentSession, sessionEndAt])

  useEffect(() => {
    if (!isRunning || !sessionEndAt) return

    const intervalId = setInterval(() => {
      if (getRemainingSeconds(sessionEndAt) <= 0) {
        clearInterval(intervalId)
        syncCountdownWithSessionEnd()
        return
      }

      syncCountdownWithSessionEnd()
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isRunning, sessionEndAt, syncCountdownWithSessionEnd])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        syncCountdownWithSessionEnd()
      }
    })

    return () => subscription.remove()
  }, [syncCountdownWithSessionEnd])

  useEffect(() => {
    if (
      countdown === 0 &&
      pomodoroState === 'pomodoro' &&
      isPomodoroCompleted
    ) {
      switchPomodoroState(true)
      return
    }

    if (countdown === 0 && pomodoroState === 'shortBreak') {
      switchPomodoroState(true)
      return
    }

    if (countdown === 0 && pomodoroState === 'longBreak') {
      switchPomodoroState(true)
      return
    }
  }, [countdown, isPomodoroCompleted, pomodoroState, switchPomodoroState])

  return {
    countdown,
    minutes,
    seconds,
    sessionEndAt,
    formattedTime,
    isRunning,
    pomodoroState,
    startTimer,
    pauseTimer,
    resetCurrentSession,
    switchPomodoroState,
    isPomodoroCompleted,
  }
}
