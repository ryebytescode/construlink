import { ClIcon } from '@/components/ClIcon'
import { ClTabBar, type ClTabOption } from '@/components/navigation/ClTabBar'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Role } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth'
import { Palette, Typo } from '@/theme'
import { IconSet } from '@/types/icons'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Tabs, router } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import {
  type EdgeInsets,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'

export const unstable_settings = {
  initialRouteName: 'index',
}

const options: ClTabOption[] = [
  {
    routeName: 'jobs',
    icon: {
      outline: {
        set: IconSet.MaterialCommunityIcons,
        name: 'briefcase-search-outline',
      },
      filled: {
        set: IconSet.MaterialCommunityIcons,
        name: 'briefcase-search',
      },
    },
    shown: true,
  },
  {
    routeName: 'tradespeople',
    icon: {
      outline: {
        set: IconSet.MaterialCommunityIcons,
        name: 'briefcase-search-outline',
      },
      filled: {
        set: IconSet.MaterialCommunityIcons,
        name: 'briefcase-search',
      },
    },
    shown: true,
  },
  {
    routeName: 'applications',
    icon: {
      outline: {
        set: IconSet.MaterialCommunityIcons,
        name: 'clock-outline',
      },
      filled: {
        set: IconSet.MaterialCommunityIcons,
        name: 'clock',
      },
    },
    shown: true,
  },
  {
    routeName: 'profile',
    icon: {
      outline: {
        set: IconSet.MaterialCommunityIcons,
        name: 'account-circle-outline',
      },
      filled: {
        set: IconSet.MaterialCommunityIcons,
        name: 'account-circle',
      },
    },
    shown: true,
  },
]

const UserLayout = () => {
  useRenderCount('UserLayout')

  const insets = useSafeAreaInsets()
  const styles = useStyles({ insets })
  const role = useAuthStore((state) => state.role)

  return (
    <BottomSheetModalProvider>
      <Tabs
        tabBar={(props) => <ClTabBar {...props} options={options} />}
        screenOptions={{
          tabBarHideOnKeyboard: true,
          sceneStyle: styles.sceneContainer,
          animation: 'shift',
          headerBackground: () => (
            <View
              style={{ backgroundColor: styles.sceneContainer.backgroundColor }}
            />
          ),
          headerTintColor: resolveColor(
            Palette.dark.white,
            Palette.light.primaryText
          ) as string,
          headerTitleStyle: {
            ...Typo.fontMap.semiBold,
          },
        }}
      >
        <Tabs.Screen
          name="jobs"
          redirect={role === Role.EMPLOYER}
          options={{
            title: 'Jobs',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => router.navigate('/user/job/search')}
              >
                <ClIcon
                  set={IconSet.MaterialIcon}
                  name="search"
                  color={styles.settingsIcon.color}
                  size={styles.settingsIcon.fontSize}
                />
              </TouchableOpacity>
            ),
            headerRightContainerStyle: styles.headerRightContainer,
          }}
        />
        <Tabs.Screen
          name="tradespeople"
          redirect={role === Role.TRADESPERSON}
          options={{
            title: 'Tradespeople',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => router.navigate('/user/job/search')}
              >
                <ClIcon
                  set={IconSet.MaterialIcon}
                  name="search"
                  color={styles.settingsIcon.color}
                  size={styles.settingsIcon.fontSize}
                />
              </TouchableOpacity>
            ),
            headerRightContainerStyle: styles.headerRightContainer,
          }}
        />
        <Tabs.Screen
          name="applications"
          redirect={role === Role.EMPLOYER}
          options={{
            title: 'Track',
            headerTitle: 'My Applications',
            headerRight: () => (
              <TouchableOpacity
              //   onPress={() => router.navigate('/(main)/(user)/settings')}
              >
                <ClIcon
                  set={IconSet.Ionicons}
                  name="settings"
                  color={styles.settingsIcon.color}
                  size={styles.settingsIcon.fontSize}
                />
              </TouchableOpacity>
            ),
            headerRightContainerStyle: styles.headerRightContainer,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerRight: () => (
              <TouchableOpacity
              //   onPress={() => router.navigate('/(main)/(user)/settings')}
              >
                <ClIcon
                  set={IconSet.Ionicons}
                  name="settings"
                  color={styles.settingsIcon.color}
                  size={styles.settingsIcon.fontSize}
                />
              </TouchableOpacity>
            ),
            headerRightContainerStyle: styles.headerRightContainer,
          }}
        />
      </Tabs>
    </BottomSheetModalProvider>
  )
}

const useStyles = createStyles(
  ({ colors, sizes, spacing }, { insets }: { insets: EdgeInsets }) => ({
    sceneContainer: {
      backgroundColor: colors.background,
    },
    headerRightContainer: {
      paddingRight: spacing[4],
    },
    settingsIcon: {
      color: resolveColor(colors.accent.base, colors.brand.base),
      fontSize: sizes.icon.md,
    },
  })
)

export default UserLayout
