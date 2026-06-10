import { create, StateCreator } from 'zustand'
import { Task } from '../types/task'

interface TaskStore {
  tasks: Task[]
  createTask: (task: Task) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, data: Partial<Omit<Task, 'id'>>) => void
  setCurrentTask: (id: string) => void
}

const taskStore: StateCreator<TaskStore> = (set) => ({
  tasks: [
    {
      id: '3',
      name: 'Desenvolver meu projeto',
      current: true,
      estimatedPomodoros: 3,
      completedPomodoros: 0,
    },
  ],

  createTask: (task: Task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id: string, data: Partial<Omit<Task, 'id'>>) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...data } : task,
      ),
    })),

  deleteTask: (id: string) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  setCurrentTask: (id: string) =>
    set((state) => ({
      tasks: state.tasks.map((task) => ({
        ...task,
        current: task.id === id,
      })),
    })),
})

const useTaskStore = create<TaskStore>(taskStore)

export default useTaskStore
