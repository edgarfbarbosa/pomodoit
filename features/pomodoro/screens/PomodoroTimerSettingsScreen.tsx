import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { PomodoroTimerSettingsCard } from '../components/PomodoroTimerSettingsCard'
import usePomodoroTimerSettings from '../stores/usePomodoroTimerSettings'

export function PomodoroTimerSettingsScreen() {
  const pomodoroMinutes = usePomodoroTimerSettings(
    (state) => state.pomodoroMinutes,
  )

  const shortBreakMinutes = usePomodoroTimerSettings(
    (state) => state.shortBreakMinutes,
  )

  const longBreakMinutes = usePomodoroTimerSettings(
    (state) => state.longBreakMinutes,
  )

  const setPomodoroMinutes = usePomodoroTimerSettings(
    (state) => state.setPomodoroMinutes,
  )

  const setShortBreakMinutes = usePomodoroTimerSettings(
    (state) => state.setShortBreakMinutes,
  )

  const setLongBreakMinutes = usePomodoroTimerSettings(
    (state) => state.setLongBreakMinutes,
  )

  const [draftSettings, setDraftSettings] = useState({
    pomodoroMinutes,
    shortBreakMinutes,
    longBreakMinutes,
  })

  useEffect(() => {
    setDraftSettings({
      pomodoroMinutes,
      shortBreakMinutes,
      longBreakMinutes,
    })
  }, [longBreakMinutes, pomodoroMinutes, shortBreakMinutes])

  function handleSaveSettings() {
    setPomodoroMinutes(draftSettings.pomodoroMinutes)
    setShortBreakMinutes(draftSettings.shortBreakMinutes)
    setLongBreakMinutes(draftSettings.longBreakMinutes)
  }

  function handleResetSettings() {
    setDraftSettings({
      pomodoroMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
    })
  }

  return (
    <ScrollView className="flex-1 flex-col bg-surface-0 px-6 py-8">
      <PomodoroTimerSettingsCard
        label="Foco"
        value={draftSettings.pomodoroMinutes}
        min={5}
        max={90}
        onChange={(pomodoroMinutes) =>
          setDraftSettings((settings) => ({
            ...settings,
            pomodoroMinutes,
          }))
        }
      />
      <PomodoroTimerSettingsCard
        label="Pausa curta"
        value={draftSettings.shortBreakMinutes}
        min={1}
        max={15}
        onChange={(shortBreakMinutes) =>
          setDraftSettings((settings) => ({
            ...settings,
            shortBreakMinutes,
          }))
        }
      />
      <PomodoroTimerSettingsCard
        label="Pausa longa"
        value={draftSettings.longBreakMinutes}
        min={5}
        max={45}
        onChange={(longBreakMinutes) =>
          setDraftSettings((settings) => ({
            ...settings,
            longBreakMinutes,
          }))
        }
      />
      <View className="flex-col gap-2">
        <Pressable
          onPress={handleSaveSettings}
          className="h-14 w-full items-center justify-center rounded-lg border border-outline bg-primary"
        >
          <Text className="font-inter-medium text-secondary uppercase -tracking-wider">
            Salvar alterações
          </Text>
        </Pressable>
        <Pressable
          onPress={handleResetSettings}
          className="h-14 w-full items-center justify-center rounded-lg border border-[#FF4444]/50 bg-surface-1"
        >
          <Text className="font-inter-medium text-[#FF4444] -tracking-wider">
            Resetar para o padrão
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}
