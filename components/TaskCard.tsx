import { View, Text, Pressable } from 'react-native'
import { EllipsisVertical } from 'lucide-react-native'
import { TaskCardProps } from '../types/task-card-props'

export function TaskCard({
  name,
  completed,
  pomodoros,
  onEditPress,
}: TaskCardProps) {
  return (
    <View className="flex-col mx-4 mb-4 p-5 rounded-xl bg-surface-2 border-l-4 border-l-primary">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-8">
          <Text
            className={`text-xl font-inter-bold -tracking-wide
            ${completed ? 'line-through text-tertiary' : 'text-black'}`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <Text className="text-sm text-tertiary font-inter-bold uppercase -tracking-wide">
            <Text className="text-lg">0</Text> / {pomodoros}
          </Text>

          <Pressable
            onPress={onEditPress}
            className="w-10 h-10 items-center justify-center rounded-lg bg-surface"
          >
            <EllipsisVertical size={24} color="#333333" />
          </Pressable>
        </View>
      </View>
    </View>
  )
}
