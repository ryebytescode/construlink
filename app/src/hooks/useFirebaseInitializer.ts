import { useAuthStore } from '@/stores/auth'
import auth from '@react-native-firebase/auth'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

export function useFirebaseInitializer() {
  const [isInitializing, setIsInitializing] = useState(true)
  const { user: currentUser, setUser } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
    }))
  )

  function onAuthStateChanged(user: typeof currentUser) {
    setUser(user)
    if (isInitializing) setIsInitializing(false)
  }

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged)
    return unsubscribe
  }, [])

  return {
    isInitializing,
    hasUser: currentUser !== null,
  }
}
