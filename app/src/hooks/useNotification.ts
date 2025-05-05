import {
  AuthorizationStatus,
  getMessaging,
} from '@react-native-firebase/messaging'
import { useMount } from 'ahooks'
import { useEffect } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'

const messaging = getMessaging()

async function requestUserPermission() {
  try {
    const authStatus = await messaging.requestPermission()
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL

    if (enabled) {
      console.log('Authorization status:', authStatus)
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'This app would like to send you notifications.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted')
      } else {
        console.log('Notification permission denied')
      }
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error)
  }
}

async function getFcmToken() {
  try {
    const token = await messaging.getToken()
    console.log('FCM Token:', token)
    return token
  } catch (error) {
    console.error('Error getting FCM token:', error)
  }
}

export function useNotification() {
  useEffect(() => {
    requestUserPermission()
    getFcmToken()
  }, [])
}
