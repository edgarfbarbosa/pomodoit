import { PomodoroDisplay } from '../features/pomodoro/components/PomodoroDisplay'
import { TaskCreationCardController } from '../features/tasks/components/TaskCreationCardController'
import { TaskList } from '../features/tasks/components/TaskList'

export function MainScreen() {
  return (
    <>
      <PomodoroDisplay />
      <TaskList />
      <TaskCreationCardController />
    </>
  )
}
