import { useState } from 'react'
import { ConfirmCancelModal } from '../../../components/ConfirmCancelModal'
import usePomodoroStore from '../../pomodoro/stores/usePomodoroStore'
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
  isCompleted = false,
}: Task) {
  const [isEditing, setIsEditing] = useState(false)
  const [newTaskName, setNewTaskName] = useState(name)
  const [newEstimatedPomodoros, setNewEstimatedPomodoros] =
    useState(estimatedPomodoros)
  const [newIsCompleted, setNewIsCompleted] = useState(isCompleted)
  const [isChangeTaskModalOpen, setIsChangeTaskModalOpen] = useState(false)

  const deleteTask = useTaskStore((state) => state.deleteTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const setCurrentTask = useTaskStore((state) => state.setCurrentTask)

  const hasCurrentTask = useTaskStore((state) =>
    state.tasks.some((task) => task.current === true),
  )

  const hasTimerRunning = usePomodoroStore((state) => state.hasTimerRunning)

  function handleCardPress() {
    if (hasCurrentTask && hasTimerRunning && !current) {
      setIsChangeTaskModalOpen(true)
      return
    }

    setCurrentTask(id)
  }

  function handleEditingButtonPress() {
    setNewTaskName(name)
    setNewEstimatedPomodoros(estimatedPomodoros)
    setNewIsCompleted(isCompleted)
    setIsEditing(true)
  }

  function handleDeleteButtonPress() {
    deleteTask(id)
  }

  function handleSetPendingButtonPress() {
    setNewIsCompleted(false)
  }

  function handleSetCompletedButtonPress() {
    setNewIsCompleted(true)
  }

  function handleSaveButtonPress() {
    if (!newTaskName.trim()) return

    updateTask(id, {
      name: newTaskName,
      estimatedPomodoros: newEstimatedPomodoros,
      isCompleted: newIsCompleted,
    })

    setIsEditing(false)
  }

  function handleCancelButtonPress() {
    setNewTaskName(name)
    setNewEstimatedPomodoros(estimatedPomodoros)
    setNewIsCompleted(isCompleted)
    setIsEditing(false)
  }

  function handleIncreaseNewEstimatedPomodoros() {
    setNewEstimatedPomodoros((prev) => prev + 1)
  }

  function handleDecreaseNewEstimatedPomodoros() {
    setNewEstimatedPomodoros((prev) => Math.max(1, prev - 1))
  }

  function handleConfirmChangeTask() {
    setCurrentTask(id)
    setIsChangeTaskModalOpen(false)
  }

  function handleCancelChangeTask() {
    setIsChangeTaskModalOpen(false)
  }

  if (isEditing) {
    return (
      <TaskCardExpanded
        newTaskName={newTaskName}
        newEstimatedPomodoros={newEstimatedPomodoros}
        completedPomodoros={completedPomodoros}
        isCompleted={newIsCompleted}
        onNewTaskNameChange={setNewTaskName}
        onIncreaseNewEstimatedPomodoros={handleIncreaseNewEstimatedPomodoros}
        onDecreaseNewEstimatedPomodoros={handleDecreaseNewEstimatedPomodoros}
        onSavePress={handleSaveButtonPress}
        onCancelPress={handleCancelButtonPress}
        onDeletePress={handleDeleteButtonPress}
        onSetPendingPress={handleSetPendingButtonPress}
        onSetCompletedPress={handleSetCompletedButtonPress}
      />
    )
  }

  return (
    <>
      <ConfirmCancelModal
        isVisible={isChangeTaskModalOpen}
        title="Alterar tarefa?"
        description="O foco atual já começou com outra tarefa. Se você alterar agora, o foco será associado à nova tarefa selecionada."
        confirmActionLabel="Alterar tarefa"
        cancelActionLabel="Manter tarefa"
        onConfirmAction={handleConfirmChangeTask}
        onCancelAction={handleCancelChangeTask}
      />

      <TaskCard
        name={name}
        current={current}
        estimatedPomodoros={estimatedPomodoros}
        completedPomodoros={completedPomodoros}
        isCompleted={isCompleted}
        onCardPress={handleCardPress}
        onEditPress={handleEditingButtonPress}
      />
    </>
  )
}
