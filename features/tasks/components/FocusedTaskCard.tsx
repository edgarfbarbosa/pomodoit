import { Check, Circle, Play } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import usePomodoroStore from '../../pomodoro/stores/usePomodoroStore'
import useTaskStore from '../stores/useTaskStore'

type FocusedTaskCardProps = {
  onStartFocusPress: () => void
}

function getTaskProgressPercentage(
  completedPomodoros: number,
  estimatedPomodoros: number,
) {
  if (estimatedPomodoros <= 0) return 0

  return Math.min(
    100,
    Math.round((completedPomodoros / estimatedPomodoros) * 100),
  )
}

export function FocusedTaskCard({ onStartFocusPress }: FocusedTaskCardProps) {
  const currentTask = useTaskStore((state) =>
    state.tasks.find((task) => task.current),
  )

  const hasTimerRunning = usePomodoroStore((state) => state.hasTimerRunning)

  const taskProgressPercentage = currentTask
    ? getTaskProgressPercentage(
        currentTask.completedPomodoros,
        currentTask.estimatedPomodoros,
      )
    : 0

  const hasCurrentTask = Boolean(currentTask)
  const isCompleted = currentTask?.isCompleted ?? false
  const statusLabel = hasCurrentTask
    ? isCompleted
      ? 'CONCLUÍDA'
      : 'PENDENTE'
    : 'SEM TAREFA'
  const actionLabel = hasTimerRunning ? 'Continuar Foco' : 'Iniciar Foco'

  return (
    <View className="relative w-full overflow-hidden rounded-xl border border-outline bg-surface-1 py-5 pr-5 pl-6">
      <View className="absolute top-0 bottom-0 left-0 w-1 bg-primary" />

      <View className="mb-3 flex-row items-center justify-between gap-3">
        <Text className="font-inter-bold text-tertiary text-xs uppercase tracking-wider">
          Tarefa em foco
        </Text>

        <View className="flex-row items-center gap-1.5">
          {isCompleted ? (
            <View className="h-4 w-4 items-center justify-center rounded-full bg-primary">
              <Check size={11} color="#FFFFFF" strokeWidth={3} />
            </View>
          ) : (
            <Circle size={14} color="#94A3B8" strokeWidth={2.5} />
          )}

          <Text className="font-inter-bold text-tertiary text-xs uppercase tracking-wider">
            {statusLabel}
          </Text>
        </View>
      </View>

      <Text
        className="font-inter-semi-bold text-secondary text-xl"
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {currentTask?.name ?? 'Nenhuma tarefa selecionada'}
      </Text>

      <View className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-3">
        <View
          className="h-full rounded-full bg-primary"
          style={{ width: `${taskProgressPercentage}%` }}
        />
      </View>

      <Pressable
        onPress={onStartFocusPress}
        disabled={!hasCurrentTask}
        className={
          hasCurrentTask
            ? 'mt-5 h-12 flex-row items-center justify-center gap-2 rounded-lg bg-secondary'
            : 'mt-5 h-12 flex-row items-center justify-center gap-2 rounded-lg bg-surface-2'
        }
      >
        <Play
          size={18}
          color={hasCurrentTask ? '#0066FF' : '#94A3B8'}
          strokeWidth={2.5}
        />

        <Text
          className={
            hasCurrentTask
              ? 'font-inter-medium text-base text-primary'
              : 'font-inter-medium text-base text-tertiary'
          }
        >
          {hasCurrentTask ? actionLabel : 'Selecione uma tarefa'}
        </Text>
      </Pressable>
    </View>
  )
}
