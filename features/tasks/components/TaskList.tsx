import { View } from 'react-native'
import useTaskStore from '../stores/useTaskStore'
import { TaskCardController } from './TaskCardController'

export function TaskList() {
  const tasks = useTaskStore((state) => state.tasks)

  return (
    <View className="gap-2">
      {tasks.map((task) => (
        <TaskCardController
          key={task.id}
          id={task.id}
          name={task.name}
          current={task.current}
          estimatedPomodoros={task.estimatedPomodoros}
          completedPomodoros={task.completedPomodoros}
          isCompleted={task.isCompleted ?? false}
        />
      ))}
    </View>
  )
}
