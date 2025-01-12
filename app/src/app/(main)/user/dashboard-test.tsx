import { ClButton } from '@/components/ClButton'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'
import auth from '@react-native-firebase/auth'

export default function DashboardTestScreen() {
  const user = auth().currentUser

  async function handleSignOut() {
    await auth().signOut()
  }

  return (
    <ClPageView id="dashboard-test" title={`Welcome, ${user?.displayName}!`}>
      <ClText>You're signed in</ClText>
      <ClButton text="Sign out" onPress={handleSignOut} />
    </ClPageView>
  )
}
