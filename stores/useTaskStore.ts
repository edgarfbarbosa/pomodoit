import { create, StateCreator } from 'zustand'
import { Task } from '../types/task'

interface TaskStore {
  tasks: Task[]
  toggleTaskCompleted: (id: string) => void
  createTask: (task: Task) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, data: Partial<Omit<Task, 'id'>>) => void
}

const taskStore: StateCreator<TaskStore> = (set) => ({
  tasks: [
    {
      id: '3',
      name: 'Desenvolver meu projeto',
      completed: false,
      pomodoros: 3,
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

  toggleTaskCompleted: (id: string) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    })),
})

const useTaskStore = create<TaskStore>(taskStore)

export default useTaskStore
