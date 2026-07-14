import { Pressable, Text, View } from 'react-native'

type PomodoroTimerPreferencesCardProps = {
  autoStartBreaks: boolean
  autoStartFocus: boolean
  onAutoStartBreaksChange: (value: boolean) => void
  onAutoStartFocusChange: (value: boolean) => void
}

type PreferenceItemProps = {
  label: string
  description: string
  value: boolean
  onChange: (value: boolean) => void
}

function PreferenceItem({
  label,
  description,
  value,
  onChange,
}: PreferenceItemProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 pr-4">
        <Text className="font-inter-semi-bold text-lg text-secondary">
          {label}
        </Text>
        <Text className="mt-1 font-inter text-[13px] text-tertiary leading-[18px]">
          {description}
        </Text>
      </View>

      <Pressable
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityState={{ checked: value }}
        onPress={() => onChange(!value)}
        className={`h-6 w-11 rounded-full p-0.5 ${
          value ? 'bg-primary' : 'bg-outline'
        }`}
      >
        <View
          className={`h-5 w-5 rounded-full bg-secondary ${
            value ? 'ml-auto' : ''
          }`}
        />
      </Pressable>
    </View>
  )
}

export function PomodoroTimerPreferencesCard({
  autoStartBreaks,
  autoStartFocus,
  onAutoStartBreaksChange,
  onAutoStartFocusChange,
}: PomodoroTimerPreferencesCardProps) {
  return (
    <View className="mb-3">
      <Text className="mb-3 font-inter-bold text-tertiary text-xs uppercase leading-[14px] tracking-[0.6px]">
        Preferências
      </Text>

      <View className="rounded-xl border border-outline bg-surface-1 px-4 py-5">
        <View className="border-outline border-b pb-4">
          <PreferenceItem
            label="Iniciar pausas automaticamente"
            description="Inicia a pausa quando o foco termina."
            value={autoStartBreaks}
            onChange={onAutoStartBreaksChange}
          />
        </View>

        <View className="pt-4">
          <PreferenceItem
            label="Iniciar foco automaticamente"
            description="Inicia o foco quando a pausa termina."
            value={autoStartFocus}
            onChange={onAutoStartFocusChange}
          />
        </View>
      </View>
    </View>
  )
}
