import { Tabs } from 'expo-router'
import { List, Settings, Timer } from 'lucide-react-native'
import type { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PRIMARY_COLOR = '#0066FF'
const INACTIVE_COLOR = '#94A3B8'
const SURFACE_COLOR = '#09090B'
const OUTLINE_COLOR = '#38393D'

type TabBarIconProps = {
  children: ReactNode
}

function TabBarIcon({ children }: TabBarIconProps) {
  return <View style={styles.iconContainer}>{children}</View>
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 72 + insets.bottom,
          paddingTop: 12,
          paddingBottom: 12 + insets.bottom,
          paddingHorizontal: 16,
          backgroundColor: SURFACE_COLOR,
          borderTopColor: OUTLINE_COLOR,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: styles.tabBarItem,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tarefas',
          tabBarAccessibilityLabel: 'Lista de tarefas',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon>
              <List size={24} color={color} strokeWidth={focused ? 2.8 : 2.4} />
            </TabBarIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="focus"
        options={{
          title: 'Foco',
          tabBarAccessibilityLabel: 'Tela de foco',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon>
              <Timer
                size={24}
                color={color}
                strokeWidth={focused ? 2.8 : 2.4}
              />
            </TabBarIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarAccessibilityLabel: 'Ajustes do temporizador',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon>
              <Settings
                size={24}
                color={color}
                strokeWidth={focused ? 2.8 : 2.4}
              />
            </TabBarIcon>
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBarItem: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
  },
  tabBarIcon: {
    height: 48,
    marginTop: 0,
    width: 48,
  },
  iconContainer: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    position: 'relative',
    width: 48,
  },
})
