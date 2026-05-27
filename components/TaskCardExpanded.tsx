import { View, Text, Pressable, TextInput } from 'react-native'
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react-native'
import { TaskCardExpandedProps } from '../types/task-card-props'

export function TaskCardExpanded({
  newTaskName,
  newPomodoroAmount,
  onNewTaskNameChange,
  onIncreaseNewPomodoroAmount,
  onDecreaseNewPomodoroAmount,
  onSavePress,
  onCancelPress,
  onDeletePress,
}: TaskCardExpandedProps) {
  return (
    <View className="flex-col mx-4 mb-4 p-5 rounded-xl bg-surface-2 border-l-4 border-l-primary">
      <View className="flex-col">
        <View className="mb-5">
          <TextInput
            value={newTaskName}
            onChangeText={onNewTaskNameChange}
            className="text-2xl font-inter-bold border-b border-solid border-tertiary py-3 focus:outline-none"
          />
        </View>

        <View className="flex-col gap-2">
          <Text className="font-inter-extra-bold text-sm uppercase text-tertiary">
            Act / Pomodoros Estimados
          </Text>

          <View className="flex-row gap-4 items-center">
            <Text className="font-inter-bold text-tertiary text-2xl">0</Text>
            <Text className="font-inter-bold text-tertiary text-2xl">/</Text>
            <Text className="font-inter-bold text-tertiary text-2xl">
              {newPomodoroAmount}
            </Text>

            <View className="flex-col gap-2">
              <Pressable
                onPress={onIncreaseNewPomodoroAmount}
                className="w-10 h-10 border border-tertiary items-center justify-center"
              >
                <ArrowUp />
              </Pressable>

              <Pressable
                onPress={onDecreaseNewPomodoroAmount}
                className="w-10 h-10 border border-tertiary items-center justify-center"
              >
                <ArrowDown />
              </Pressable>
            </View>
          </View>
        </View>

        <View className="flex-row items-center">
          <Pressable onPress={onDeletePress}>
            <Trash2 size={24} color="#777777" />
          </Pressable>

          <View className="flex-row gap-4">
            <Pressable
              onPress={onCancelPress}
              className="h-12 w-32 font-inter-bold items-center justify-center text-tertiary bg-transparent rounded-lg text-sm uppercase"
            >
              Cancel
            </Pressable>

            <Pressable
              onPress={onSavePress}
              className="h-12 w-32 font-inter-bold items-center justify-center text-white bg-black rounded-lg text-sm uppercase"
            >
              Save
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}
