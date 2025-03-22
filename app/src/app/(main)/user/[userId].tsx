import { ClInlineSpinner } from '@/components/ClInlineSpinner'
import { ClPageView } from '@/components/ClPageView'
import type { ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { ProfileCard } from '@/components/cards/ProfileCard'
import { Role } from '@/lib/constants'
import { UserCollection } from '@/services/firebase'
import { useMount } from 'ahooks'
import { useLocalSearchParams } from 'expo-router'
import { useRef, useState } from 'react'

export default function UserProfile() {
  const { userId } = useLocalSearchParams<{ userId: string }>()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)
  const [userDetails, setUserDetails] = useState<User | null>(null)

  useMount(() => {
    async function getUserDetails() {
      const role = await UserCollection.getRole(userId)
      const details = await UserCollection.getUserInfo(
        userId,
        role ?? undefined
      )

      if (role && details) spinnerRef.current?.hide()

      setUserDetails(details)
    }

    getUserDetails()
  })

  return (
    <>
      <ClPageView id={`user-${userId}`}>
        <ProfileCard
          role={userDetails?.role ?? Role.TRADESPERSON}
          name={userDetails?.firstName + ' ' + userDetails?.lastName}
          designation={userDetails?.role ? 'Employer' : 'Tradesperson'}
          // stats={stats!}
        />
      </ClPageView>
      <ClInlineSpinner ref={spinnerRef} visible />
    </>
  )
}
