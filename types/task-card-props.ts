import { Task } from './task'

export type TaskCardProps = Pick<
  Task,
  'name' | 'completed' | 'pomodoros'
> & {
  onEditPress: () => void
}

export type TaskCardExpandedProps = {
  newTaskName: string
  newPomodoroAmount: number
  onNewTaskNameChange: (name: string) => void
  onIncreaseNewPomodoroAmount: () => void
  onDecreaseNewPomodoroAmount: () => void
  onSavePress: () => void
  onCancelPress: () => void
  onDeletePress: () => void
}
