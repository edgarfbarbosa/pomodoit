import { Minus, Plus, Trash } from 'lucide-react-native'
import { Pressable, Text, TextInput, View } from 'react-native'
import type { TaskCardExpandedProps } from '../types/task-card-props'

/**
 * Exibe o modo expandido do cartão de tarefa para edição.
 *
 * Permite alterar o nome da tarefa, ajustar a quantidade estimada de pomodoros
 * pelo controle de incremento e decremento, além de salvar, cancelar ou deletar
 * a tarefa atual.
 */
export function TaskCardExpanded({
  newTaskName,
  newEstimatedPomodoros,
  onNewTaskNameChange,
  onIncreaseNewEstimatedPomodoros,
  onDecreaseNewEstimatedPomodoros,
  onSavePress,
  onCancelPress,
  onDeletePress,
}: TaskCardExpandedProps) {
  return (
    <View className="my-2 min-h-20 w-full flex-col rounded-xl border border-outline bg-surface-1 p-4">
      <View className="flex-col">
        <View className="mb-5">
          {/* Input new task name */}
          <TextInput
            value={newTaskName}
            onChangeText={onNewTaskNameChange}
            className="border-outline border-b border-solid py-3 font-inter-semi-bold text-base text-secondary focus:outline-none"
          />
        </View>

        <View className="mb-6 flex-col gap-3">
          <Text className="font-inter-bold text-tertiary text-xs uppercase tracking-wider">
            Pomodoros estimados
          </Text>

          {/* Stepper (+/-) */}
          <View className="h-11 w-36 flex-row items-center justify-center gap-4 overflow-hidden rounded-lg border border-outline bg-surface-2">
            <Pressable
              onPress={onDecreaseNewEstimatedPomodoros}
              className="h-full w-7 items-center justify-center"
            >
              <Minus width={20} color="#FFFFFF" />
            </Pressable>
            <View className="h-full w-9 items-center justify-center">
              <Text className="text-center font-inter-bold text-base text-secondary">
                {newEstimatedPomodoros}
              </Text>
            </View>
            <Pressable
              onPress={onIncreaseNewEstimatedPomodoros}
              className="h-full w-7 items-center justify-center"
            >
              <Plus width={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View className="flex-row items-center justify-between border-outline border-t py-3">
          <Pressable
            onPress={onDeletePress}
            className="h-10 w-28 flex-row items-center justify-center gap-1 rounded-lg"
          >
            <Trash size={18} color="#FF4444" />
            <Text className="font-inter-medium text-[#FF4444] text-sm">
              Deletar
            </Text>
          </Pressable>

          <View className="flex-row gap-2">
            <Pressable
              onPress={onCancelPress}
              className="h-10 w-28 flex-row items-center justify-center gap-1 rounded-lg"
            >
              <Text className="font-inter-medium text-sm text-tertiary">
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              onPress={onSavePress}
              className="h-10 w-28 flex-row items-center justify-center gap-1 rounded-lg bg-primary"
            >
              <Text className="font-inter-medium text-secondary text-sm">
                Salvar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}
