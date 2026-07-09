import AsyncStorage from '@react-native-async-storage/async-storage'
import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Task } from '../types/task'

interface TaskStore {
  tasks: Task[]
  createTask: (task: Task) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, data: Partial<Omit<Task, 'id'>>) => void
  setCompletedTask: (id: string) => void
  setPendingTask: (id: string) => void
  setCurrentTask: (id: string) => void
  setCompletedPomodoros: (id: string, completedPomodoros: number) => void
}

const taskStore: StateCreator<TaskStore> = (set) => ({
  tasks: [
    {
      id: '3',
      name: 'Desenvolver meu projeto',
      current: true,
      estimatedPomodoros: 3,
      completedPomodoros: 0,
      isCompleted: false,
    },
  ],

  createTask: (task: Task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id: string, data: Partial<Omit<Task, 'id'>>) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== id) return task

        const updatedTask = { ...task, ...data }

        return {
          ...updatedTask,
          current: updatedTask.isCompleted ? false : updatedTask.current,
        }
      }),
    })),

  deleteTask: (id: string) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  setCompletedTask: (id: string) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, current: false, isCompleted: true } : task,
      ),
    })),

  setPendingTask: (id: string) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: false } : task,
      ),
    })),

  setCurrentTask: (id: string) =>
    set((state) => {
      const nextCurrentTask = state.tasks.find((task) => task.id === id)

      if (!nextCurrentTask || nextCurrentTask.isCompleted) {
        return { tasks: state.tasks }
      }

      return {
        tasks: state.tasks.map((task) => ({
          ...task,
          current: task.id === id,
        })),
      }
    }),

  setCompletedPomodoros: (id: string, completedPomodoros: number) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completedPomodoros } : task,
      ),
    })),
})

const useTaskStore = create<TaskStore>()(
  persist(taskStore, {
    name: 'pomodoit-task-store',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      tasks: state.tasks,
    }),
  }),
)

export default useTaskStore
