import { ClButton } from '@/components/ClButton'
import { ClCard } from '@/components/ClCard'
import { ClIconText } from '@/components/ClIconText'
import { ClInlineSpinner } from '@/components/ClInlineSpinner'
import { ClLinkText } from '@/components/ClLinkText'
import { ClPageView } from '@/components/ClPageView'
import type { ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { useAuth } from '@/contexts/auth'
import {
  capitalizeFirstLetter,
  formatDateTime,
  formatMoney,
} from '@/helpers/utils'
import { HireRequestStatus, Role } from '@/lib/constants'
import { HireRequestCollection } from '@/services/firebase'
import { useFormStore } from '@/stores/forms'
import { Spacing, Typo } from '@/theme'
import { IconSet } from '@/types/icons'
import { ToastPosition, toast } from '@backpackapp-io/react-native-toast'
import { Timestamp } from '@react-native-firebase/firestore'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { Alert, View } from 'react-native'

export default function ViewHireRequestScreen() {
  const { hireRequestId } = useLocalSearchParams<{ hireRequestId: string }>()
  const { data: hireRequest } = useQuery({
    queryKey: ['hire-request', hireRequestId],
    queryFn: () => HireRequestCollection.getRequest(hireRequestId),
  })
  const queryClient = useQueryClient()
  const { userInfo } = useAuth()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)
  const setHireRequestFields = useFormStore(
    (state) => state.setHireRequestFields
  )

  async function resetCache() {
    await queryClient.invalidateQueries({
      queryKey: ['hire-request', hireRequestId],
    })
    await queryClient.invalidateQueries({ queryKey: ['hire-requests'] })
  }

  const handleEditHireRequest = useCallback(() => {
    if (hireRequest) {
      setHireRequestFields(hireRequest)
      router.push({
        pathname: '/user/job/hire',
        params: {
          isEdit: 1,
        },
      })
    }
  }, [hireRequest])

  const handleAcceptHireRequest = useCallback(async () => {
    if (hireRequest) {
      spinnerRef.current?.show()
      const isAccepted = await HireRequestCollection.accept(hireRequestId)
      spinnerRef.current?.hide()

      if (isAccepted) {
        await resetCache()

        toast.success(
          "Hire request accepted. Please wait for the employer's response.",
          { duration: 6000, position: ToastPosition.BOTTOM }
        )
        router.replace('/user/requests')
      } else {
        toast.error('Failed to accept hire request. Please try again.', {
          position: ToastPosition.BOTTOM,
        })
      }
    }
  }, [hireRequest])

  const handleDeclineHireRequest = useCallback(() => {
    if (hireRequest) {
      Alert.alert(
        'Decline hire request',
        'Are you sure you want to decline this hire request?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              spinnerRef.current?.show()
              HireRequestCollection.reject(hireRequestId)
                .then(async () => {
                  await resetCache()
                  router.replace('/user/requests')
                })
                .finally(() => {
                  spinnerRef.current?.hide()
                })
            },
          },
        ]
      )
    }
  }, [hireRequest])

  useEffect(() => {
    if (hireRequest) {
      spinnerRef.current?.hide()
    }
  }, [hireRequest])

  return (
    <>
      {hireRequest && (
        <ClPageView
          id="view-hire-request"
          contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
        >
          {userInfo?.role === Role.EMPLOYER ? (
            <EmployerHireRequestView
              hireRequest={hireRequest}
              handleEditHireRequest={handleEditHireRequest}
              handleDeclineHireRequest={handleDeclineHireRequest}
            />
          ) : (
            <TradespersonHireRequestView
              hireRequest={hireRequest}
              handleAcceptHireRequest={handleAcceptHireRequest}
              handleDeclineHireRequest={handleDeclineHireRequest}
            />
          )}
        </ClPageView>
      )}
      <ClInlineSpinner ref={spinnerRef} transluscent />
    </>
  )
}

function EmployerHireRequestView(props: {
  hireRequest: HireRequest
  handleEditHireRequest: () => void
  handleDeclineHireRequest: () => void
}) {
  const { hireRequest, handleDeclineHireRequest, handleEditHireRequest } = props

  return (
    <>
      <View style={{ gap: Spacing[4] }}>
        {hireRequest && (
          <>
            <ClCard
              header={
                <ClText style={{ ...Typo.fontMap.semiBold }}>
                  {hireRequest.tradespersonName}
                </ClText>
              }
            >
              <ClIconText
                icon={{ set: IconSet.MaterialCommunityIcons, name: 'wrench' }}
                text={capitalizeFirstLetter(hireRequest.jobType)}
              />
              <ClIconText
                icon={{
                  set: IconSet.MaterialCommunityIcons,
                  name: 'message-text',
                }}
                text={hireRequest.jobDescription}
              />
              <ClIconText
                icon={{
                  set: IconSet.MaterialCommunityIcons,
                  name: 'map-marker',
                }}
                text={hireRequest.location}
              />
              {hireRequest.expectedStartDate && (
                <ClIconText
                  icon={{
                    set: IconSet.MaterialCommunityIcons,
                    name: 'calendar',
                  }}
                  text={formatDateTime(hireRequest.expectedStartDate)}
                />
              )}
              {hireRequest.budget && (
                <ClIconText
                  icon={{
                    set: IconSet.MaterialCommunityIcons,
                    name: 'currency-php',
                  }}
                  text={formatMoney(hireRequest.budget)}
                />
              )}
              <ClIconText
                icon={{ set: IconSet.MaterialCommunityIcons, name: 'phone' }}
                text={hireRequest.phone}
              />
              {hireRequest.email && (
                <ClIconText
                  icon={{ set: IconSet.MaterialCommunityIcons, name: 'email' }}
                  text={hireRequest.email}
                />
              )}
            </ClCard>
            <ClCard
              header={
                <ClText style={{ ...Typo.fontMap.semiBold }}>Metadata</ClText>
              }
            >
              <ClText type="helper">
                Status: {capitalizeFirstLetter(hireRequest.status)}
              </ClText>
              <ClText type="helper">
                Requested at:{' '}
                {formatDateTime(
                  new Timestamp(
                    hireRequest.createdAt.seconds,
                    hireRequest.createdAt.nanoseconds
                  ).toDate()
                )}
              </ClText>
              {hireRequest.updatedAt && (
                <ClText type="helper">
                  {hireRequest.status === HireRequestStatus.PENDING
                    ? 'Updated'
                    : 'Cancelled'}{' '}
                  at:{' '}
                  {formatDateTime(
                    new Timestamp(
                      hireRequest.updatedAt.seconds,
                      hireRequest.updatedAt.nanoseconds
                    ).toDate()
                  )}
                </ClText>
              )}
              {hireRequest.respondedAt &&
                hireRequest.status === HireRequestStatus.ACCEPTED && (
                  <ClText type="helper">
                    Accepted at:{' '}
                    {formatDateTime(
                      new Timestamp(
                        hireRequest.respondedAt.seconds,
                        hireRequest.respondedAt.nanoseconds
                      ).toDate()
                    )}
                  </ClText>
                )}
              {hireRequest.respondedAt &&
                hireRequest.status === HireRequestStatus.REJECTED && (
                  <ClText type="helper">
                    Rejected at:{' '}
                    {formatDateTime(hireRequest.respondedAt.toDate())}
                  </ClText>
                )}
            </ClCard>
          </>
        )}
      </View>
      <View style={{ flexDirection: 'row', gap: Spacing[4] }}>
        {hireRequest.status === HireRequestStatus.PENDING && (
          <>
            <ClButton
              text="Edit"
              bodyStyle={{ flex: 1 }}
              onPress={handleEditHireRequest}
            />
            <ClButton
              text="Cancel"
              bodyStyle={{ flex: 1 }}
              variant="outline"
              onPress={handleDeclineHireRequest}
            />
          </>
        )}
        {hireRequest.status === HireRequestStatus.ACCEPTED && (
          <ClButton text="Message tradesperson" bodyStyle={{ flex: 1 }} />
        )}
      </View>
    </>
  )
}

function TradespersonHireRequestView(props: {
  hireRequest: HireRequest
  handleAcceptHireRequest: () => void
  handleDeclineHireRequest: () => void
}) {
  const { hireRequest, handleAcceptHireRequest, handleDeclineHireRequest } =
    props
  const { userInfo } = useAuth()

  return (
    <>
      <View style={{ gap: Spacing[4] }}>
        {hireRequest && (
          <>
            <ClCard
              header={
                <ClText style={{ ...Typo.fontMap.semiBold }}>
                  {userInfo?.role === Role.EMPLOYER
                    ? hireRequest.tradespersonName
                    : 'Details'}
                </ClText>
              }
            >
              <ClIconText
                icon={{ set: IconSet.MaterialCommunityIcons, name: 'wrench' }}
                text={capitalizeFirstLetter(hireRequest.jobType)}
              />
              <ClIconText
                icon={{
                  set: IconSet.MaterialCommunityIcons,
                  name: 'message-text',
                }}
                text={hireRequest.jobDescription}
              />
              <ClIconText
                icon={{
                  set: IconSet.MaterialCommunityIcons,
                  name: 'map-marker',
                }}
                text={hireRequest.location}
              />
              {hireRequest.expectedStartDate && (
                <ClIconText
                  icon={{
                    set: IconSet.MaterialCommunityIcons,
                    name: 'calendar',
                  }}
                  text={formatDateTime(hireRequest.expectedStartDate)}
                />
              )}
              {hireRequest.budget && (
                <ClIconText
                  icon={{
                    set: IconSet.MaterialCommunityIcons,
                    name: 'currency-php',
                  }}
                  text={formatMoney(hireRequest.budget)}
                />
              )}
              <ClIconText
                icon={{ set: IconSet.MaterialCommunityIcons, name: 'phone' }}
                text={hireRequest.phone}
              />
              {hireRequest.email && (
                <ClIconText
                  icon={{ set: IconSet.MaterialCommunityIcons, name: 'email' }}
                  text={hireRequest.email}
                />
              )}
            </ClCard>
            {userInfo?.role === Role.EMPLOYER ? (
              <ClCard
                header={
                  <ClText style={{ ...Typo.fontMap.semiBold }}>Metadata</ClText>
                }
              >
                <ClText type="helper">
                  Status: {capitalizeFirstLetter(hireRequest.status)}
                </ClText>
                <ClText type="helper">
                  Requested at:{' '}
                  {formatDateTime(
                    new Timestamp(
                      hireRequest.createdAt.seconds,
                      hireRequest.createdAt.nanoseconds
                    ).toDate()
                  )}
                </ClText>
                {hireRequest.updatedAt && (
                  <ClText type="helper">
                    {hireRequest.status === HireRequestStatus.PENDING
                      ? 'Updated'
                      : 'Cancelled'}{' '}
                    at:{' '}
                    {formatDateTime(
                      new Timestamp(
                        hireRequest.updatedAt.seconds,
                        hireRequest.updatedAt.nanoseconds
                      ).toDate()
                    )}
                  </ClText>
                )}
                {hireRequest.respondedAt &&
                  hireRequest.status === HireRequestStatus.ACCEPTED && (
                    <ClText type="helper">
                      Accepted at:{' '}
                      {formatDateTime(hireRequest.respondedAt.toDate())}
                    </ClText>
                  )}
                {hireRequest.respondedAt &&
                  hireRequest.status === HireRequestStatus.REJECTED && (
                    <ClText type="helper">
                      Rejected at:{' '}
                      {formatDateTime(hireRequest.respondedAt.toDate())}
                    </ClText>
                  )}
              </ClCard>
            ) : (
              <ClCard
                header={
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <ClText style={{ ...Typo.fontMap.semiBold }}>
                      Employer
                    </ClText>
                    <ClLinkText
                      href={`/user/${hireRequest.employerId}`}
                      textProps={{ type: 'helper' }}
                    >
                      View Profile
                    </ClLinkText>
                  </View>
                }
              >
                <ClIconText
                  icon={{
                    set: IconSet.MaterialCommunityIcons,
                    name: 'account',
                  }}
                  text={hireRequest.employerName}
                />
                <ClIconText
                  icon={{
                    set: IconSet.MaterialCommunityIcons,
                    name: 'phone',
                  }}
                  text={hireRequest.phone}
                />
                {hireRequest.email && (
                  <ClIconText
                    icon={{
                      set: IconSet.MaterialCommunityIcons,
                      name: 'email',
                    }}
                    text={hireRequest.email}
                  />
                )}
              </ClCard>
            )}
          </>
        )}
      </View>
      <View style={{ flexDirection: 'row', gap: Spacing[4] }}>
        {hireRequest?.status === HireRequestStatus.ACCEPTED ? (
          <ClButton text="Message employer" bodyStyle={{ flex: 1 }} />
        ) : (
          <>
            <ClButton
              text="Accept"
              bodyStyle={{ flex: 1 }}
              onPress={handleAcceptHireRequest}
            />
            <ClButton
              text="Decline"
              bodyStyle={{ flex: 1 }}
              variant="outline"
              onPress={handleDeclineHireRequest}
            />
          </>
        )}
      </View>
    </>
  )
}
