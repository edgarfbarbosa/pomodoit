import { useState, useMemo, useEffect } from 'react'

const DEFAULT_POMODORO_MINUTES = 25
const DEFAULT_SHORT_BREAK_MINUTES = 5

export function usePomodoro(
  pomodoro: number = DEFAULT_POMODORO_MINUTES,
  shortBreak: number = DEFAULT_SHORT_BREAK_MINUTES,
  onPomodoroComplete?: () => void,
) {
  const pomodoroInSeconds = pomodoro * 60
  const shortBreakInSeconds = shortBreak * 60

  const [countdown, setCountdown] = useState(pomodoroInSeconds)
  const [isRunning, setIsRunning] = useState(false)

  const [pomodoroState, setPomodoroState] = useState<
    'pomodoro' | 'shortBreak'
  >('pomodoro')

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  const formattedTime = useMemo(() => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [minutes, seconds])

  function startTimer() {
    if (countdown === 0) return

    setIsRunning(true)
  }

  function pauseTimer() {
    setIsRunning(false)
  }

  function switchPomodoroState() {
    setIsRunning(false)

    if (pomodoroState === 'pomodoro') {
      setPomodoroState('shortBreak')
      setCountdown(shortBreakInSeconds)
      return
    }

    if (pomodoroState === 'shortBreak') {
      setPomodoroState('pomodoro')
      setCountdown(pomodoroInSeconds)
      return
    }
  }

  useEffect(() => {
    if (!isRunning) return

    const intervalId = setInterval(() => {
      setCountdown((currentCountdown) => {
        if (currentCountdown <= 1) {
          clearInterval(intervalId)
          setIsRunning(false)

          if (pomodoroState === 'pomodoro') {
            onPomodoroComplete?.()
          }

          return 0
        }

        return currentCountdown - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isRunning, onPomodoroComplete, pomodoroState])

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
  }
}
