import { useState } from 'react'
import useTaskStore from '../stores/useTaskStore'
import { Task } from '../types/task'
import { TaskCard } from './TaskCard'
import { TaskCardExpanded } from './TaskCardExpanded'

export function TaskCardController({ id, name, current, pomodoros }: Task) {
  const [isEditing, setIsEditing] = useState(false)
  const [newTaskName, setNewTaskName] = useState(name)
  const [newPomodoroAmount, setNewPomodoroAmount] = useState(pomodoros)

  const deleteTask = useTaskStore((state) => state.deleteTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const setCurrentTask = useTaskStore((state) => state.setCurrentTask)

  function handleCardPress() {
    setCurrentTask(id)
  }

  function handleEditingButtonPress() {
    setIsEditing(true)
  }

  function handleDeleteButtonPress() {
    deleteTask(id)
  }

  function handleSaveButtonPress() {
    if (!newTaskName.trim()) return

    updateTask(id, {
      name: newTaskName,
      pomodoros: newPomodoroAmount,
    })

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
      current={current}
      pomodoros={pomodoros}
      onCardPress={handleCardPress}
      onEditPress={handleEditingButtonPress}
    />
  )
}
