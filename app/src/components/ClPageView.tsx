import { createStyles } from '@/helpers/createStyles'
import { useRenderCount } from '@/hooks/useRenderCount'
import type { ReactElement } from 'react'
import React from 'react'
import { ScrollView, type ScrollViewProps, View } from 'react-native'
import { ClText } from './ClText'

interface ClPageViewProps extends ScrollViewProps {
  id: string
  icon?: ReactElement
  title?: string | ReactElement
  subtitle?: string | ReactElement
  scrollable?: boolean
}

export const ClPageView = (props: ClPageViewProps) => {
  useRenderCount(`PageView: ${props.id}`)

  const {
    icon,
    title,
    subtitle,
    children,
    contentContainerStyle,
    scrollable = true,
    ...rest
  } = props
  const styles = useStyles()

  function Children() {
    return (
      <>
        {(icon || title || subtitle) && (
          <View style={styles.pageHeader}>
            {icon && icon}
            {typeof title === 'string' ? (
              <ClText type="h5" style={styles.title}>
                {title}
              </ClText>
            ) : (
              title
            )}
            {typeof subtitle === 'string' ? (
              <ClText dim>{subtitle}</ClText>
            ) : (
              subtitle
            )}
          </View>
        )}
        {children}
      </>
    )
  }

  if (scrollable) {
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.container, contentContainerStyle]}
        {...rest}
      >
        <Children />
      </ScrollView>
    )
  }

  return (
    <View
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={!scrollable && [styles.container, contentContainerStyle]}
      {...rest}
    >
      <Children />
    </View>
  )
}

const useStyles = createStyles(({ spacing, typo }) => ({
  container: {
    gap: spacing[4],
    paddingHorizontal: spacing[4]
  },
  pageHeader: {
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  title: {
    ...typo.fontMap.medium,
  },
}))
