import { ClBottomSheet } from '@/components/ClBottomSheet'
import { ClCard } from '@/components/ClCard'
import { ClIcon } from '@/components/ClIcon'
import { ClIconText } from '@/components/ClIconText'
import { ClInlineSpinner } from '@/components/ClInlineSpinner'
import { ClMenu } from '@/components/ClMenu'
import { ClPageView } from '@/components/ClPageView'
import type { ClSpinnerHandleProps } from '@/components/ClSpinner'
import { ClText } from '@/components/ClText'
import { ProfileCard } from '@/components/cards/ProfileCard'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { formatFullName } from '@/helpers/utils'
import { SavedProfileCollection, UserCollection } from '@/services/firebase'
import { Typo } from '@/theme'
import { IconSet } from '@/types/icons'
import { ToastPosition, toast } from '@backpackapp-io/react-native-toast'
import {
  type BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'

export default function UserProfile() {
  const styles = useStyles()
  const { userId } = useLocalSearchParams<{ userId: string }>()
  const spinnerRef = useRef<ClSpinnerHandleProps>(null)
  const {
    data: userDetails,
    isRefetching,
    isFetching,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => UserCollection.getUserInfo(userId),
  })
  const { data: isSaved } = useQuery({
    queryKey: ['user', userId, 'save-state'],
    queryFn: () => SavedProfileCollection.checkIfSaved(userId),
  })
  const navigation = useNavigation()
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const queryClient = useQueryClient()

  const handleSaveProfile = useCallback(async () => {
    spinnerRef.current?.show()

    if (userDetails) {
      if (isSaved) {
        await SavedProfileCollection.remove(userId)
        toast.success('Profile unsaved successfully', {
          position: ToastPosition.BOTTOM,
        })
      } else {
        await SavedProfileCollection.add(
          userId,
          formatFullName(userDetails.firstName, userDetails.lastName)
        )
        toast.success('Profile saved successfully', {
          position: ToastPosition.BOTTOM,
        })
      }
    }

    queryClient.invalidateQueries({ queryKey: ['user', userId, 'save-state'] })
    bottomSheetRef.current?.dismiss()
    spinnerRef.current?.hide()
  }, [userDetails])

  useEffect(() => {
    if (isFetching || isRefetching) {
      spinnerRef.current?.show()
    } else {
      spinnerRef.current?.hide()
    }
  }, [isFetching, isRefetching])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPressIn={() => bottomSheetRef.current?.present()}>
          <ClIcon
            set={IconSet.MaterialCommunityIcons}
            name="dots-vertical"
            color={styles.settingsIcon.color}
            size={styles.settingsIcon.fontSize}
          />
        </TouchableOpacity>
      ),
    })
  }, [navigation])

  return (
    <>
      <ClPageView id={`user-${userId}`}>
        {userDetails && (
          <>
            <ProfileCard userId={userId} details={userDetails} />
            <ClCard
              header={
                <ClText style={{ ...Typo.fontMap.semiBold }}>About</ClText>
              }
            >
              {userDetails.bio && (
                <ClIconText
                  text={userDetails.bio}
                  icon={{
                    set: IconSet.MaterialCommunityIcons,
                    name: 'comment-quote',
                  }}
                />
              )}
              <ClIconText
                text={userDetails.location}
                icon={{
                  set: IconSet.MaterialCommunityIcons,
                  name: 'map-marker',
                }}
              />
              {!userDetails.emailHidden && (
                <ClIconText
                  text={userDetails.email}
                  icon={{ set: IconSet.MaterialCommunityIcons, name: 'email' }}
                />
              )}
            </ClCard>
            <ClCard
              header={
                <ClText style={{ ...Typo.fontMap.semiBold }}>Works</ClText>
              }
            >
              <View style={styles.emptyPlaceholder}>
                <ClIcon
                  set={IconSet.MaterialCommunityIcons}
                  name="briefcase-search"
                  color={styles.emptyIcon.color}
                  size={styles.emptyIcon.fontSize}
                />
                <ClText type="helper" dim>
                  No works posted yet.
                </ClText>
              </View>
              {/* {userDetails.works && userDetails.works.length > 0 ? (
                userDetails.works.map((work, index) => (
                  <ClIconText
                    key={index}
                    text={work.title}
                    icon={{ set: IconSet.MaterialCommunityIcons, name: 'briefcase' }}
                  />
                ))
              ) : (
                <ClIconText
                  text="No works posted yet"
                  icon={{ set: IconSet.MaterialCommunityIcons, name: 'alert-circle-outline' }}
                />
              )} */}
            </ClCard>
            <ClCard
              header={
                <ClText style={{ ...Typo.fontMap.semiBold }}>Reviews</ClText>
              }
            >
              <View style={styles.emptyPlaceholder}>
                <ClIcon
                  set={IconSet.MaterialCommunityIcons}
                  name="comment-search"
                  color={styles.emptyIcon.color}
                  size={styles.emptyIcon.fontSize}
                />
                <ClText type="helper" dim>
                  No reviews yet.
                </ClText>
              </View>
            </ClCard>
          </>
        )}
      </ClPageView>
      <ClInlineSpinner ref={spinnerRef} visible />
      <BottomSheetModalProvider>
        <ClBottomSheet ref={bottomSheetRef} enableDynamicSizing={true}>
          <ClMenu
            hasBorders={false}
            items={[
              {
                title: isSaved ? 'Unsave' : 'Save',
                icon: {
                  set: IconSet.MaterialCommunityIcons,
                  name: isSaved ? 'bookmark-remove' : 'bookmark-plus',
                },
                onPress: handleSaveProfile,
              },
              {
                title: 'Report User',
                icon: {
                  set: IconSet.MaterialCommunityIcons,
                  name: 'alert-circle-outline',
                },
              },
            ]}
          />
        </ClBottomSheet>
      </BottomSheetModalProvider>
    </>
  )
}

const useStyles = createStyles(({ scheme, colors, spacing, sizes, typo }) => ({
  emptyPlaceholder: {
    alignItems: 'center',
    gap: spacing[2],
  },
  emptyIcon: {
    fontSize: sizes.icon['2xl'],
    color: resolveColor(scheme, colors.neutral[700], colors.neutral[300]),
  },
  settingsIcon: {
    color: resolveColor(scheme, colors.accent.base, colors.brand.base),
    fontSize: sizes.icon.md,
  },
}))
