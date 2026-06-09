import { View, Text, Pressable } from 'react-native'
import { Play, Clock5 } from 'lucide-react-native'
import useTaskStore from '../../../stores/useTaskStore'
import { usePomodoro } from '../hooks/usePomodoro'

export function PomodoroDisplay() {
  const currentTaskName = useTaskStore(
    (state) => state.tasks.find((task) => task.current)?.name,
  )

  const { formattedTime, startPomodoro } = usePomodoro()

  return (
    <View className="flex flex-col px-6 py-8">
      <View className="flex-row justify-between">
        <Text className="font-inter-black text-lg text-primary uppercase">
          {currentTaskName ?? 'Nenhuma tarefa selecionada'}
        </Text>
        <View className="flex-row items-center justify-center gap-1 p-2 bg-blue-400 rounded-md">
          <Clock5 size={16} color="#0033FF" />
          <Text className="text-sm font-inter-bold text-primary">0/3</Text>
        </View>
      </View>

      <View>
        <Text className="font-inter-black text-9xl text-black tracking-tighter">
          {formattedTime}
        </Text>
      </View>

      <View>
        <Pressable
          onPress={startPomodoro}
          className="flex-row gap-2 items-center justify-center w-full h-16 bg-secondary rounded-xl"
        >
          <Play size={20} color="#FFFFFF" />
          <Text className="font-inter-black text-lg text-white tracking-widest uppercase">
            Iniciar foco
          </Text>
        </Pressable>
      </View>
    </View>
  )
}
