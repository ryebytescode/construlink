import { ClIcon } from '@/components/ClIcon'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useDebounceFn } from '@/hooks/useDebounceFn'
import { useAppStore } from '@/stores/app'
import { useFormStore } from '@/stores/forms'
import { Styled } from '@/theme'
import { IconSet } from '@/types/icons'
import { ToastPosition, toast } from '@backpackapp-io/react-native-toast'
import { router, useNavigation } from 'expo-router'
import React, {
  type ComponentPropsWithoutRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor'

const AUTO_SAVE_DELAY = 2000 // 2s

export default function JobDescriptionEditorModal() {
  const styles = useStyles()
  const scheme = useAppStore((state) => state.scheme)
  const navigation = useNavigation()
  const richText = useRef<RichEditor>(null)
  const jobDescription = useFormStore(
    (state) => state.createJobFields.description
  )
  const setCreateJobFields = useFormStore((state) => state.setCreateJobFields)
  const [value, setValue] = useState(jobDescription)

  const editorStyle: ComponentPropsWithoutRef<
    typeof RichEditor
  >['editorStyle'] = useMemo(
    () => ({
      initialCSSText: Styled.RichTextInput.initialCSSText,
      contentCSSText: Styled.RichTextInput.contentCSSText,
      color: Styled.RichTextInput.colors[scheme].textColor,
      backgroundColor: Styled.RichTextInput.colors[scheme].backgroundColor,
    }),
    [scheme]
  )

  const { run: handleAutosave, cancel: cancelAutosave } = useDebounceFn(
    (html: string) => {
      setCreateJobFields({ description: html })
      toast.success('Draft autosaved', {
        position: ToastPosition.BOTTOM,
        duration: 4000,
      })
    },
    AUTO_SAVE_DELAY
  )

  const handleSave = () => {
    setCreateJobFields({ description: value })
    cancelAutosave()
    router.back()
  }

  useEffect(() => {
    if (value) handleAutosave(value)
  }, [value])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <TouchableOpacity onPress={handleSave}>
          <ClIcon
            set={IconSet.MaterialCommunityIcons}
            name="content-save"
            color={styles.settingsIcon.color}
            size={styles.settingsIcon.fontSize}
          />
        </TouchableOpacity>
      ),
    })
  }, [value])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <RichEditor
          ref={richText}
          onChange={setValue}
          style={{ flex: 1 }}
          editorStyle={editorStyle}
          placeholder="Provide a detailed description of the role, responsibilities, requirements and expectations."
          pasteAsPlainText={true}
          initialContentHTML={value}
        />
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.undo,
            actions.redo,
          ]}
          style={styles.toolbar}
          selectedIconTint={styles.selectedIcon.color}
          disabledIconTint={styles.disabledIcon.color}
        />
      </KeyboardAvoidingView>
    </View>
  )
}

const useStyles = createStyles(
  ({ colors, spacing, styled, scheme, sizes }) => ({
    settingsIcon: {
      color: resolveColor(colors.accent.base, colors.brand.base),
      fontSize: sizes.icon.md,
    },
    container: {
      flex: 1,
      padding: spacing[4],
      backgroundColor: styled.RichTextInput.colors[scheme].backgroundColor,
    },
    toolbar: {
      backgroundColor: colors.background,
      elevation: 2,
      shadowColor: resolveColor(colors.neutral[800], colors.neutral[300]),
    },
    selectedIcon: {
      color: resolveColor(colors.accent.base, colors.brand.base),
    },
    disabledIcon: {
      color: colors.secondaryText,
    },
  })
)
