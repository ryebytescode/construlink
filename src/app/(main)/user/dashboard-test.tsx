import { ClButton } from '@/components/ClButton'
import { ClPageView } from '@/components/ClPageView'
import { ClText } from '@/components/ClText'

export default function DashboardTestScreen() {
  return (
    <ClPageView id="dashboard-test" title="Welcome!">
      <ClText>You're signed in</ClText>
      <ClButton text="Sign out" />
    </ClPageView>
  )
}
