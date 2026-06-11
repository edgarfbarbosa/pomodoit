import { Modal as NativeModal, View, Text, Pressable } from 'react-native'

type ModalProps = {
  visible: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export function Modal({
  visible,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ModalProps) {
  return (
    <NativeModal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/60 px-6">
        <View className="w-full flex-col items-center justify-center rounded-lg bg-surface-2 p-8">
          <Text className="mb-6 text-3xl font-inter-black text-secondary">
            {title}
          </Text>

          <Text className="mb-8 font-inter text-tertiary">
            {description}
          </Text>

          <Pressable
            onPress={onConfirm}
            className="mb-3 w-full rounded-lg bg-secondary p-4"
          >
            <Text className="text-center text-sm font-inter-extra-bold uppercase tracking-wider text-white">
              {confirmLabel}
            </Text>
          </Pressable>

          <Pressable
            onPress={onCancel}
            className="w-full rounded-lg bg-transparent p-4"
          >
            <Text className="text-center text-sm font-inter-extra-bold uppercase tracking-wider text-black">
              {cancelLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </NativeModal>
  )
}
