import { TaskList } from '../components/TaskList'
import { TaskCreationCardController } from '../components/TaskCreationCardController'
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
