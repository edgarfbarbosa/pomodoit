import { ScrollView } from 'react-native'
import { PomodoroDisplay } from '../../pomodoro/components/PomodoroDisplay'
import { TaskCreationCardController } from '../components/TaskCreationCardController'
import { TaskList } from '../components/TaskList'

export function TasksScreen() {
  return (
    <ScrollView
      className="flex-1 bg-surface-0"
      contentContainerClassName="px-6 py-8 gap-2"
      keyboardShouldPersistTaps="handled"
    >
      <PomodoroDisplay />
      <TaskList />
      <TaskCreationCardController />
    </ScrollView>
  )
}
