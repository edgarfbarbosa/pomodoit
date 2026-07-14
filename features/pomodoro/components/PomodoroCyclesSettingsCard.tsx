import Slider from '@react-native-community/slider'
import { Text, View } from 'react-native'

type PomodoroCyclesSettingsCardProps = {
  value: number
  onChange: (value: number) => void
}

function getLongBreakCyclesDescription(value: number) {
  if (value === 0) return 'Pausa longa desativada.'

  if (value === 1) {
    return 'Após 1 foco concluído, inicia uma pausa longa.'
  }

  return `Após ${value} focos concluídos, inicia uma pausa longa.`
}

export function PomodoroCyclesSettingsCard({
  value,
  onChange,
}: PomodoroCyclesSettingsCardProps) {
  function handleSliderChange(nextValue: number) {
    onChange(Math.round(nextValue))
  }

  return (
    <View className="mb-3 flex-col rounded-xl border border-outline bg-surface-1 p-5">
      <View className="flex-row items-center justify-between">
        <Text className="font-inter-semi-bold text-lg text-secondary">
          Ciclos até a pausa longa
        </Text>

        <Text className="h-8 w-16 text-right font-inter-bold text-[32px] text-secondary leading-8">
          {value}
        </Text>
      </View>

      <View className="mt-4">
        <Slider
          minimumValue={0}
          maximumValue={4}
          step={1}
          value={value}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="#0066FF"
          maximumTrackTintColor="#38393D"
          thumbTintColor="#FFFFFF"
          style={{ width: '100%', height: 24 }}
        />
        <View className="mt-2 flex-row justify-between">
          <Text className="font-inter-medium text-tertiary text-xs">
            0 ciclos
          </Text>
          <Text className="font-inter-medium text-tertiary text-xs">
            4 ciclos
          </Text>
        </View>
        <Text className="mt-2 font-inter text-[13px] text-tertiary leading-[18px]">
          {getLongBreakCyclesDescription(value)}
        </Text>
      </View>
    </View>
  )
}
