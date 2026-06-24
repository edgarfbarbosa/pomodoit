import { useCallback, useEffect, useMemo, useState } from 'react'

const DEFAULT_POMODORO_MINUTES = 25
const DEFAULT_SHORT_BREAK_MINUTES = 5
const DEFAULT_LONG_BREAK_MINUTES = 15
const DEFAULT_ROUNDS_BEFORE_LONG_BREAK = 4

export function usePomodoro(
  pomodoro: number = DEFAULT_POMODORO_MINUTES,
  shortBreak: number = DEFAULT_SHORT_BREAK_MINUTES,
  longBreak: number = DEFAULT_LONG_BREAK_MINUTES,
  onPomodoroComplete?: () => void,
  completedPomodoros: number = 0,
  roundsBeforeLongBreak: number = DEFAULT_ROUNDS_BEFORE_LONG_BREAK,
) {
  const pomodoroInSeconds = pomodoro * 60
  const shortBreakInSeconds = shortBreak * 60
  const longBreakInSeconds = longBreak * 60

  const [countdown, setCountdown] = useState(pomodoroInSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [isPomodoroCompleted, setIsPomodoroCompleted] = useState(false)
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

    setHasStartedCurrentSession(true)
    setIsRunning(true)
  }

  function pauseTimer() {
    setIsRunning(false)
  }

  const switchPomodoroState = useCallback(() => {
    setIsRunning(false)
    setIsPomodoroCompleted(false)
    setHasStartedCurrentSession(false)

    if (pomodoroState === 'pomodoro') {
      if (
        isPomodoroCompleted &&
        roundsBeforeLongBreak > 0 &&
        completedPomodoros % roundsBeforeLongBreak === 0
      ) {
        setPomodoroState('longBreak')
        setCountdown(longBreakInSeconds)
        return
      }

      setPomodoroState('shortBreak')
      setCountdown(shortBreakInSeconds)
      return
    }

    if (pomodoroState === 'shortBreak' || pomodoroState === 'longBreak') {
      setPomodoroState('pomodoro')
      setCountdown(pomodoroInSeconds)
      return
    }
  }, [
    pomodoroState,
    isPomodoroCompleted,
    completedPomodoros,
    roundsBeforeLongBreak,
    longBreakInSeconds,
    shortBreakInSeconds,
    pomodoroInSeconds,
  ])

  useEffect(() => {
    if (!isRunning) return

    const intervalId = setInterval(() => {
      setCountdown((currentCountdown) => {
        if (currentCountdown <= 1) {
          clearInterval(intervalId)
          setIsRunning(false)

          if (pomodoroState === 'pomodoro') {
            setIsPomodoroCompleted(true)
            onPomodoroComplete?.()
          }

          return 0
        }

        return currentCountdown - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isRunning, onPomodoroComplete, pomodoroState])

  useEffect(() => {
    if (
      countdown === 0 &&
      pomodoroState === 'pomodoro' &&
      isPomodoroCompleted
    ) {
      switchPomodoroState()
      return
    }

    if (countdown === 0 && pomodoroState === 'shortBreak') {
      switchPomodoroState()
      return
    }

    if (countdown === 0 && pomodoroState === 'longBreak') {
      switchPomodoroState()
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
