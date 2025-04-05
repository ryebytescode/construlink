import { ClCard } from '@/components/ClCard'
import { ClIconText } from '@/components/ClIconText'
import { ClPageView } from '@/components/ClPageView'
import { ClSpinner, type ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import {
  capitalizeFirstLetter,
  formatDateTime,
  formatMoney,
} from '@/helpers/utils'
import { HireRequestStatus } from '@/lib/constants'
import { HireRequestCollection } from '@/services/firebase'
import { Typo } from '@/theme'
import { IconSet } from '@/types/icons'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'

export default function ViewHireRequestScreen() {
  const { hireRequestId } = useLocalSearchParams<{ hireRequestId: string }>()
  const { data: hireRequest } = useQuery({
    queryKey: ['hire-request', hireRequestId],
    queryFn: () => HireRequestCollection.getRequest(hireRequestId),
  })
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  useEffect(() => {
    if (hireRequest) {
      spinnerRef.current?.hide()
    }
  }, [hireRequest])

  return (
    <>
      <ClPageView id="view-hire-request">
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
                Requested at: {formatDateTime(hireRequest.createdAt.toDate())}
              </ClText>
              {hireRequest.updatedAt && (
                <ClText type="helper">
                  {hireRequest.status === HireRequestStatus.PENDING
                    ? 'Updated'
                    : 'Cancelled'}{' '}
                  at: {formatDateTime(hireRequest.updatedAt.toDate())}
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
          </>
        )}
      </ClPageView>
      <ClSpinner ref={spinnerRef} />
    </>
  )
}
