import { ClButton } from '@/components/ClButton'
import { ClPageView } from '@/components/ClPageView'
import { ClSpinner, type ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { JobCollection } from '@/services/firebase'
import { Spacing } from '@/theme'
import auth from '@react-native-firebase/auth'
import { router, useLocalSearchParams } from 'expo-router'
import { useRef } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Alert } from 'react-native'

export default function ApplyJob() {
  const { jobId } = useLocalSearchParams()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)
  const user = auth().currentUser
  const { control, handleSubmit } = useForm<{ message: string }>({
    defaultValues: { message: '' },
  })

  const onSubmit: SubmitHandler<{ message: string }> = async (data) => {
    spinnerRef.current?.show()

    const isSuccess = await JobCollection.applyJob(
      user!.uid,
      jobId as string,
      data.message
    )

    if (!isSuccess) {
      Alert.alert('Application failed', 'Unable to submit the application.', [
        {
          isPreferred: true,
          text: 'Retry',
        },
      ])

      spinnerRef.current?.hide()
    } else {
      router.push('/user/job/apply-done')
    }
  }

  return (
    <ClPageView id="apply-job">
      <ControlledTextInput
        name="message"
        control={control}
        textInputOptions={{
          label: 'Write a message (optional)',
          placeholder: 'Type something...',
          multiline: true,
          inputFieldStyle: {
            height: Spacing[40],
          },
        }}
      />
      <ClButton
        text="Submit Application"
        bodyStyle={{ marginVertical: Spacing[4] }}
        onPress={handleSubmit(onSubmit)}
      />
      <ClSpinner ref={spinnerRef} transluscent />
    </ClPageView>
  )
}
