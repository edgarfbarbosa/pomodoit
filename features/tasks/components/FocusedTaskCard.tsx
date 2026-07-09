import { Clock5, Play } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import usePomodoroStore from '../../pomodoro/stores/usePomodoroStore'
import useTaskStore from '../stores/useTaskStore'

type FocusedTaskCardProps = {
  onStartFocusPress: () => void
}

function formatPomodoroMinutes(minutes: number) {
  return `${String(minutes).padStart(2, '0')}:00`
}

export function FocusedTaskCard({ onStartFocusPress }: FocusedTaskCardProps) {
  const currentTask = useTaskStore((state) =>
    state.tasks.find((task) => task.current),
  )

  const hasTimerRunning = usePomodoroStore((state) => state.hasTimerRunning)
  const pomodoroMinutes = usePomodoroStore((state) => state.pomodoroMinutes)
  const focusSessionTimeLabel = usePomodoroStore(
    (state) => state.focusSessionTimeLabel,
  )
  const focusSessionProgressPercentage = usePomodoroStore(
    (state) => state.focusSessionProgressPercentage,
  )

  const hasCurrentTask = Boolean(currentTask)
  const isFocusSessionActive = hasCurrentTask && hasTimerRunning
  const progressLabel = currentTask
    ? `${currentTask.completedPomodoros}/${currentTask.estimatedPomodoros}`
    : '0/0'
  const focusActionLabel = hasTimerRunning ? 'Continuar foco' : 'Iniciar foco'

  if (isFocusSessionActive) {
    return (
      <View className="relative min-h-[112px] w-full overflow-hidden rounded-xl border border-outline bg-surface-1 px-6 py-5">
        <View className="flex-1 flex-row items-center justify-between gap-5">
          <Text
            className="min-w-0 flex-1 font-inter-semi-bold text-2xl text-secondary"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {currentTask?.name}
          </Text>

          <Text className="shrink-0 font-inter-bold text-5xl text-primary">
            {focusSessionTimeLabel}
          </Text>
        </View>

        <View className="absolute right-0 bottom-0 left-0 h-1 bg-surface-3">
          <View
            className="h-full bg-primary"
            style={{ width: `${focusSessionProgressPercentage}%` }}
          />
        </View>
      </View>
    )
  }

  return (
    <View className="relative w-full overflow-hidden rounded-xl border border-outline bg-surface-1 py-5 pr-4 pl-7">
      <View className="absolute top-0 bottom-0 left-0 w-1 bg-primary" />

      <View className="flex-row items-center justify-between gap-4">
        <View className="min-w-0 flex-1">
          <Text
            className="font-inter-semi-bold text-2xl text-secondary"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {currentTask?.name ?? 'Nenhuma tarefa selecionada'}
          </Text>

          <View className="mt-2 flex-row items-center gap-2">
            <Clock5 size={15} color="#94A3B8" strokeWidth={2.3} />
            <Text className="font-inter-medium text-sm text-tertiary">
              {formatPomodoroMinutes(pomodoroMinutes)} • {progressLabel}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onStartFocusPress}
          disabled={!hasCurrentTask}
          accessibilityRole="button"
          accessibilityLabel={focusActionLabel}
          className={
            hasCurrentTask
              ? 'h-[72px] w-[72px] items-center justify-center rounded-xl border border-outline bg-surface-1'
              : 'h-[72px] w-[72px] items-center justify-center rounded-xl border border-outline bg-surface-2'
          }
        >
          <Play
            size={26}
            color={hasCurrentTask ? '#FFFFFF' : '#94A3B8'}
            strokeWidth={2.4}
          />
        </Pressable>
      </View>
    </View>
  )
}
