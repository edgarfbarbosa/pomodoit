import { TaskList } from '../features/tasks/components/TaskList'
import { TaskCreationCardController } from '../features/tasks/components/TaskCreationCardController'
import { PomodoroDisplay } from '../features/pomodoro/components/PomodoroDisplay'

export function MainScreen() {
  return (
    <>
      <PomodoroDisplay />
      <TaskList />
      <TaskCreationCardController />
    </>
  )
}
