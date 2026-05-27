import { useState } from 'react'
import { Pressable, View, Text, TextInput } from 'react-native'
import { Plus, ArrowUp, ArrowDown } from 'lucide-react-native'
import useTaskStore from '../stores/useTaskStore'

export function TaskQuickAdd() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [pomodoroAmount, setPomodoroAmount] = useState(1)
  const createTask = useTaskStore((state) => state.createTask)

  function handlePressToOpenForm() {
    setIsFormOpen(true)
  }

  function handleIncreasePomodoroAmount() {
    setPomodoroAmount((prev) => prev + 1)
  }

  function handleDecreasePomodoroAmount() {
    setPomodoroAmount((prev) => Math.max(1, prev - 1))
  }

  function handleAddTask() {
    if (!taskName.trim()) return

    createTask({
      id: String(Date.now()),
      name: taskName,
      completed: false,
      pomodoros: pomodoroAmount,
    })
  }

  function handleCancelAddTask() {
    setTaskName('')
    setPomodoroAmount(1)
    setIsFormOpen(false)
  }

  return (
    <View className="px-4 mb-4">
      {!isFormOpen ? (
        <Pressable
          onPress={handlePressToOpenForm}
          className="items-center justify-center h-36 w-full rounded-xl bg-white border-dashed border-2 border-tertiary p-6"
        >
          <View className="items-center">
            <Plus size={32} color="#777777" />
            <Text className="text-base font-inter-bold text-tertiary uppercase -tracking-wide">
              Adicionar tarefa
            </Text>
          </View>
        </Pressable>
      ) : (
        <View className="w-full bg-white border-solid border-2 border-black p-6">
          <View>
            <Text className="text-xs font-inter-extra-bold text-primary uppercase -tracking-tight mb-2">
              Nova tarefa
            </Text>
            <TextInput
              placeholder="NOME DA TAREFA"
              className="task__input"
              value={taskName}
              onChangeText={setTaskName}
            />
          </View>
          <View>
            <Text className="text-xs font-inter-bold text-primary uppercase my-3">
              Pomodoros estimados
            </Text>
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-5xl font-inter-black text-black">
                {pomodoroAmount}
              </Text>
              <Pressable
                onPress={handleIncreasePomodoroAmount}
                className="button__icon border border-tertiary"
              >
                <ArrowUp />
              </Pressable>
              <Pressable
                onPress={handleDecreasePomodoroAmount}
                className="button__icon border border-tertiary"
              >
                <ArrowDown />
              </Pressable>
            </View>
          </View>
          <View className="flex-row">
            <Pressable
              onPress={handleAddTask}
              className="button__text bg-black px-8 py-4"
            >
              <Text className="text-white font-inter-bold uppercase">
                Adicionar
              </Text>
            </Pressable>
            <Pressable
              onPress={handleCancelAddTask}
              className="button__text bg-transparent px-8 py-4"
            >
              <Text className="text-black font-inter-bold uppercase underline">
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  )
}
