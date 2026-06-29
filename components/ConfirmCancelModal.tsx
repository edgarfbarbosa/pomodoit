import { BlurView } from 'expo-blur'
import { TriangleAlert } from 'lucide-react-native'
import { Modal, Pressable, Text, View } from 'react-native'

type ConfirmCancelModalProps = {
  isVisible: boolean
  title: string
  description: string
  confirmActionLabel: string
  cancelActionLabel: string
  onConfirmAction: () => void
  onCancelAction: () => void
}

export function ConfirmCancelModal({
  isVisible,
  title,
  description,
  confirmActionLabel,
  cancelActionLabel,
  onConfirmAction,
  onCancelAction,
}: ConfirmCancelModalProps) {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onCancelAction}
    >
      <BlurView intensity={16} tint="dark" className="flex-1">
        <View className="flex-1 items-center justify-center bg-surface-0/70 px-4">
          <View className="w-full flex-col rounded-2xl border border-outline bg-surface-1 p-6">
            <View className="mb-3 flex-row items-center gap-3">
              <TriangleAlert color="#FFB0B0" size={24} />

              <Text className="font-inter-semi-bold text-secondary text-xl -tracking-wide">
                {title}
              </Text>
            </View>

            <Text className="mb-8 font-inter text-base text-tertiary">
              {description}
            </Text>

            <Pressable
              onPress={onConfirmAction}
              className="mb-3 h-[52px] w-full items-center justify-center rounded-lg bg-primary"
            >
              <Text className="text-center font-inter-bold text-secondary text-sm uppercase">
                {confirmActionLabel}
              </Text>
            </Pressable>

            <Pressable
              onPress={onCancelAction}
              className="h-[52px] w-full items-center justify-center rounded-lg border border-outline bg-transparent"
            >
              <Text className="text-center font-inter-bold text-sm text-tertiary uppercase">
                {cancelActionLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </BlurView>
    </Modal>
  )
}
