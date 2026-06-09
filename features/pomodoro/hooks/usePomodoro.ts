import { useState, useMemo, useEffect } from 'react'

const DEFAULT_POMODORO_MINUTES = 25

export function usePomodoro(pomodoro: number = DEFAULT_POMODORO_MINUTES) {
  const pomodoroInSeconds = pomodoro * 60

  const [countdown, setCountdown] = useState(pomodoroInSeconds)
  const [isRunning, setIsRunning] = useState(false)

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  const formattedTime = useMemo(() => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [minutes, seconds])

  function startPomodoro() {
    setIsRunning(true)
  }

  function pausePomodoro() {
    setIsRunning(false)
  }

  useEffect(() => {
    if (!isRunning) return

    const intervalId = setInterval(() => {
      setCountdown((currentCountdown) => {
        if (currentCountdown <= 1) {
          clearInterval(intervalId)
          setIsRunning(false)
          return 0
        }

        return currentCountdown - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isRunning])

  return {
    countdown,
    minutes,
    seconds,
    formattedTime,
    isRunning,
    startPomodoro,
    pausePomodoro,
  }
}
