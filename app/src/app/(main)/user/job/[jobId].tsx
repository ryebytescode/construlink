import { ClCard } from '@/components/ClCard'
import { ClIconText } from '@/components/ClIconText'
import { ClPageView } from '@/components/ClPageView'
import { ClSpinner } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { ClWebView } from '@/components/ClWebView'
// import { EmployerCard } from '@/components/cards/EmployerCard'
import { FormMessage } from '@/components/controlled/FormMessage'
import { formatMoney } from '@/helpers/utils'
import { formatDateTime } from '@/helpers/utils'
import { Cl } from '@/lib/options'
import { JobCollection } from '@/services/firestore'
import { Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

export default function JobViewer() {
  const { jobId } = useLocalSearchParams()

  const { data: jobDetails, isLoading } = useQuery({
    queryKey: ['job-details', jobId],
    queryFn: () => JobCollection.getJobPost(jobId as string),
  })

  if (!jobDetails) {
    return <ClSpinner />
  }

  return (
    <ClPageView id={`job-${jobId}`}>
      {jobDetails.status === 'pending' && (
        <FormMessage
          message="This post is pending approval and is not yet visible to tradespeople. Approval typically takes 3-5 hours. We'll notify you once it's approved."
          state="info"
        />
      )}
      <ClCard>
        <ClText type="h5">{jobDetails.title}</ClText>
        <View style={{ gap: Spacing[1] }}>
          <ClIconText
            icon={{
              set: IconSet.MaterialCommunityIcons,
              name: 'map-marker',
            }}
            text={jobDetails.location}
          />
          <ClIconText
            icon={{
              set: IconSet.MaterialCommunityIcons,
              name: 'hammer',
            }}
            text={
              Cl.categories.find(
                (option) => option.value === jobDetails.category
              )!.label
            }
          />
          <ClIconText
            icon={{
              set: IconSet.MaterialCommunityIcons,
              name: 'briefcase',
            }}
            text={
              Cl.employmentTypes.find(
                (option) => option.value === jobDetails.employmentType
              )!.label
            }
          />
          {jobDetails.rate && (
            <ClIconText
              icon={{
                set: IconSet.MaterialIcon,
                name: 'attach-money',
              }}
              text={
                !jobDetails.isUsingRange
                  ? `${formatMoney(Number(jobDetails.payAmount))} ${jobDetails.rate}`
                  : `${formatMoney(Number(jobDetails.payAmountMin))} - ${formatMoney(Number(jobDetails.payAmountMax))} ${jobDetails.rate}`
              }
            />
          )}
        </View>
      </ClCard>
      <ClCard>
        <ClText type="h5">Details</ClText>
        <ClWebView html={jobDetails.description as string} />
      </ClCard>
      {/* <EmployerCard jobDetails={jobDetails} /> */}
      {jobDetails.deadline && (
        <ClCard>
          <ClText type="h5">Application Deadline</ClText>
          <ClIconText
            icon={{
              set: IconSet.MaterialCommunityIcons,
              name: 'calendar-alert',
            }}
            text={formatDateTime(jobDetails.deadline.toDate())}
          />
        </ClCard>
      )}
    </ClPageView>
  )
}
