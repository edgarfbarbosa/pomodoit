import * as Notifications from 'expo-notifications'
import { useCallback, useRef } from 'react'
import { Platform } from 'react-native'

const POMODORO_NOTIFICATION_CHANNEL_ID = 'pomodoro-timer'

type SchedulePomodoroNotificationParams = {
  seconds: number
  title: string
  body: string
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

async function configureAndroidNotificationChannel() {
  if (Platform.OS !== 'android') return

  await Notifications.setNotificationChannelAsync(
    POMODORO_NOTIFICATION_CHANNEL_ID,
    {
      name: 'Pomodoro',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
    },
  )
}

export function usePomodoroNotifications() {
  const scheduledNotificationIdRef = useRef<string | null>(null)

  const requestNotificationsPermission = useCallback(async () => {
    await configureAndroidNotificationChannel()

    const { status: currentStatus } = await Notifications.getPermissionsAsync()

    if (currentStatus === 'granted') {
      return true
    }

    const { status: requestedStatus } =
      await Notifications.requestPermissionsAsync()

    return requestedStatus === 'granted'
  }, [])

  const cancelPomodoroNotification = useCallback(async () => {
    if (!scheduledNotificationIdRef.current) return

    await Notifications.cancelScheduledNotificationAsync(
      scheduledNotificationIdRef.current,
    )

    scheduledNotificationIdRef.current = null
  }, [])

  const schedulePomodoroNotification = useCallback(
    async ({ seconds, title, body }: SchedulePomodoroNotificationParams) => {
      if (seconds <= 0) return

      const hasPermission = await requestNotificationsPermission()

      if (!hasPermission) return

      await cancelPomodoroNotification()

      const scheduledNotificationId =
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: Math.ceil(seconds),
            channelId: POMODORO_NOTIFICATION_CHANNEL_ID,
          },
        })

      scheduledNotificationIdRef.current = scheduledNotificationId
    },
    [cancelPomodoroNotification, requestNotificationsPermission],
  )

  return {
    schedulePomodoroNotification,
    cancelPomodoroNotification,
  }
}
