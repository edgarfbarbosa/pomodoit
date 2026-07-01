import { useCallback, useEffect, useMemo, useState } from 'react'

const DEFAULT_POMODORO_MINUTES = 25
const DEFAULT_SHORT_BREAK_MINUTES = 5
const DEFAULT_LONG_BREAK_MINUTES = 15
const DEFAULT_ROUNDS_BEFORE_LONG_BREAK = 4
const DEFAULT_AUTO_START_BREAKS = true
const DEFAULT_AUTO_START_FOCUS = false

const getTimestampInSeconds = () => Date.now() / 1000

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

  const formattedTime = useMemo(() => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [minutes, seconds])

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

  function startTimer() {
    if (countdown === 0) return

    const currentTimestamp = getTimestampInSeconds()

    setHasStartedCurrentSession(true)
    setSessionEndAt(currentTimestamp + countdown)
    setIsRunning(true)
  }

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

  const switchPomodoroState = useCallback(
    (shouldAutoStart = false) => {
      const shouldAutoStartNextSession =
        shouldAutoStart &&
        (pomodoroState === 'pomodoro' ? autoStartBreaks : autoStartFocus)

      setIsRunning(shouldAutoStartNextSession)
      setIsPomodoroCompleted(false)
      setHasStartedCurrentSession(shouldAutoStartNextSession)

      if (pomodoroState === 'pomodoro') {
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

  useEffect(() => {
    if (!isRunning || !sessionEndAt) return

    const intervalId = setInterval(() => {
      const remainingSeconds = getRemainingSeconds(sessionEndAt)

      setCountdown(remainingSeconds)

      if (remainingSeconds <= 0) {
        clearInterval(intervalId)
        setIsRunning(false)
        setSessionEndAt(null)

        if (pomodoroState === 'pomodoro') {
          setIsPomodoroCompleted(true)
          onPomodoroComplete?.()
        }

        if (pomodoroState === 'shortBreak' || pomodoroState === 'longBreak') {
          onBreakComplete?.()
        }
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [
    isRunning,
    sessionEndAt,
    onBreakComplete,
    onPomodoroComplete,
    pomodoroState,
  ])

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
    formattedTime,
    isRunning,
    pomodoroState,
    startTimer,
    pauseTimer,
    switchPomodoroState,
    isPomodoroCompleted,
  }
}
