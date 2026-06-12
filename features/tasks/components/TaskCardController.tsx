import { useState } from 'react'
import useTaskStore from '../stores/useTaskStore'
import type { Task } from '../types/task'
import { TaskCard } from './TaskCard'
import { TaskCardExpanded } from './TaskCardExpanded'

export function TaskCardController({
  id,
  name,
  current,
  estimatedPomodoros,
  completedPomodoros,
}: Task) {
  const [isEditing, setIsEditing] = useState(false)
  const [newTaskName, setNewTaskName] = useState(name)
  const [newEstimatedPomodoros, setNewEstimatedPomodoros] =
    useState(estimatedPomodoros)

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
      estimatedPomodoros: newEstimatedPomodoros,
    })

    setIsEditing(false)
  }

  function handleCancelButtonPress() {
    setNewTaskName(name)
    setNewEstimatedPomodoros(estimatedPomodoros)
    setIsEditing(false)
  }

  function handleIncreaseNewEstimatedPomodoros() {
    setNewEstimatedPomodoros((prev) => prev + 1)
  }

  function handleDecreaseNewEstimatedPomodoros() {
    setNewEstimatedPomodoros((prev) => Math.max(1, prev - 1))
  }

  if (isEditing) {
    return (
      <TaskCardExpanded
        newTaskName={newTaskName}
        newEstimatedPomodoros={newEstimatedPomodoros}
        completedPomodoros={completedPomodoros}
        onNewTaskNameChange={setNewTaskName}
        onIncreaseNewEstimatedPomodoros={handleIncreaseNewEstimatedPomodoros}
        onDecreaseNewEstimatedPomodoros={handleDecreaseNewEstimatedPomodoros}
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
      estimatedPomodoros={estimatedPomodoros}
      completedPomodoros={completedPomodoros}
      onCardPress={handleCardPress}
      onEditPress={handleEditingButtonPress}
    />
  )
}
