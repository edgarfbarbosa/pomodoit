import { EllipsisVertical } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import type { TaskCardProps } from '../types/task-card-props'

/**
 * Exibe um cartão compacto de tarefa com nome, progresso em pomodoros, indicador
 * visual de tarefa atual e botão para abrir as ações de edição.
 *
 * Quando `current` é verdadeiro, o indicador lateral recebe destaque visual
 * para mostrar ao usuário qual tarefa está em andamento no momento.
 */
export function TaskCard({
  name,
  current,
  estimatedPomodoros,
  completedPomodoros,
  onCardPress,
  onEditPress,
}: TaskCardProps) {
  return (
    <Pressable
      onPress={onCardPress}
      className="my-2 min-h-20 w-full flex-col rounded-xl border border-outline bg-surface-1 p-4"
    >
      <View className="flex-row items-center justify-between gap-2">
        {/* Current task */}
        {current ? (
          <View
            className="h-6 w-6 items-center justify-center rounded-full border-2 border-primary"
            style={{
              shadowColor: '#2F80FF',
              shadowOpacity: 0.8,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 0 },
              elevation: 6,
            }}
          >
            <View className="h-1 w-1 rounded-full bg-primary" />
          </View>
        ) : (
          <View className="h-6 w-6 rounded-full border-2 border-outline" />
        )}

        <View className="flex-1 pr-8">
          {/* Task name */}
          <Text
            className="font-inter-semi-bold text-base text-secondary -tracking-wide"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          {/* Pomodoro progress */}
          <Text className="font-inter text-tertiary text-xs uppercase -tracking-wide">
            <Text className="text-sm">{completedPomodoros}</Text> /{' '}
            {estimatedPomodoros}
          </Text>

          {/* Vert icon */}
          <Pressable
            onPress={onEditPress}
            className="h-10 w-10 items-center justify-center rounded-lg bg-surface-1"
          >
            <EllipsisVertical size={20} color="#A9B5C6" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  )
}
