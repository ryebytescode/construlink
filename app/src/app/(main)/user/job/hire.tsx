import { ClButton } from '@/components/ClButton'
import { ControlledDateTimePicker } from '@/components/ClDateTimePicker'
import { ClInlineSpinner } from '@/components/ClInlineSpinner'
import { ClPageView } from '@/components/ClPageView'
import type { ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { capitalizeListItems, formatFullName } from '@/helpers/utils'
import { HireSchema } from '@/lib/schemas'
import {
  HireRequestCollection,
  User,
  UserCollection,
} from '@/services/firebase'
import { useFormStore } from '@/stores/forms'
import { Spacing } from '@/theme'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Alert, View } from 'react-native'

export default function HiringScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>()
  const { data: userDetails } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => UserCollection.getUserInfo<Tradesperson>(userId),
  })
  const { data: myDetails } = useQuery({
    queryKey: ['my-details'],
    queryFn: () => UserCollection.getUserInfo(User.get()?.uid!),
  })
  const jobType = useFormStore((state) => state.selectedJobType)
  const { control, setValue, handleSubmit } = useForm<
    Omit<HireFields, 'tradespersonName'>
  >({
    resolver: zodResolver(HireSchema),
  })
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  useFocusEffect(() => {
    if (jobType) {
      setValue('jobType', jobType)
    }
  })

  useEffect(() => {
    if (userDetails && myDetails) {
      setValue('location', myDetails.location)
      setValue('phone', myDetails.phone)
      setValue('email', myDetails.email)
      setValue('jobType', jobType || userDetails.expertise[0])
    }

    return () => {
      useFormStore.setState({ selectedJobType: '' })
    }
  }, [myDetails, userDetails])

  const onSubmit: SubmitHandler<Omit<HireFields, 'tradespersonName'>> = async (
    data
  ) => {
    spinnerRef.current?.show()

    const result = await HireRequestCollection.create(User.get()?.uid!, {
      ...data,
      tradespersonId: userId,
      employerId: User.get()?.uid!,
      employerName: formatFullName(myDetails!.firstName, myDetails!.lastName),
      tradespersonName: formatFullName(
        userDetails!.firstName,
        userDetails!.lastName
      ),
    })

    if (result) {
      router.push('/user/job/hire-done')
    } else {
      spinnerRef.current?.hide()
      Alert.alert('Error', 'Failed to send request')
    }
  }

  return (
    <>
      <ClPageView
        id={`hiring-screen-${userId}`}
        title={formatFullName(userDetails!.firstName, userDetails!.lastName)}
        subtitle={capitalizeListItems(userDetails!.expertise)}
      >
        <ControlledTextInput
          name="location"
          control={control}
          textInputOptions={{
            label: 'Location',
            placeholder: 'Enter your location',
            size: 'small',
          }}
        />
        <ControlledTextInput
          name="jobType"
          control={control}
          textInputOptions={{
            label: 'Job Type',
            size: 'small',
            placeholder: 'Select Job Type',
            readOnly: true,
            onPress: () => router.push('/user/job/category-finder'),
          }}
        />
        <ControlledTextInput
          name="jobDescription"
          control={control}
          textInputOptions={{
            label: 'Job Description',
            placeholder: 'Describe the job you want to hire for',
            multiline: true,
            inputFieldStyle: {
              height: Spacing[40],
            },
            size: 'small',
          }}
        />
        <ControlledDateTimePicker
          name="expectedStartDate"
          control={control}
          textInputOptions={{
            label: 'Expected Start Date',
            placeholder: 'Select date',
            size: 'small',
            mode: 'date',
          }}
        />
        <ControlledTextInput
          name="budget"
          control={control}
          textInputOptions={{
            label: 'Budget',
            placeholder: 'Enter your budget',
            size: 'small',
            keyboardType: 'numeric',
          }}
        />
        <ControlledTextInput
          name="phone"
          control={control}
          textInputOptions={{
            label: 'My Contact Number',
            placeholder: 'Contact Number',
            size: 'small',
            keyboardType: 'phone-pad',
          }}
        />
        <ControlledTextInput
          name="email"
          control={control}
          textInputOptions={{
            label: 'My Email Address',
            placeholder: 'Email Address',
            size: 'small',
            keyboardType: 'email-address',
          }}
        />
        <View style={{ marginTop: Spacing[4] }}>
          <ClButton
            text="Confirm & Send Request"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ClPageView>
      <ClInlineSpinner ref={spinnerRef} transluscent />
    </>
  )
}
