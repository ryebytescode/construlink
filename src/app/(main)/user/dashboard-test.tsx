import { ClButton } from '@/components/ClButton'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import auth from '@react-native-firebase/auth'

export default function DashboardTestScreen() {
  async function handleSignOut() {
    await auth().signOut()
  }

  return (
    <ClPageView id="dashboard-test" title="Welcome!">
      <ClText>You're signed in</ClText>
      <ClButton text="Sign out" onPress={handleSignOut} />
    </ClPageView>
  )
}
