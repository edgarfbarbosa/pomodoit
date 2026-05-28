import { TaskList } from '../components/TaskList'
import { TaskCreationCardController } from '../components/TaskCreationCardController'

export function MainScreen() {
  return (
    <>
      <TaskList />
      <TaskCreationCardController />
    </>
  )
}
