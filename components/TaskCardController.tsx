import { useState } from 'react'
import useTaskStore from '../stores/useTaskStore'
import { Task } from '../types/task'
import { TaskCard } from './TaskCard'
import { TaskCardExpanded } from './TaskCardExpanded'

export function TaskCardController({ id, name, completed, pomodoros }: Task) {
  const [isEditing, setIsEditing] = useState(false)
  const [newTaskName, setNewTaskName] = useState(name)
  const [newPomodoroAmount, setNewPomodoroAmount] = useState(pomodoros)

  const deleteTask = useTaskStore((state) => state.deleteTask)
  const updateTaskName = useTaskStore((state) => state.updateTaskName)
  const updateTaskPomodoros = useTaskStore(
    (state) => state.updateTaskPomodoros,
  )

  function handleEditingButtonPress() {
    setIsEditing(true)
  }

  function handleDeleteButtonPress() {
    deleteTask(id)
  }

  function handleSaveButtonPress() {
    if (!newTaskName.trim()) return

    updateTaskName(id, newTaskName)
    updateTaskPomodoros(id, newPomodoroAmount)

    setIsEditing(false)
  }

  function handleCancelButtonPress() {
    setNewTaskName(name)
    setNewPomodoroAmount(pomodoros)
    setIsEditing(false)
  }

  function handleIncreaseNewPomodoroAmount() {
    setNewPomodoroAmount((prev) => prev + 1)
  }

  function handleDecreaseNewPomodoroAmount() {
    setNewPomodoroAmount((prev) => Math.max(1, prev - 1))
  }

  if (isEditing) {
    return (
      <TaskCardExpanded
        newTaskName={newTaskName}
        newPomodoroAmount={newPomodoroAmount}
        onNewTaskNameChange={setNewTaskName}
        onIncreaseNewPomodoroAmount={handleIncreaseNewPomodoroAmount}
        onDecreaseNewPomodoroAmount={handleDecreaseNewPomodoroAmount}
        onSavePress={handleSaveButtonPress}
        onCancelPress={handleCancelButtonPress}
        onDeletePress={handleDeleteButtonPress}
      />
    )
  }

  return (
    <TaskCard
      name={name}
      completed={completed}
      pomodoros={pomodoros}
      onEditPress={handleEditingButtonPress}
    />
  )
}
