import { View, Text, Pressable, TextInput } from 'react-native'
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react-native'
import { TaskCardExpandedProps } from '../types/task-card-props'

export function TaskCardExpanded({
  newTaskName,
  newEstimatedPomodoros,
  completedPomodoros,
  onNewTaskNameChange,
  onIncreaseNewEstimatedPomodoros,
  onDecreaseNewEstimatedPomodoros,
  onSavePress,
  onCancelPress,
  onDeletePress,
}: TaskCardExpandedProps) {
  return (
    <View className="task__container border-l-0">
      <View className="flex-col">
        <View className="mb-5">
          <TextInput
            value={newTaskName}
            onChangeText={onNewTaskNameChange}
            className="task__input"
          />
        </View>

        <View className="flex-col gap-2">
          <Text className="font-inter-extra-bold text-sm uppercase text-tertiary">
            Pomodoros Estimados
          </Text>

          <View className="flex-row gap-4 items-center">
            <Text className="font-inter-bold text-tertiary text-2xl tracking-wider">
              {completedPomodoros} / {newEstimatedPomodoros}
            </Text>

            <View className="flex-col gap-2">
              <Pressable
                onPress={onIncreaseNewEstimatedPomodoros}
                className="button__icon border border-tertiary"
              >
                <ArrowUp />
              </Pressable>

              <Pressable
                onPress={onDecreaseNewEstimatedPomodoros}
                className="button__icon border border-tertiary"
              >
                <ArrowDown />
              </Pressable>
            </View>
          </View>
        </View>

        <View className="flex-row items-center">
          <Pressable
            className="button__icon bg-transparent"
            onPress={onDeletePress}
          >
            <Trash2 size={24} color="#777777" />
          </Pressable>

          <View className="flex-row gap-4">
            <Pressable
              onPress={onCancelPress}
              className="button__text bg-transparent"
            >
              <Text className="font-inter-bold text-sm text-tertiary uppercase">
                Cancelar
              </Text>
            </Pressable>

            <Pressable onPress={onSavePress} className="button__text bg-black">
              <Text className="font-inter-bold text-sm text-white uppercase">
                Salvar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}
