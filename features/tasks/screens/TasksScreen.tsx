import { useRouter } from 'expo-router'
import { ScrollView } from 'react-native'
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
      contentContainerClassName="px-6 py-8 gap-2"
      keyboardShouldPersistTaps="handled"
    >
      <FocusedTaskCard onStartFocusPress={handleStartFocusPress} />
      <TaskList />
      <TaskCreationCardController />
    </ScrollView>
  )
}
