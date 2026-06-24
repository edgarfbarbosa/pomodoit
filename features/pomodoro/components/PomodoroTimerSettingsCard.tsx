import Slider from '@react-native-community/slider'
import { Text, View } from 'react-native'

type PomodoroTimerSettingsCardProps = {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

export function PomodoroTimerSettingsCard({
  label,
  value,
  min,
  max,
  onChange,
}: PomodoroTimerSettingsCardProps) {
  function handleSliderChange(nextValue: number) {
    onChange(Math.round(nextValue))
  }

  return (
    <View className="mb-3 flex-col rounded-xl border border-outline bg-surface-1 p-5">
      <View className="flex-row items-center justify-between">
        <Text className="font-inter-semi-bold text-lg text-white tracking-[-0.18px]">
          {label}
        </Text>

        <Text className="h-8 w-16 p-0 text-right font-inter-bold text-[32px] text-secondary leading-8">
          {value}
        </Text>
      </View>

      <View className="mt-4">
        <Slider
          minimumValue={min}
          maximumValue={max}
          step={1}
          value={value}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="#0066FF"
          maximumTrackTintColor="#2D2E32"
          thumbTintColor="#FFFFFF"
          style={{ width: '100%', height: 24 }}
        />
        <View className="mt-2 flex-row justify-between">
          <Text className="font-inter-medium text-tertiary text-xs">
            {min} min
          </Text>
          <Text className="font-inter-medium text-tertiary text-xs">
            {max} min
          </Text>
        </View>
      </View>
    </View>
  )
}
