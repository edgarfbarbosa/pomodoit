import { ArrowDown, ArrowUp } from 'lucide-react-native'
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
    <View className="px-4 mb-4">
      <View className="w-full bg-white border-solid border-2 border-black p-6">
        <View>
          <Text className="text-xs font-inter-extra-bold text-primary uppercase mb-2">
            Nova tarefa
          </Text>

          <TextInput
            placeholder="NOME DA TAREFA"
            className="task__input"
            value={taskName}
            onChangeText={onTaskNameChange}
          />
        </View>

        <View>
          <Text className="text-xs font-inter-bold text-primary uppercase my-3">
            Pomodoros estimados
          </Text>

          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-5xl font-inter-black text-black">
              {pomodoroAmount}
            </Text>

            <Pressable
              onPress={onIncreasePomodoroPress}
              className="button__icon border border-tertiary"
            >
              <ArrowUp />
            </Pressable>

            <Pressable
              onPress={onDecreasePomodoroPress}
              className="button__icon border border-tertiary"
            >
              <ArrowDown />
            </Pressable>
          </View>
        </View>

        <View className="flex-row">
          <Pressable
            onPress={onCreateTaskPress}
            className="button__text bg-black"
          >
            <Text className="text-white font-inter-bold uppercase">
              Adicionar
            </Text>
          </Pressable>

          <Pressable
            onPress={onCancelPress}
            className="button__text bg-transparent"
          >
            <Text className="text-black font-inter-bold uppercase underline">
              Cancelar
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
