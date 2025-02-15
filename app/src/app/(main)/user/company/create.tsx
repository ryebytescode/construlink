import { ClButton } from '@/components/ClButton'
import {
  ClInlineSpinner,
  type ClSpinnerHandleProps,
} from '@/components/ClInlineSpinner'
import { ClPageView } from '@/components/ClPageView'
import { ControlledSelectInput } from '@/components/controlled/ControlledSelectInput'
import { ControlledTextInput } from '@/components/controlled/ControlledTextInput'
import { Cl } from '@/lib/options'
import { CompanyCollection, User } from '@/services/firebase'
import { useFormStore } from '@/stores/forms'
import { Spacing } from '@/theme'
import { router } from 'expo-router'
import { useRef } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Alert, View } from 'react-native'

export default function CreateCompany() {
  const createCompanyFields = useFormStore((state) => state.createCompanyFields)
  const { control, handleSubmit } = useForm<CreateCompanyFields>({
    defaultValues: createCompanyFields ?? {},
  })
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)

  const onSubmit: SubmitHandler<CreateCompanyFields> = async (data) => {
    spinnerRef.current?.show()

    const result = await CompanyCollection.createCompany(User.get()?.uid!, data)

    if (result) {
      router.back()
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

  return (
    <>
      <ClPageView id="create-company">
        <View style={{ gap: Spacing[6] }}>
          {/* COMPANY LOGO HERE */}
          <ControlledTextInput
            name="name"
            control={control}
            rules={{ required: true }}
            textInputOptions={{
              label: 'Company Name',
              placeholder: 'ABC Construction Ltd.',
              size: 'small',
            }}
          />
          <ControlledTextInput
            name="description"
            control={control}
            rules={{ required: true }}
            textInputOptions={{
              label: 'Company Description',
              placeholder: 'Describe your company',
              size: 'small',
              multiline: true,
              inputFieldStyle: {
                verticalAlign: 'top',
                height: Spacing[40],
              },
            }}
          />
          <ControlledSelectInput
            name="size"
            control={control}
            rules={{
              required: true,
            }}
            options={Cl.companySizes}
            selectInputOptions={{
              label: 'Company Size',
              placeholder: 'Select',
              size: 'small',
            }}
          />
          <ControlledTextInput
            name="location"
            control={control}
            rules={{ required: true }}
            textInputOptions={{
              label: 'Business Location',
              placeholder: 'Address',
              size: 'small',
            }}
          />
          <ClButton text="Create" onPress={handleSubmit(onSubmit)} />
        </View>
      </ClPageView>
      <ClInlineSpinner ref={spinnerRef} transluscent />
    </>
  )
}
