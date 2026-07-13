import { useState } from 'react'
import useTaskStore from '../stores/useTaskStore'
import { TaskCreationCard } from './TaskCreationCard'
import { TaskCreationCardExpanded } from './TaskCreationCardExpanded'

export function TaskCreationCardController() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [pomodoroAmount, setPomodoroAmount] = useState(1)

  const createTask = useTaskStore((state) => state.createTask)

  function handleOpenFormPress() {
    setIsFormOpen(true)
  }

  function handleIncreasePomodoroPress() {
    setPomodoroAmount((prev) => prev + 1)
  }

  function handleDecreasePomodoroPress() {
    setPomodoroAmount((prev) => Math.max(1, prev - 1))
  }

  function handleCreateTaskPress() {
    const trimmedTaskName = taskName.trim()

    if (!trimmedTaskName) return

    createTask({
      id: String(Date.now()),
      name: trimmedTaskName,
      current: false,
      estimatedPomodoros: pomodoroAmount,
      completedPomodoros: 0,
      isCompleted: false,
    })

    setTaskName('')
    setPomodoroAmount(1)
    setIsFormOpen(false)
  }

  function handleCancelPress() {
    setTaskName('')
    setPomodoroAmount(1)
    setIsFormOpen(false)
  }

  if (isFormOpen) {
    return (
      <TaskCreationCardExpanded
        taskName={taskName}
        pomodoroAmount={pomodoroAmount}
        onTaskNameChange={setTaskName}
        onIncreasePomodoroPress={handleIncreasePomodoroPress}
        onDecreasePomodoroPress={handleDecreasePomodoroPress}
        onCreateTaskPress={handleCreateTaskPress}
        onCancelPress={handleCancelPress}
      />
    )
  }

  return <TaskCreationCard onOpenFormPress={handleOpenFormPress} />
}
