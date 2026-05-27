import { View } from 'react-native'
import { TaskCardController } from './TaskCardController'
import useTaskStore from '../stores/useTaskStore'

export function TaskList() {
  const tasks = useTaskStore((state) => state.tasks)

  return (
    <View>
      {tasks.map((task) => (
        <TaskCardController
          key={task.id}
          id={task.id}
          name={task.name}
          completed={task.completed}
          pomodoros={task.pomodoros}
        />
      ))}
    </View>
  )
}
