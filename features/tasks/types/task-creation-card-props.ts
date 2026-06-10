export type TaskCreationCardProps = {
  onOpenFormPress: () => void
}

export type TaskCreationCardExpandedProps = {
  taskName: string
  pomodoroAmount: number
  onTaskNameChange: (name: string) => void
  onIncreasePomodoroPress: () => void
  onDecreasePomodoroPress: () => void
  onCreateTaskPress: () => void
  onCancelPress: () => void
}
