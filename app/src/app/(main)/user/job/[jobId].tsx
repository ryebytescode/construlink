import { ClButton } from '@/components/ClButton'
import { ClCard } from '@/components/ClCard'
import { ClIconText } from '@/components/ClIconText'
import { ClPageView } from '@/components/ClPageView'
import { ClSpinner, type ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { ClWebView } from '@/components/ClWebView'
// import { EmployerCard } from '@/components/cards/EmployerCard'
import { FormMessage } from '@/components/controlled/FormMessage'
import { formatDateTime, formatMoney } from '@/helpers/utils'
import { Cl } from '@/lib/options'
import { JobCollection } from '@/services/firebase'
import { isEmployer, useAuthStore } from '@/stores/auth'
import { Spacing } from '@/theme'
import { IconSet } from '@/types/icons'
import auth from '@react-native-firebase/auth'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import WebView from 'react-native-webview'

export default function JobViewer() {
  const { jobId } = useLocalSearchParams()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)
  const [jobDetails, setJobDetails] = useState<Job | null>(null)
  const [isApplied, setIsApplied] = useState(false)
  const user = auth().currentUser

  useEffect(() => {
    async function getJobDetails() {
      const details = await JobCollection.getJobPost(jobId as string)
      const applied = await JobCollection.checkIfAppliedToJob(
        user!.uid,
        jobId as string
      )

      setJobDetails(details)
      setIsApplied(applied)
    }

    spinnerRef.current?.show()
    getJobDetails()
    spinnerRef.current?.hide()
  }, [])

  return (
    <>
      <ClPageView id={`job-${jobId}`}>
        {jobDetails && (
          <>
            {jobDetails.status === 'pending' && (
              <FormMessage
                message="This post is pending approval and is not yet visible to tradespeople. Approval typically takes 3-5 hours. We'll notify you once it's approved."
                state="info"
              />
            )}
            {isApplied && (
              <FormMessage
                message="You've already applied to this job. Please wait for the employer's response."
                state="info"
              />
            )}
            <ClCard>
              <ClText type="h6" weight="bold">
                {jobDetails.title}
              </ClText>
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
                {/* {jobDetails.rate && (
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
                )} */}
              </View>
            </ClCard>
            <ClCard>
              <ClText type="h6" weight="bold">
                Details
              </ClText>
              <ClWebView html={jobDetails.description as string} />
            </ClCard>
            {/* <EmployerCard jobDetails={jobDetails} /> */}
            {jobDetails.deadline && (
              <ClCard>
                <ClText type="h6" weight="bold">
                  Application Deadline
                </ClText>
                <ClIconText
                  icon={{
                    set: IconSet.MaterialCommunityIcons,
                    name: 'calendar-alert',
                  }}
                  text={formatDateTime(jobDetails.deadline.toDate())}
                />
              </ClCard>
            )}
            {isEmployer() ? (
              <ClButton
                text="Edit Post"
                bodyStyle={{ marginTop: Spacing[4] }}
                onPress={() => router.push(`/user/job/apply?jobId=${jobId}`)}
                disabled={isApplied}
              />
            ) : (
              <ClButton
                text="Apply Now"
                bodyStyle={{ marginTop: Spacing[4] }}
                onPress={() => router.push(`/user/job/apply?jobId=${jobId}`)}
                disabled={isApplied}
              />
            )}
          </>
        )}
      </ClPageView>
      <ClSpinner ref={spinnerRef} transluscent />
    </>
  )
}
