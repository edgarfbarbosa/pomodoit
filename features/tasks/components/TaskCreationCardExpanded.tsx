import { Minus, Plus } from 'lucide-react-native'
import { Pressable, Text, TextInput, View } from 'react-native'
import type { TaskCreationCardExpandedProps } from '../types/task-creation-card-props'

export function TaskCreationCardExpanded({
  taskName,
  pomodoroAmount,
  onTaskNameChange,
  onIncreasePomodoroPress,
  onDecreasePomodoroPress,
  onCreateTaskPress,
  onCancelPress,
}: TaskCreationCardExpandedProps) {
  return (
    <View className="w-full rounded-xl border border-outline bg-surface-1 p-5">
      <View>
        <Text className="mb-2 font-inter text-tertiary text-xs">
          Nova tarefa
        </Text>

        {/* Input new task */}
        <TextInput
          placeholder="Nome da tarefa..."
          className="h-14 rounded-xl border border-outline bg-surface-2 px-3 font-inter-medium text-base text-secondary -tracking-wide focus:outline-none"
          value={taskName}
          onChangeText={onTaskNameChange}
        />
      </View>

      <View className="mt-4 flex-row items-end justify-between">
        <View>
          <Text className="mb-2 font-inter-bold text-[10px] text-tertiary uppercase tracking-wider">
            Pomodoros estimados
          </Text>

          {/* Stepper (+/-) */}
          <View className="h-11 w-36 flex-row items-center justify-center gap-4 overflow-hidden rounded-lg border border-outline bg-surface-2">
            <Pressable
              onPress={onDecreasePomodoroPress}
              className="h-full w-7 items-center justify-center"
            >
              <Minus width={20} color="#FFFFFF" />
            </Pressable>
            <View className="h-full w-9 items-center justify-center">
              <Text className="text-center font-inter-bold text-base text-secondary">
                {pomodoroAmount}
              </Text>
            </View>
            <Pressable
              onPress={onIncreasePomodoroPress}
              className="h-full w-7 items-center justify-center"
            >
              <Plus width={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {/* Buttons Add/Cancel */}
        <View className="flex-row flex-row-reverse">
          <Pressable
            onPress={onCreateTaskPress}
            className="h-12 w-32 flex-row items-center justify-center rounded-xl bg-primary"
          >
            <Plus width={16} color="#FFFFFF" />
            <Text className="font-inter-bold text-base text-white">
              Adicionar
            </Text>
          </Pressable>

          <Pressable
            onPress={onCancelPress}
            className="h-12 w-32 items-center justify-center rounded-xl bg-transparent"
          >
            <Text className="font-inter-bold text-tertiary underline">
              Cancelar
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
