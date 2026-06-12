import { Clock5, Pause, Play, SkipForward } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Modal } from '../../../components/Modal'
import useTaskStore from '../../tasks/stores/useTaskStore'
import { usePomodoro } from '../hooks/usePomodoro'

export function PomodoroDisplay() {
  const [isOpen, setIsOpen] = useState(false)

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
    isPomodoroCompleted,
  } = usePomodoro(
    undefined,
    undefined,
    undefined,
    handlePomodoroComplete,
    currentTask?.completedPomodoros,
  )

  function handleStartOrPauseButtonPress() {
    isRunning ? pauseTimer() : startTimer()
  }

  function handleSkipButtonPress() {
    if (pomodoroState === 'pomodoro' && isRunning && !isPomodoroCompleted) {
      setIsOpen(true)
      return
    }

    switchPomodoroState()
  }

  function handleCancelSkipPress() {
    setIsOpen(false)
  }

  function handleConfirmSkipPress() {
    setIsOpen(false)
    switchPomodoroState()
  }

  return (
    <View className="flex flex-col px-6 py-8">
      <Modal
        visible={isOpen}
        title="Descartar foco atual?"
        description="Todo o progresso desta sessão de foco será perdido e não será contabilizado."
        confirmLabel="Descartar foco"
        cancelLabel="Continuar foco"
        onConfirm={handleConfirmSkipPress}
        onCancel={handleCancelSkipPress}
      />

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
              : pomodoroState === 'shortBreak'
                ? isRunning
                  ? 'Pausar pausa curta'
                  : 'Iniciar pausa curta'
                : isRunning
                  ? 'Pausar pausa longa'
                  : 'Iniciar pausa longa'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSkipButtonPress}
          className="flex items-center justify-center h-16 w-16 bg-secondary rounded-xl"
        >
          <SkipForward size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  )
}
