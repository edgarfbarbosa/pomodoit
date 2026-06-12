import type { ReactNode } from 'react'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

type ButtonProps = {
  children: ReactNode
  onPress: () => void
  className?: string
}

export function Button({ children, onPress, className = '' }: ButtonProps) {
  const [isButtonPressed, setIsButtonPressed] = useState(false)

  return (
    <View className="border border-black">
      <Pressable
        onPress={onPress}
        onPressIn={() => setIsButtonPressed(true)}
        onPressOut={() => setIsButtonPressed(false)}
        className={`relative bg-secondary ${
          isButtonPressed ? 'left-0 top-0' : '-left-1 -top-1'
        } ${className}`}
      >
        {children}
      </Pressable>
    </View>
  )
}
