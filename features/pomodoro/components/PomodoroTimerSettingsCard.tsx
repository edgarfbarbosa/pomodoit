import Slider from '@react-native-community/slider'
import { useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'

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
  const [inputValue, setInputValue] = useState(String(value))

  useEffect(() => {
    setInputValue(String(value))
  }, [value])

  function handleTextChange(nextValue: string) {
    setInputValue(nextValue)

    const numericValue = Number(nextValue)

    if (
      Number.isInteger(numericValue) &&
      numericValue >= min &&
      numericValue <= max
    ) {
      onChange(numericValue)
    }
  }

  function handleTextEndEditing() {
    const numericValue = Number(inputValue)

    if (
      !Number.isInteger(numericValue) ||
      numericValue < min ||
      numericValue > max
    ) {
      setInputValue(String(value))
    }
  }

  function handleSliderChange(nextValue: number) {
    const numericValue = Math.round(nextValue)

    setInputValue(String(numericValue))
    onChange(numericValue)
  }

  return (
    <View className="mb-3 flex-col rounded-xl border border-[#1A1B1F] bg-surface-1 p-5">
      <View className="flex-row items-center justify-between">
        <Text className="font-inter-semi-bold text-lg text-white tracking-[-0.18px]">
          {label}
        </Text>

        <TextInput
          value={inputValue}
          onChangeText={handleTextChange}
          onEndEditing={handleTextEndEditing}
          keyboardType="number-pad"
          className="h-8 w-16 p-0 text-right font-inter-bold text-[32px] text-secondary leading-8"
        />
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
