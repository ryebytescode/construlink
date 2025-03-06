import { ClButton } from '@/components/ClButton'
import { ControlledDateTimePicker } from '@/components/ClDateTimePicker'
import { ClPageView } from '@/components/ClPageView'
import { ClRadioInput } from '@/components/ClRadio'
import { ClSpinner, type ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ControlledSelectInput } from '@/components/controlled/ControlledSelectInput'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { createStyles } from '@/helpers/createStyles'
import { Cl } from '@/lib/options'
import { CreateJobSchema } from '@/lib/schemas'
import { JobCollection, User } from '@/services/firebase'
import { useFormStore } from '@/stores/forms'
import { Spacing } from '@/theme'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMount } from 'ahooks'
import { router, useNavigation } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Alert, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

export default function AboutStep() {
  const { createJobFields, createCompanyFields, resetFormStore } = useFormStore(
    useShallow((state) => ({
      createJobFields: state.createJobFields,
      createCompanyFields: state.createCompanyFields,
      resetFormStore: state.reset,
    }))
  )
  const methods = useForm<CreateJobFields>({
    defaultValues: {
      postAs: 'individual',
      ...createJobFields,
    },
    resolver: zodResolver(CreateJobSchema),
  })
  const { control, setValue, handleSubmit, watch } = methods
  const styles = useStyles()
  const navigation = useNavigation()
  const postAs = watch('postAs')
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const showNoCompanyAlert = () => {
    Alert.alert(
      'Create a Company Profile First',
      'This ensures your job posts are linked to your company for better visibility and credibility.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Create',
          onPress: () => {
            router.push('/user/company/create')
          },
        },
      ]
    )
  }

  async function onSubmit(data: CreateJobFields, isPreview = false) {
    if (data.postAs === 'company' && !createCompanyFields) {
      // Check if the company form is filled up
      showNoCompanyAlert()
      return
    }

    if (isPreview) {
      router.push('/user/job/preview')
      return
    }

    spinnerRef.current?.show()
    const result = await JobCollection.createJob(User.get()?.uid!, data)

    if (result) {
      router.push('/user/job/submitted')
    } else {
      spinnerRef.current?.hide()
      Alert.alert(
        'Submission Failed',
        "We couldn't submit your form due to an error. Please check your internet connection and try again.",
        [
          {
            text: 'Retry',
          },
        ]
      )
    }
  }

  useMount(() => {
    const removeListener = navigation.addListener('beforeRemove', (event) => {
      event.preventDefault()
      // Clear the form store
      resetFormStore()
      navigation.dispatch(event.data.action)
    })

    const unsubscribe = useFormStore.subscribe((state) => {
      setValue('description', state.createJobFields.description ?? '', {
        shouldValidate: true,
      })
    })

    return () => {
      removeListener()
      unsubscribe()
    }
  })

  useEffect(() => {
    if (postAs === 'company' && !createCompanyFields) showNoCompanyAlert()
  }, [postAs])

  return (
    <>
      <ClPageView id="create-job">
        <View style={{ gap: Spacing[6] }}>
          <FormProvider {...methods}>
            <Controller
              name="postAs"
              control={control}
              render={({ field }) => (
                <ClRadioInput
                  id="postAs"
                  label="Post as"
                  options={Cl.postAs}
                  value={field.value ?? ''}
                  contentContainerStyle={{ flexDirection: 'row' }}
                  radioInputStyles={{ flex: 1 }}
                  onChange={field.onChange}
                />
              )}
            />
            <ControlledTextInput
              name="title"
              control={control}
              textInputOptions={{
                label: 'Job Title',
                placeholder: 'Brick mason',
                size: 'small',
              }}
            />
            <ControlledSelectInput
              name="category"
              control={control}
              options={Cl.categories}
              selectInputOptions={{
                label: 'Category',
                placeholder: 'Select',
                size: 'small',
              }}
            />
            <ControlledSelectInput
              name="employmentType"
              control={control}
              options={Cl.employmentTypes}
              selectInputOptions={{
                label: 'Employment Type',
                placeholder: 'Select',
                size: 'small',
              }}
            />
            <ControlledTextInput
              name="description"
              control={control}
              textInputOptions={{
                label: 'Description',
                readOnly: true,
                placeholder: 'Tap to edit',
                size: 'small',
                verticalAlign: 'top',
                multiline: true,
                inputWrapperStyle: {
                  height: Spacing[20],
                },
                onPress: () => router.push('/user/job/description-editor'),
              }}
            />
            <ControlledTextInput
              name="location"
              control={control}
              textInputOptions={{
                label: 'Location',
                placeholder: 'Odiongan, Romblon',
                size: 'small',
              }}
            />
            {/* <PaySection /> */}
            <ControlledDateTimePicker
              name="deadline"
              control={control}
              textInputOptions={{
                label: 'Application Deadline',
                placeholder: 'Pick a date',
                size: 'small',
              }}
            />
            <View style={styles.row}>
              <ClButton
                text="Preview"
                variant="outline"
                onPress={handleSubmit((data) => onSubmit(data, true))}
                bodyStyle={{ flex: 1 }}
              />
              <ClButton
                text="Create"
                onPress={handleSubmit((data) => onSubmit(data))}
                bodyStyle={{ flex: 1 }}
              />
            </View>
          </FormProvider>
        </View>
      </ClPageView>
      <ClSpinner ref={spinnerRef} transluscent />
    </>
  )
}

// function PaySection() {
//   const styles = useStyles()
//   const {
//     control,
//     register,
//     unregister,
//     setValue,
//   } = useFormContext<CreateJobFields>()
//   const [rate, isUsingRange, payAmountMin, payAmountMax] = useWatch({
//     control,
//     name: ['rate', 'isUsingRange', 'payAmountMin', 'payAmountMax'],
//   })

//   useEffect(() => {
//     if (rate) {
//       register('payAmount', { required: true, min: 0 })
//     } else {
//       unregister('payAmount')
//     }
//   }, [rate])

//   return (
//     <>
//       <View style={styles.row}>
//         <View style={{ flex: 1 }}>
//           <ControlledSelectInput
//             name="rate"
//             control={control}
//             options={Cl.ratePeriods}
//             selectInputOptions={{
//               label: 'Pay Rate',
//               placeholder: 'Select',
//               size: 'small',
//             }}
//           />
//         </View>
//         {rate && (
//           <Animated.View entering={SlideInRight} exiting={SlideOutRight}>
//             <View style={{ alignItems: 'center' }}>
//               <ClText
//                 style={{
//                   marginBottom: Spacing[3],
//                   fontSize: Typo.presets.sm.fontSize,
//                   lineHeight: Typo.presets.xs.lineHeight,
//                 }}
//               >
//                 Use range
//               </ClText>
//               <ClSwitchButton
//                 active={false}
//                 onChange={(enabled) => setValue('isUsingRange', enabled)}
//               />
//             </View>
//           </Animated.View>
//         )}
//       </View>
//       {rate && (
//         <Animated.View entering={FadeIn} exiting={FadeOut}>
//           {!isUsingRange ? (
//             <ControlledTextInput
//               name="payAmount"
//               control={control}
//               rules={{}}
//               textInputOptions={{
//                 label: 'Pay Amount',
//                 left: <ClText>PHP</ClText>,
//                 size: 'small',
//                 inputMode: 'numeric',
//               }}
//             />
//           ) : (
//             <View style={styles.row}>
//               <View style={{ flex: 1 }}>
//                 <ControlledTextInput
//                   name="payAmountMin"
//                   control={control}
//                   textInputOptions={{
//                     label: 'Minimum',
//                     left: <ClText>PHP</ClText>,
//                     size: 'small',
//                     inputMode: 'numeric',
//                   }}
//                 />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <ControlledTextInput
//                   name="payAmountMax"
//                   control={control}
//                   textInputOptions={{
//                     label: 'Maximum',
//                     left: <ClText>PHP</ClText>,
//                     size: 'small',
//                     inputMode: 'numeric',
//                   }}
//                 />
//               </View>
//             </View>
//           )}
//         </Animated.View>
//       )}
//     </>
//   )
// }

const useStyles = createStyles(({ colors, spacing, sizes, typo }) => ({
  row: {
    flexDirection: 'row',
    gap: spacing[4],
  },
}))
