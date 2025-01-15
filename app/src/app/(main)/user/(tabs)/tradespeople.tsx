import { ClButton } from '@/components/ClButton'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import { useAuthStore } from '@/stores/auth'
import auth from '@react-native-firebase/auth'
import { useShallow } from 'zustand/react/shallow'

export default function Home() {
  const { setUser, setRole } = useAuthStore(
    useShallow((state) => ({
      setUser: state.setUser,
      setRole: state.setRole,
    }))
  )

  async function handleSignOut() {
    await auth().signOut()
    setUser(null)
    setRole(null)
  }

  return (
    <ClPageView id="tradespeople-tab" title="Tradespeople">
      <ClText>You're signed in</ClText>
      <ClButton text="Sign out" onPress={handleSignOut} />
    </ClPageView>
  )
}
