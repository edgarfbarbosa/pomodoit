import { useAudioPlayer } from 'expo-audio'
import { useCallback } from 'react'

const timerControlSound = require('../../../assets/sounds/mixkit-pen-click-and-release-1115.wav')
const focusCompleteSound = require('../../../assets/sounds/mixkit-service-bell-double-ding-588.wav')
const breakCompleteSound = require('../../../assets/sounds/mixkit-attention-bell-ding-586.wav')

export function usePomodoroSounds() {
  const timerControlPlayer = useAudioPlayer(timerControlSound)
  const focusCompletePlayer = useAudioPlayer(focusCompleteSound)
  const breakCompletePlayer = useAudioPlayer(breakCompleteSound)

  const playTimerControlSound = useCallback(() => {
    timerControlPlayer.seekTo(0)
    timerControlPlayer.play()
  }, [timerControlPlayer])

  const playFocusCompleteSound = useCallback(() => {
    focusCompletePlayer.seekTo(0)
    focusCompletePlayer.play()
  }, [focusCompletePlayer])

  const playBreakCompleteSound = useCallback(() => {
    breakCompletePlayer.seekTo(0)
    breakCompletePlayer.play()
  }, [breakCompletePlayer])

  return {
    playTimerControlSound,
    playFocusCompleteSound,
    playBreakCompleteSound,
  }
}
