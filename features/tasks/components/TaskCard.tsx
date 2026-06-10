import { View, Text, Pressable } from 'react-native'
import { EllipsisVertical } from 'lucide-react-native'
import { TaskCardProps } from '../types/task-card-props'

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
      className={`task__container ${
        current ? 'border-l-primary' : 'border-l-transparent'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-8">
          <Text
            className="text-xl font-inter-bold -tracking-wide text-black"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <Text className="text-sm text-tertiary font-inter-bold uppercase -tracking-wide">
            <Text className="text-lg">{completedPomodoros}</Text> /{' '}
            {estimatedPomodoros}
          </Text>

          <Pressable onPress={onEditPress} className="button__icon bg-surface">
            <EllipsisVertical size={24} color="#333333" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  )
}
