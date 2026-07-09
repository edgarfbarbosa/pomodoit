import { useRouter } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'
import { FocusedTaskCard } from '../components/FocusedTaskCard'
import { TaskCreationCardController } from '../components/TaskCreationCardController'
import { TaskList } from '../components/TaskList'

export function TasksScreen() {
  const router = useRouter()

  function handleStartFocusPress() {
    router.push('/focus')
  }

  return (
    <ScrollView
      className="flex-1 bg-surface-0"
      contentContainerClassName="px-6 py-8"
      keyboardShouldPersistTaps="handled"
    >
      <FocusedTaskCard onStartFocusPress={handleStartFocusPress} />
      <View className="mt-5">
        <TaskCreationCardController />
      </View>
      <View className="my-5 flex-row items-center gap-3">
        <Text className="font-inter-bold text-tertiary text-xs uppercase tracking-wider">
          Tarefas
        </Text>
        <View className="h-px flex-1 bg-outline" />
      </View>
      <TaskList />
    </ScrollView>
  )
}
