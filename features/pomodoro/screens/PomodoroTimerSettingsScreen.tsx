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

  const roundsBeforeLongBreak = usePomodoroTimerSettings(
    (state) => state.roundsBeforeLongBreak,
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

  const setRoundsBeforeLongBreak = usePomodoroTimerSettings(
    (state) => state.setRoundsBeforeLongBreak,
  )

  const resetPomodoroTimerSettings = usePomodoroTimerSettings(
    (state) => state.resetPomodoroTimerSettings,
  )

  return (
    <ScrollView className="flex-col flex-1 bg-surface-2 px-6 py-8">
      <PomodoroTimerSettingsCard
        label="Foco"
        value={pomodoroMinutes}
        onChange={setPomodoroMinutes}
      />
      <PomodoroTimerSettingsCard
        label="Pausa curta"
        value={shortBreakMinutes}
        onChange={setShortBreakMinutes}
      />
      <PomodoroTimerSettingsCard
        label="Pausa longa"
        value={longBreakMinutes}
        onChange={setLongBreakMinutes}
      />
      <PomodoroTimerSettingsCard
        label="Ciclos"
        value={roundsBeforeLongBreak}
        onChange={setRoundsBeforeLongBreak}
      />
      <View className="flex-col">
        <Pressable className="button__text w-full bg-secondary">
          <Text className="font-inter-extra-bold uppercase text-white">
            Salvar alterações
          </Text>
        </Pressable>
        <Pressable
          onPress={resetPomodoroTimerSettings}
          className="button__text w-full bg-transparent"
        >
          <Text className="font-inter-extra-bold uppercase text-tertiary underline">
            Resetar para o padrão
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}
