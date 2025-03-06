import { ClButton } from '@/components/ClButton'
import { ClText } from '@/components/ClText'
import { ClTextInput } from '@/components/ClTextInput'
import { useFormStore } from '@/stores/forms'
import { useUnmount } from 'ahooks'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  KeyboardToolbar,
} from 'react-native-keyboard-controller'
import { useShallow } from 'zustand/react/shallow'

const MAX_LENGTH = 300

export default function JobDescriptionEditorModal() {
  const { initialDescription, setCreateJobFields } = useFormStore(
    useShallow((state) => ({
      initialDescription: state.createJobFields.description,
      setCreateJobFields: state.setCreateJobFields,
    }))
  )
  const [description, setDescription] = useState(initialDescription)

  function saveChanges() {
    if (initialDescription !== description) setCreateJobFields({ description })
  }

  useUnmount(saveChanges)

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ClTextInput
          autoFocus={true}
          defaultValue={description}
          onChangeText={setDescription}
          inputWrapperStyle={{
            borderRadius: 0,
            borderWidth: 0,
            height: '100%',
          }}
          multiline={true}
          maxLength={MAX_LENGTH}
          placeholder="Provide a detailed description of the role, responsibilities, requirements and expectations."
        />
      </KeyboardAvoidingView>
      <KeyboardToolbar
        content={
          <ClText>
            {description?.length} / {MAX_LENGTH}
          </ClText>
        }
        showArrows={false}
        button={({ accessibilityLabel, onPress }) => (
          <ClButton
            size="small"
            variant="ghost"
            text={accessibilityLabel}
            onPress={(event) => {
              onPress(event)
              if (router.canGoBack()) router.back()
            }}
          />
        )}
      />
    </>
  )
}
