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
  tasks: [],

  /**
   * Cria uma nova tarefa no fim da lista.
   *
   * @param task Tarefa completa que será adicionada à store.
   */
  createTask: (task: Task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),

  /**
   * Atualiza os dados editáveis de uma tarefa.
   *
   * Se a tarefa for marcada como concluída, ela deixa de ser a tarefa atual.
   *
   * @param id Identificador da tarefa que será atualizada.
   * @param data Dados parciais que serão aplicados à tarefa.
   */
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

  /**
   * Remove uma tarefa pelo identificador.
   *
   * @param id Identificador da tarefa que será removida.
   */
  deleteTask: (id: string) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  /**
   * Marca uma tarefa como concluída.
   *
   * Uma tarefa concluída não permanece como tarefa atual.
   *
   * @param id Identificador da tarefa que será concluída.
   */
  setCompletedTask: (id: string) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, current: false, isCompleted: true } : task,
      ),
    })),

  /**
   * Reabre uma tarefa concluída, mantendo-a como pendente.
   *
   * @param id Identificador da tarefa que será reaberta.
   */
  setPendingTask: (id: string) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: false } : task,
      ),
    })),

  /**
   * Define uma tarefa pendente como tarefa atual.
   *
   * Tarefas inexistentes ou concluídas são ignoradas.
   *
   * @param id Identificador da tarefa que será marcada como atual.
   */
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

  /**
   * Atualiza a quantidade de Pomodoros concluídos de uma tarefa.
   *
   * Usado pelo fluxo do timer ao finalizar uma sessão de foco.
   *
   * @param id Identificador da tarefa que receberá o novo progresso.
   * @param completedPomodoros Quantidade atualizada de Pomodoros concluídos.
   */
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
