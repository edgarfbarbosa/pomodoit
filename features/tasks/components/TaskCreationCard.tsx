import { Plus } from 'lucide-react-native'
import { Pressable, Text } from 'react-native'
import type { TaskCreationCardProps } from '../types/task-creation-card-props'

export function TaskCreationCard({ onOpenFormPress }: TaskCreationCardProps) {
  return (
    <Pressable
      onPress={onOpenFormPress}
      className="h-16 w-full flex-row items-center justify-start gap-4 rounded-xl border border-outline border-dashed bg-surface-1 px-5"
    >
      <Plus size={22} color="#0066FF" />

      <Text className="font-inter text-base text-tertiary -tracking-wide">
        Adicionar tarefa
      </Text>
    </Pressable>
  )
}
