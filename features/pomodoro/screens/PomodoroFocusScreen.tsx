import {
  Check,
  Clock5,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
} from 'lucide-react-native'
import { useCallback, useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { ConfirmCancelModal } from '../../../components/ConfirmCancelModal'
import useTaskStore from '../../tasks/stores/useTaskStore'
import { usePomodoro } from '../hooks/usePomodoro'
import { usePomodoroNotifications } from '../hooks/usePomodoroNotifications'
import { usePomodoroSounds } from '../hooks/usePomodoroSounds'
import usePomodoroStore from '../stores/usePomodoroStore'

type DiscardFocusAction = 'reset' | 'skip'

function getSecondsUntilSessionEnd(sessionEndAt: number) {
  const timestamp = Date.now() / 1000

  return Math.max(1, Math.ceil(sessionEndAt - timestamp))
}

function getPomodoroNotificationContent(
  pomodoroState: 'pomodoro' | 'shortBreak' | 'longBreak',
) {
  switch (pomodoroState) {
    case 'pomodoro':
      return {
        title: 'Foco concluído',
        body: 'Sua sessão de foco terminou. Hora de fazer uma pausa.',
      }
    case 'shortBreak':
      return {
        title: 'Pausa curta concluída',
        body: 'Sua pausa curta terminou. Hora de voltar ao foco.',
      }
    case 'longBreak':
      return {
        title: 'Pausa longa concluída',
        body: 'Sua pausa longa terminou. Hora de voltar ao foco.',
      }
  }
}

function formatFocusTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes}min`

  if (minutes === 0) return `${hours}h`

  return `${hours}h ${minutes}m`
}

function getSessionDurationInSeconds(
  pomodoroState: 'pomodoro' | 'shortBreak' | 'longBreak',
  pomodoroMinutes: number,
  shortBreakMinutes: number,
  longBreakMinutes: number,
) {
  if (pomodoroState === 'pomodoro') return pomodoroMinutes * 60

  if (pomodoroState === 'shortBreak') return shortBreakMinutes * 60

  return longBreakMinutes * 60
}

function getSessionProgressPercentage(
  remainingSeconds: number,
  sessionDurationInSeconds: number,
) {
  if (sessionDurationInSeconds <= 0) return 0

  return Math.min(
    100,
    Math.round(
      ((sessionDurationInSeconds - remainingSeconds) /
        sessionDurationInSeconds) *
        100,
    ),
  )
}

export function PomodoroFocusScreen() {
  const [discardFocusAction, setDiscardFocusAction] =
    useState<DiscardFocusAction | null>(null)
  const [isCompleteTaskModalOpen, setIsCompleteTaskModalOpen] = useState(false)

  const tasks = useTaskStore((state) => state.tasks)

  const currentTask = useTaskStore((state) =>
    state.tasks.find((task) => task.current),
  )

  const setCompletedPomodoros = useTaskStore(
    (state) => state.setCompletedPomodoros,
  )

  const setCompletedTask = useTaskStore((state) => state.setCompletedTask)

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

  const setFocusSessionPreview = usePomodoroStore(
    (state) => state.setFocusSessionPreview,
  )

  const {
    playTimerControlSound,
    playFocusCompleteSound,
    playBreakCompleteSound,
  } = usePomodoroSounds()

  const { schedulePomodoroNotification, cancelPomodoroNotification } =
    usePomodoroNotifications()

  const handlePomodoroComplete = useCallback(() => {
    playFocusCompleteSound()

    if (!currentTask) return

    const updatedCompletedPomodoros = currentTask.completedPomodoros + 1

    setCompletedPomodoros(currentTask.id, updatedCompletedPomodoros)

    const hasCompletedEstimatedPomodoros =
      currentTask.completedPomodoros < currentTask.estimatedPomodoros &&
      updatedCompletedPomodoros >= currentTask.estimatedPomodoros &&
      !currentTask.isCompleted

    if (hasCompletedEstimatedPomodoros) {
      setIsCompleteTaskModalOpen(true)
    }
  }, [currentTask, playFocusCompleteSound, setCompletedPomodoros])

  const handleBreakComplete = useCallback(() => {
    playBreakCompleteSound()
  }, [playBreakCompleteSound])

  const {
    countdown,
    sessionEndAt,
    formattedTime,
    isRunning,
    startTimer,
    pauseTimer,
    resetCurrentSession,
    pomodoroState,
    switchPomodoroState,
    isPomodoroCompleted,
  } = usePomodoro(
    pomodoroMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    handlePomodoroComplete,
    handleBreakComplete,
    roundsBeforeLongBreak,
    autoStartBreaks,
    autoStartFocus,
  )

  function handleStartOrPauseButtonPress() {
    playTimerControlSound()

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

  useEffect(() => {
    if (!isRunning || !sessionEndAt) {
      cancelPomodoroNotification()
      return
    }

    const notificationContent = getPomodoroNotificationContent(pomodoroState)

    schedulePomodoroNotification({
      seconds: getSecondsUntilSessionEnd(sessionEndAt),
      title: notificationContent.title,
      body: notificationContent.body,
    })

    return () => {
      cancelPomodoroNotification()
    }
  }, [
    isRunning,
    sessionEndAt,
    pomodoroState,
    schedulePomodoroNotification,
    cancelPomodoroNotification,
  ])

  function shouldConfirmDiscardFocus() {
    return pomodoroState === 'pomodoro' && isRunning && !isPomodoroCompleted
  }

  function handleResetButtonPress() {
    playTimerControlSound()

    if (shouldConfirmDiscardFocus()) {
      setDiscardFocusAction('reset')
      return
    }

    resetCurrentSession()
  }

  function handleSkipButtonPress() {
    playTimerControlSound()

    if (shouldConfirmDiscardFocus()) {
      setDiscardFocusAction('skip')
      return
    }

    switchPomodoroState()
  }

  function handleCancelDiscardFocus() {
    setDiscardFocusAction(null)
  }

  function handleConfirmDiscardFocus() {
    if (discardFocusAction === 'reset') {
      resetCurrentSession()
    }

    if (discardFocusAction === 'skip') {
      switchPomodoroState()
    }

    setDiscardFocusAction(null)
  }

  function handleConfirmTaskCompletion() {
    if (currentTask) {
      setCompletedTask(currentTask.id)
    }

    setIsCompleteTaskModalOpen(false)
  }

  function handleCancelTaskCompletion() {
    setIsCompleteTaskModalOpen(false)
  }

  const taskNameOrDefaultMessage =
    currentTask?.name ?? 'Nenhuma tarefa selecionada'

  const completedTasks = tasks.filter((task) => task.isCompleted)
  const totalCompletedPomodoros = tasks.reduce(
    (total, task) => total + task.completedPomodoros,
    0,
  )
  const totalFocusMinutes = totalCompletedPomodoros * pomodoroMinutes
  const recentCompletedTasks = completedTasks.slice(0, 3)
  const isDiscardFocusModalOpen = Boolean(discardFocusAction)
  const sessionDurationInSeconds = getSessionDurationInSeconds(
    pomodoroState,
    pomodoroMinutes,
    shortBreakMinutes,
    longBreakMinutes,
  )
  const sessionProgressPercentage = getSessionProgressPercentage(
    countdown,
    sessionDurationInSeconds,
  )

  useEffect(() => {
    setFocusSessionPreview({
      timeLabel: formattedTime,
      progressPercentage: sessionProgressPercentage,
    })
  }, [formattedTime, sessionProgressPercentage, setFocusSessionPreview])

  return (
    <ScrollView
      className="flex-1 bg-surface-0"
      contentContainerClassName="px-6 pt-8 pb-10"
      showsVerticalScrollIndicator={false}
    >
      <ConfirmCancelModal
        isVisible={isDiscardFocusModalOpen}
        title="Descartar foco atual?"
        description="Todo o progresso desta sessão de foco será perdido e não será contabilizado."
        confirmActionLabel="Descartar foco"
        cancelActionLabel="Continuar foco"
        onConfirmAction={handleConfirmDiscardFocus}
        onCancelAction={handleCancelDiscardFocus}
      />

      <ConfirmCancelModal
        isVisible={isCompleteTaskModalOpen}
        title="Concluir tarefa?"
        description="Esta tarefa atingiu a estimativa de pomodoros. Deseja marcá-la como concluída?"
        confirmActionLabel="Concluir tarefa"
        cancelActionLabel="Continuar aberta"
        onConfirmAction={handleConfirmTaskCompletion}
        onCancelAction={handleCancelTaskCompletion}
      />

      <View className="items-center">
        <View className="h-72 w-72 items-center justify-center rounded-full border-4 border-primary bg-surface-0">
          <Text className="font-inter-bold text-7xl text-secondary">
            {formattedTime}
          </Text>
        </View>

        <Text
          className="mt-5 text-center font-inter-medium text-base text-tertiary"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {taskNameOrDefaultMessage}
        </Text>
      </View>

      <View className="mt-12 flex-row items-center justify-center gap-5">
        <Pressable
          onPress={handleResetButtonPress}
          className="h-16 w-16 items-center justify-center rounded-2xl border border-outline bg-surface-0"
          accessibilityLabel="Reiniciar etapa"
        >
          <RotateCcw size={26} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>

        <Pressable
          onPress={handleStartOrPauseButtonPress}
          className="h-16 flex-1 flex-row items-center justify-center gap-3 rounded-2xl bg-primary"
        >
          {isRunning ? (
            <Pause size={24} strokeWidth={2.5} color="#FFFFFF" />
          ) : (
            <Play size={24} strokeWidth={2.5} color="#FFFFFF" />
          )}
          <Text className="font-inter-bold text-secondary text-xl">
            {isRunning ? 'Pausar' : 'Começar'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSkipButtonPress}
          className="h-16 w-16 items-center justify-center rounded-2xl border border-outline bg-surface-0"
          accessibilityLabel="Avançar etapa"
        >
          <SkipForward size={26} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>

      <View className="mt-10 border-outline border-y py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Clock5 size={18} color="#94A3B8" strokeWidth={2.5} />
            <Text className="font-inter-semi-bold text-base text-tertiary">
              {totalCompletedPomodoros} Pomodoros
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Clock5 size={18} color="#94A3B8" strokeWidth={2.5} />
            <Text className="font-inter-semi-bold text-base text-tertiary">
              {formatFocusTime(totalFocusMinutes)}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-5 gap-4">
        <Text className="font-inter-bold text-lg text-secondary">
          Tarefas concluídas
        </Text>

        {recentCompletedTasks.length > 0 ? (
          <View className="gap-3">
            {recentCompletedTasks.map((task) => (
              <View
                key={task.id}
                className="flex-row items-center justify-between gap-3"
              >
                <View className="min-w-0 flex-1 flex-row items-center gap-3">
                  <View className="h-6 w-6 items-center justify-center rounded-md bg-primary">
                    <Check size={15} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <Text
                    className="flex-1 font-inter-medium text-base text-tertiary line-through"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {task.name}
                  </Text>
                </View>

                <Text className="font-inter-medium text-sm text-tertiary">
                  {formatFocusTime(task.completedPomodoros * pomodoroMinutes)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="font-inter text-base text-tertiary">
            Nenhuma tarefa concluída ainda.
          </Text>
        )}
      </View>
    </ScrollView>
  )
}
