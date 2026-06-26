import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { PomodoroCyclesSettingsCard } from '../components/PomodoroCyclesSettingsCard'
import { PomodoroTimerPreferencesCard } from '../components/PomodoroTimerPreferencesCard'
import { PomodoroTimerSettingsCard } from '../components/PomodoroTimerSettingsCard'
import usePomodoroStore from '../stores/usePomodoroStore'

export function PomodoroTimerSettingsScreen() {
  const pomodoroMinutes = usePomodoroStore((state) => state.pomodoroMinutes)

  const shortBreakMinutes = usePomodoroStore((state) => state.shortBreakMinutes)

  const longBreakMinutes = usePomodoroStore((state) => state.longBreakMinutes)

  const roundsBeforeLongBreak = usePomodoroStore(
    (state) => state.roundsBeforeLongBreak,
  )

  const autoStartBreaks = usePomodoroStore((state) => state.autoStartBreaks)

  const autoStartFocus = usePomodoroStore((state) => state.autoStartFocus)

  const setPomodoroTimerSettings = usePomodoroStore(
    (state) => state.setPomodoroTimerSettings,
  )

  const resetPomodoroTimerSettings = usePomodoroStore(
    (state) => state.resetPomodoroTimerSettings,
  )

  const [draftSettings, setDraftSettings] = useState({
    pomodoroMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    roundsBeforeLongBreak,
    autoStartBreaks,
    autoStartFocus,
  })

  useEffect(() => {
    setDraftSettings({
      pomodoroMinutes,
      shortBreakMinutes,
      longBreakMinutes,
      roundsBeforeLongBreak,
      autoStartBreaks,
      autoStartFocus,
    })
  }, [
    autoStartBreaks,
    autoStartFocus,
    longBreakMinutes,
    pomodoroMinutes,
    roundsBeforeLongBreak,
    shortBreakMinutes,
  ])

  function handleSaveSettings() {
    setPomodoroTimerSettings(draftSettings)
  }

  function handleResetSettings() {
    resetPomodoroTimerSettings()
  }

  return (
    <ScrollView className="flex-1 flex-col bg-surface-0 px-6 py-8">
      <Text className="mb-3 font-inter-bold text-tertiary text-xs uppercase leading-[14px] tracking-[0.6px]">
        Intervalos de tempo
      </Text>

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
      <PomodoroCyclesSettingsCard
        value={draftSettings.roundsBeforeLongBreak}
        onChange={(roundsBeforeLongBreak) =>
          setDraftSettings((settings) => ({
            ...settings,
            roundsBeforeLongBreak,
          }))
        }
      />
      <PomodoroTimerPreferencesCard
        autoStartBreaks={draftSettings.autoStartBreaks}
        autoStartFocus={draftSettings.autoStartFocus}
        onAutoStartBreaksChange={(autoStartBreaks) =>
          setDraftSettings((settings) => ({
            ...settings,
            autoStartBreaks,
          }))
        }
        onAutoStartFocusChange={(autoStartFocus) =>
          setDraftSettings((settings) => ({
            ...settings,
            autoStartFocus,
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
