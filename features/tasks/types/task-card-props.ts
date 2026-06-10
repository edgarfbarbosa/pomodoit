import { Task } from './task'

export type TaskCardProps = Pick<
  Task,
  'name' | 'current' | 'estimatedPomodoros' | 'completedPomodoros'
> & {
  onCardPress: () => void
  onEditPress: () => void
}

export type TaskCardExpandedProps = {
  newTaskName: string
  newEstimatedPomodoros: number
  completedPomodoros: number
  onNewTaskNameChange: (name: string) => void
  onIncreaseNewEstimatedPomodoros: () => void
  onDecreaseNewEstimatedPomodoros: () => void
  onSavePress: () => void
  onCancelPress: () => void
  onDeletePress: () => void
}
