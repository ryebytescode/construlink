import { ClButton } from '@/components/ClButton'
import { ControlledDateTimePicker } from '@/components/ClDateTimePicker'
import { ClPageView } from '@/components/ClPageView'
import { ClRadioInput } from '@/components/ClRadio'
import { ClSpinner, type ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClWebViewControl } from '@/components/ClWebViewControl'
import { ControlledSelectInput } from '@/components/controlled/ControlledSelectInput'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { createStyles } from '@/helpers/createStyles'
import { Cl } from '@/lib/options'
import { JobCollection } from '@/services/firebase'
import { useAuthStore } from '@/stores/auth'
import { Spacing, Typo } from '@/theme'
import { useNavigation } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { Alert, View } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
} from 'react-native-reanimated'

export default function AboutStep() {
  const userId = useAuthStore((state) => state.user)?.uid
  const role = useAuthStore((state) => state.role)
  const methods = useForm<CreateJobFields>({
    defaultValues: {
      postAs: 'individual',
    },
  })
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods
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
            // router.push('/company/create')
          },
        },
      ]
    )
  }

  const onSubmit = async (data: CreateJobFields, isPreview = false) => {
    spinnerRef.current?.show()

    // if (data.postAs === 'company' && !createCompanyFields) {
    //   // Check if the company form is filled up
    //   showNoCompanyAlert()
    //   return
    // }

    if (isPreview) {
      // router.push('/job/preview')
    } else {
      const result = await JobCollection.createJob(userId!, data)

      if (result) {
        // router.push('/job/submitted')
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
  }

  // useEffect(() => {
  //   const removeListener = navigation.addListener('beforeRemove', (event) => {
  //     event.preventDefault()
  //     // Clear the form store
  //     resetFormStore()
  //     navigation.dispatch(event.data.action)
  //   })

  //   const unsubscribe = useFormStore.subscribe((state) => {
  //     setValue('description', state.createJobFields.description ?? '', {
  //       shouldValidate: true,
  //     })
  //   })

  //   return () => {
  //     removeListener()
  //     unsubscribe()
  //   }
  // }, [])

  // useEffect(() => {
  //   if (postAs === 'company' && !createCompanyFields) showNoCompanyAlert()
  // }, [postAs])

  return (
    <>
      <ClPageView id="create-job">
        <View style={{ gap: Spacing[6] }}>
          <FormProvider {...methods}>
            <Controller
              name="postAs"
              control={control}
              rules={{
                required: true,
              }}
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
              rules={{
                required: true,
              }}
              textInputOptions={{
                label: 'Job Title',
                placeholder: 'Brick mason',
                size: 'small',
              }}
            />
            <ControlledSelectInput
              name="category"
              control={control}
              rules={{
                required: true,
              }}
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
              rules={{
                required: true,
              }}
              options={Cl.employmentTypes}
              selectInputOptions={{
                label: 'Employment Type',
                placeholder: 'Select',
                size: 'small',
              }}
            />
            <View style={{ display: 'none' }}>
              <ControlledTextInput
                name="description"
                control={control}
                rules={{
                  required: true,
                }}
                textInputOptions={{
                  label: 'Description',
                  placeholder: 'Tap to edit...',
                  size: 'small',
                  numberOfLines: 3,
                  readOnly: true,
                  multiline: true,
                  inputFieldStyle: {
                    verticalAlign: 'top',
                  },
                }}
              />
            </View>
            <ClWebViewControl
              label="Description"
              html={getValues('description') ?? ''}
              valid={errors.description === undefined}
              routeToEditor="/user/job/description-editor"
            />
            <ControlledTextInput
              name="location"
              control={control}
              rules={{
                required: true,
              }}
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
                text="Submit"
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
