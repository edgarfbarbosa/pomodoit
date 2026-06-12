import { Clock5, Pause, Play, SkipForward } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import { Button } from '../../../components/Button'
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

  function handleCancelSkipModalButtonPress() {
    setIsOpen(false)
  }

  function handleConfirmSkipModalButtonPress() {
    setIsOpen(false)
    switchPomodoroState()
  }

  const taskNameOrDefaultMessage =
    currentTask?.name ?? 'Nenhuma tarefa selecionada'

  function getPomodoroStateLabel() {
    switch (pomodoroState) {
      case 'pomodoro':
        return 'Pomodoro'
      case 'shortBreak':
        return 'Pausa curta'
      case 'longBreak':
        return 'Pausa longa'
    }
  }

  return (
    <View className="flex flex-col px-6 py-8">
      <Modal
        visible={isOpen}
        title="Descartar foco atual?"
        description="Todo o progresso desta sessão de foco será perdido e não será contabilizado."
        confirmLabel="Descartar foco"
        cancelLabel="Continuar foco"
        onConfirm={handleConfirmSkipModalButtonPress}
        onCancel={handleCancelSkipModalButtonPress}
      />

      <View className="flex-row justify-between">
        <View className="flex-col flex-1">
          <Text className="font-inter-black text-sm text-primary uppercase">
            {getPomodoroStateLabel()}
          </Text>

          <Text className="font-inter-black text-lg text-secondary uppercase">
            {taskNameOrDefaultMessage}
          </Text>
        </View>

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
        <View className="flex-1">
          <Button
            onPress={handleStartOrPauseButtonPress}
            className="h-16 flex-row items-center justify-center gap-3 px-8 py-4"
          >
            {isRunning ? (
              <Pause size={20} color="#FFFFFF" />
            ) : (
              <Play size={20} color="#FFFFFF" />
            )}

            <Text className="font-inter-black text-lg text-center text-white tracking-widest uppercase">
              {isRunning ? 'Pausar' : 'Iniciar'}
            </Text>
          </Button>
        </View>

        <Button
          onPress={handleSkipButtonPress}
          className="h-16 w-16 items-center justify-center"
        >
          <SkipForward size={20} color="#FFFFFF" />
        </Button>
      </View>
    </View>
  )
}
