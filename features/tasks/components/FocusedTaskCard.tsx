import { Play } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import usePomodoroStore from '../../pomodoro/stores/usePomodoroStore'
import useTaskStore from '../stores/useTaskStore'

type FocusedTaskCardProps = {
  onStartFocusPress: () => void
}

export function FocusedTaskCard({ onStartFocusPress }: FocusedTaskCardProps) {
  const currentTask = useTaskStore((state) =>
    state.tasks.find((task) => task.current),
  )
  const completedPomodoros = currentTask?.completedPomodoros ?? 0
  const estimatedPomodoros = currentTask?.estimatedPomodoros ?? 0

  const hasTimerRunning = usePomodoroStore((state) => state.hasTimerRunning)
  const focusSessionTimeLabel = usePomodoroStore(
    (state) => state.focusSessionTimeLabel,
  )
  const focusSessionProgressPercentage = usePomodoroStore(
    (state) => state.focusSessionProgressPercentage,
  )

  const hasCurrentTask = Boolean(currentTask)
  const focusActionLabel = hasTimerRunning ? 'Continuar foco' : 'Iniciar foco'

  if (hasCurrentTask && hasTimerRunning) {
    return (
      <View className="relative min-h-[104px] w-full overflow-hidden rounded-xl border border-outline bg-surface-1 px-6 py-4">
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
    <View className="relative w-full overflow-hidden rounded-xl border border-outline bg-surface-1 py-4 pr-4 pl-7">
      <View className="absolute top-0 bottom-0 left-0 w-1 bg-primary" />

      <View className="flex-row items-center justify-between gap-4">
        <View className="min-w-0 flex-1 flex-row items-center justify-between">
          <Text
            className="min-w-0 flex-1 pr-3 font-inter-semi-bold text-2xl text-secondary"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {currentTask?.name ?? 'Nenhuma tarefa selecionada'}
          </Text>

          <View className="shrink-0 flex-row items-center gap-3">
            <Text className="font-inter text-tertiary text-xs uppercase -tracking-wide">
              <Text className="text-sm">{completedPomodoros}</Text> /{' '}
              {estimatedPomodoros}
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
              ? 'h-16 w-16 items-center justify-center rounded-xl border bg-primary'
              : 'h-16 w-16 items-center justify-center rounded-xl border border-outline bg-surface-2'
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
