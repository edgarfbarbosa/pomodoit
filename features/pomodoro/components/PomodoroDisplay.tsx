import { Clock5, Pause, Play, SkipForward } from 'lucide-react-native'
import { useCallback, useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Modal } from '../../../components/Modal'
import useTaskStore from '../../tasks/stores/useTaskStore'
import { usePomodoro } from '../hooks/usePomodoro'
import usePomodoroStore from '../stores/usePomodoroStore'

/**
 * Exibe a tarefa atual, o tempo restante, o estágio do ciclo e as ações
 * rápidas para iniciar, pausar ou avançar a sessão.
 */
export function PomodoroDisplay() {
  const [isOpen, setIsOpen] = useState(false)

  const currentTask = useTaskStore((state) =>
    state.tasks.find((task) => task.current),
  )

  const setCompletedPomodoros = useTaskStore(
    (state) => state.setCompletedPomodoros,
  )

  const pomodoroMinutes = usePomodoroStore((state) => state.pomodoroMinutes)

  const shortBreakMinutes = usePomodoroStore((state) => state.shortBreakMinutes)

  const longBreakMinutes = usePomodoroStore((state) => state.longBreakMinutes)

  const roundsBeforeLongBreak = usePomodoroStore(
    (state) => state.roundsBeforeLongBreak,
  )

  const autoStartBreaks = usePomodoroStore((state) => state.autoStartBreaks)

  const autoStartFocus = usePomodoroStore((state) => state.autoStartFocus)

  const setHasTimerRunning = usePomodoroStore(
    (state) => state.setHasTimerRunning,
  )

  /**
   * Função entregue ao hook `usePomodoro` como callback.
   * A função inform ao hook: "quando um pomodoro terminar, execute isto".
   * Ela não roda quando o usuário pausa, pula ou troca de ciclo manualmente.
   * Ela é chamada somente quando o contador chega a zero durante o estágio de
   * foco. Nesse momento, se existir uma tarefa atual, o total de pomodoros
   * concluídos dessa tarefa recebe um incremento.
   */
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
    pomodoroMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    handlePomodoroComplete,
    roundsBeforeLongBreak,
    autoStartBreaks,
    autoStartFocus,
  )

  function handleStartOrPauseButtonPress() {
    if (isRunning) {
      pauseTimer()
      setHasTimerRunning(false)
      return
    }

    startTimer()
    setHasTimerRunning(true)
  }

  useEffect(() => {
    setHasTimerRunning(isRunning)
  }, [isRunning, setHasTimerRunning])

  /**
   * Controla o avanço manual do ciclo. Durante um pomodoro em andamento, exige
   * confirmação antes de descartar o foco atual; em pausas ou ciclos já
   * concluídos, permite avançar imediatamente para manter o fluxo simples.
   */
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
    <View className="flex flex-col rounded-2xl border-primary border-l-4 bg-surface-1 p-6">
      <Modal
        visible={isOpen}
        title="Descartar foco atual?"
        description="Todo o progresso desta sessão de foco será perdido e não será contabilizado."
        confirmLabel="Descartar foco"
        cancelLabel="Continuar foco"
        onConfirm={handleConfirmSkipModalButtonPress}
        onCancel={handleCancelSkipModalButtonPress}
      />

      <View className="mb-3 flex-row justify-between">
        <View className="flex-1 flex-row items-center gap-2">
          {/* Badge */}
          <Text className="rounded-md bg-primary px-2 py-1 font-inter-extra-bold text-secondary text-xs uppercase">
            {getPomodoroStateLabel()}
          </Text>
          {/* Task */}
          <Text className="font-inter-semi-bold text-tertiary text-xs uppercase tracking-wider">
            {taskNameOrDefaultMessage}
          </Text>
        </View>

        {/* Session Badge */}
        <View className="flex-row items-center justify-center gap-1 rounded-md bg-primary px-2 py-1">
          <Clock5 size={12} color="#FFFFFF" strokeWidth={3} />
          <Text className="font-inter-semi-bold text-secondary text-xs">
            {currentTask
              ? `${currentTask.completedPomodoros}/${currentTask.estimatedPomodoros}`
              : '0/0'}
          </Text>
        </View>
      </View>

      {/* Timer */}
      <View className="mb-4">
        <Text className="font-inter-bold text-7xl text-secondary tracking-tighter">
          {formattedTime}
        </Text>
      </View>

      <View className="flex-row items-center justify-center gap-3">
        <Pressable
          onPress={handleStartOrPauseButtonPress}
          className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-secondary"
        >
          {isRunning ? (
            <Pause size={20} strokeWidth={2} color="#000000" />
          ) : (
            <Play size={20} strokeWidth={2} color="#000000" />
          )}
          <Text className="font-inter-bold text-black text-sm uppercase">
            {isRunning ? 'Pausar' : 'Iniciar'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSkipButtonPress}
          className="h-12 w-12 items-center justify-center rounded-xl border border-outline bg-surface-2"
        >
          <SkipForward size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  )
}
