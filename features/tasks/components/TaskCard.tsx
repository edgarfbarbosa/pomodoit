import { Check, EllipsisVertical } from 'lucide-react-native'
import { type GestureResponderEvent, Pressable, Text, View } from 'react-native'
import type { TaskCardProps } from '../types/task-card-props'

export function TaskCard({
  name,
  current,
  estimatedPomodoros,
  completedPomodoros,
  isCompleted,
  onCardPress,
  onEditPress,
}: TaskCardProps) {
  /**
   * Trata o toque no botão de edição da tarefa.
   *
   * O `event.stopPropagation()` impede que o toque no botão de edição
   * também acione o `onCardPress` do Pressable externo.
   */
  function handleEditPress(event: GestureResponderEvent) {
    event.stopPropagation()
    onEditPress()
  }

  return (
    <Pressable
      onPress={onCardPress}
      className={
        isCompleted
          ? 'min-h-16 w-full flex-row items-center rounded-xl border border-outline bg-surface-0 px-4 py-3 opacity-80'
          : 'min-h-16 w-full flex-row items-center rounded-xl border border-outline bg-surface-1 px-4 py-3'
      }
    >
      {isCompleted ? (
        <View className="h-6 w-6 items-center justify-center rounded-md border border-primary bg-surface-1">
          <Check size={14} color="#0066FF" strokeWidth={2.6} />
        </View>
      ) : current ? (
        <View className="h-6 w-6 items-center justify-center">
          <View className="h-2.5 w-2.5 rounded-full bg-primary" />
        </View>
      ) : (
        <View className="h-6 w-6 items-center justify-center">
          <View className="h-2.5 w-2.5 rounded-full border border-tertiary" />
        </View>
      )}

      <View className="ml-4 min-w-0 flex-1 pr-4">
        <Text
          className={
            isCompleted
              ? 'font-inter-semi-bold text-base text-tertiary line-through'
              : 'font-inter-semi-bold text-base text-secondary'
          }
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        <Text className="font-inter text-tertiary text-xs uppercase -tracking-wide">
          <Text className="text-sm">{completedPomodoros}</Text> /{' '}
          {estimatedPomodoros}
        </Text>

        <Pressable
          onPress={handleEditPress}
          className="h-10 w-8 items-center justify-center rounded-lg"
          accessibilityRole="button"
          accessibilityLabel="Editar tarefa"
        >
          <EllipsisVertical
            size={20}
            color={isCompleted ? '#38393D' : '#94A3B8'}
            strokeWidth={2.4}
          />
        </Pressable>
      </View>
    </Pressable>
  )
}
