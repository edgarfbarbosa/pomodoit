import { Plus } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'
import type { TaskCreationCardProps } from '../types/task-creation-card-props'

export function TaskCreationCard({ onOpenFormPress }: TaskCreationCardProps) {
  return (
    <View className="px-4 mb-4">
      <Pressable
        onPress={onOpenFormPress}
        className="items-center justify-center h-36 w-full rounded-xl bg-white border-dashed border-2 border-tertiary p-6"
      >
        <View className="items-center">
          <Plus size={32} color="#777777" />

          <Text className="text-base font-inter-bold text-tertiary uppercase">
            Adicionar tarefa
          </Text>
        </View>
      </Pressable>
    </View>
  )
}
