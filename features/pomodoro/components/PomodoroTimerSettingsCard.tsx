import { Minus, Plus } from 'lucide-react-native'
import { Pressable, Text, TextInput, View } from 'react-native'

type PomodoroTimerSettingsCardProps = {
  label: string
  value: number
  onChange: (value: number) => void
}

export function PomodoroTimerSettingsCard({
  label,
  value,
  onChange,
}: PomodoroTimerSettingsCardProps) {
  return (
    <View className="bg-surface rounded-xl p-5 mb-3 flex-row items-center justify-between">
      <View className="flex-col">
        <Text className="font-inter-black text-black text-lg uppercase">
          {label}
        </Text>
      </View>

      <View className="flex-row h-12 items-center gap-4 rounded-lg p-2 bg-white">
        <Pressable
          onPress={() => onChange(value - 1)}
          className="h-full w-6 items-center justify-center"
        >
          <Minus width={22} color="#0033FF" />
        </Pressable>
        <TextInput
          value={String(value)}
          onChangeText={(value) => onChange(Number(value))}
          keyboardType="number-pad"
          className="h-full w-10 text-center font-inter-bold text-black text-lg"
        />
        <Pressable
          onPress={() => onChange(value + 1)}
          className="h-full w-6 items-center justify-center"
        >
          <Plus width={22} color="#0033FF" />
        </Pressable>
      </View>
    </View>
  )
}
