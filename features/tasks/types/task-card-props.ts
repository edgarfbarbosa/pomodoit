import type { Task } from './task'

export type TaskCardProps = Pick<
  Task,
  | 'name'
  | 'current'
  | 'estimatedPomodoros'
  | 'completedPomodoros'
  | 'isCompleted'
> & {
  onCardPress: () => void
  onEditPress: () => void
}

export type TaskCardExpandedProps = {
  newTaskName: string
  newEstimatedPomodoros: number
  completedPomodoros: number
  isCompleted: boolean
  onNewTaskNameChange: (name: string) => void
  onIncreaseNewEstimatedPomodoros: () => void
  onDecreaseNewEstimatedPomodoros: () => void
  onSavePress: () => void
  onCancelPress: () => void
  onDeletePress: () => void
  onSetPendingPress: () => void
  onSetCompletedPress: () => void
}
