import { View, Text, Pressable } from 'react-native'
import { useCallback } from 'react'
import { Play, Pause, Clock5, SkipForward } from 'lucide-react-native'
import useTaskStore from '../../tasks/stores/useTaskStore'
import { usePomodoro } from '../hooks/usePomodoro'

export function PomodoroDisplay() {
  const currentTask = useTaskStore((state) =>
    state.tasks.find((task) => task.current),
  )

  const setCompletedPomodoros = useTaskStore(
    (state) => state.setCompletedPomodoros,
  )

  const handlePomodoroComplete = useCallback(() => {
    if (!currentTask) return

    setCompletedPomodoros(currentTask.id, currentTask.completedPomodoros + 1)
  }, [currentTask, setCompletedPomodoros])

  const {
    formattedTime,
    isRunning,
    startTimer,
    pauseTimer,
    pomodoroState,
    switchPomodoroState,
  } = usePomodoro(undefined, undefined, handlePomodoroComplete)

  function handleStartOrPauseButtonPress() {
    isRunning ? pauseTimer() : startTimer()
  }

  return (
    <View className="flex flex-col px-6 py-8">
      <View className="flex-row justify-between">
        <Text className="font-inter-black text-lg text-primary uppercase">
          {currentTask?.name ?? 'Nenhuma tarefa selecionada'}
        </Text>
        <View className="flex-row items-center justify-center gap-1 p-2 bg-blue-400 rounded-md">
          <Clock5 size={16} color="#0033FF" />
          <Text className="text-sm font-inter-bold text-primary">
            {currentTask
              ? `${currentTask.completedPomodoros}/${currentTask.estimatedPomodoros}`
              : '0/0'}
          </Text>
        </View>
      </View>

      <View>
        <Text className="font-inter-black text-9xl text-black tracking-tighter">
          {formattedTime}
        </Text>
      </View>

      <View className="flex-row gap-3">
        <Pressable
          onPress={handleStartOrPauseButtonPress}
          className="flex-row gap-2 flex-1 items-center justify-center h-16 bg-secondary rounded-xl"
        >
          {isRunning ? (
            <Pause size={20} color="#FFFFFF" />
          ) : (
            <Play size={20} color="#FFFFFF" />
          )}
          <Text className="font-inter-black text-lg text-white tracking-widest uppercase">
            {pomodoroState === 'pomodoro'
              ? isRunning
                ? 'Pausar foco'
                : 'Iniciar foco'
              : isRunning
                ? 'Pausar pausa'
                : 'Iniciar pausa'}
          </Text>
        </Pressable>

        <Pressable
          onPress={switchPomodoroState}
          className="flex items-center justify-center h-16 w-16 bg-secondary rounded-xl"
        >
          <SkipForward size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  )
}
