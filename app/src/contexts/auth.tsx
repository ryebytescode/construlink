import { useRenderCount } from '@/hooks/useRenderCount'
import { User, UserCollection } from '@/services/firebase'
import { type FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'

export type AuthMode = 'signin' | 'signup'

interface AuthContextProps {
  initializing: boolean
  isFetchingUserInfo: boolean
  userInfo: User | null
  reset(): void
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

export function ClAuthProvider({ children }: PropsWithChildren) {
  useRenderCount('AuthProvider')

  const [initializing, setInitializing] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const tqClient = useQueryClient()
  const { data: cachedUserInfo, isFetching: isFetchingUserInfo } =
    useQuery<User>({
      queryKey: ['user'],
      queryFn: async () => {
        const user = User.get()
        const userInfo = await UserCollection.getUserInfo(user!.uid)
        if (!userInfo) {
          throw new Error('User not found')
        }
        return userInfo
      },
      enabled: isAuth,
    })

  function reset() {
    setIsAuth(false)
    tqClient.clear()
  }

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setIsAuth(user !== null)
    if (initializing) setInitializing(false)
  }

  useLayoutEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(onAuthStateChanged)
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider
      value={{
        initializing,
        isFetchingUserInfo,
        userInfo: cachedUserInfo ?? null,
        reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
