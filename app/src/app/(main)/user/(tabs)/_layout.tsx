import { ClIcon } from '@/components/ClIcon'
import { ClTabBar, type ClTabOption } from '@/components/navigation/ClTabBar'
import { useAuth } from '@/contexts/auth'
import { useTheme } from '@/contexts/theme'
import { createStyles } from '@/helpers/createStyles'
import { resolveColor } from '@/helpers/resolveColor'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Role } from '@/lib/constants'
import { Palette, Typo } from '@/theme'
import { IconSet } from '@/types/icons'
import { Tabs, router } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'

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
        name: 'account-search-outline',
      },
      filled: {
        set: IconSet.MaterialCommunityIcons,
        name: 'account-search',
      },
    },
    shown: true,
  },
  {
    routeName: 'posts',
    icon: {
      outline: {
        set: IconSet.MaterialCommunityIcons,
        name: 'post-outline',
      },
      filled: {
        set: IconSet.MaterialCommunityIcons,
        name: 'post',
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
    routeName: 'messages',
    icon: {
      outline: {
        set: IconSet.MaterialCommunityIcons,
        name: 'message-outline',
      },
      filled: {
        set: IconSet.MaterialCommunityIcons,
        name: 'message',
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

export default function TabsLayout() {
  useRenderCount('TabsLayout')

  const styles = useStyles()
  const { userInfo } = useAuth()
  const { scheme } = useTheme()

  return (
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
          scheme,
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
        redirect={userInfo!.role === Role.EMPLOYER}
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
        redirect={userInfo!.role === Role.TRADESPERSON}
        options={{
          title: 'Hire',
          headerTitle: 'Tradespeople',
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
        name="posts"
        redirect={userInfo!.role === Role.TRADESPERSON}
        options={{
          title: 'Posts',
          headerTitle: 'My Posts',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.navigate('/user/job/create')}
            >
              <ClIcon
                set={IconSet.MaterialIcon}
                name="add-circle"
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
        redirect={userInfo!.role === Role.EMPLOYER}
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
        name="messages"
        options={{
          title: 'Messages',
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
            <TouchableOpacity onPress={() => router.navigate('/user/settings')}>
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
  )
}

const useStyles = createStyles(({ scheme, colors, sizes, spacing }) => ({
  sceneContainer: {
    backgroundColor: colors.background,
  },
  headerRightContainer: {
    paddingRight: spacing[4],
  },
  settingsIcon: {
    color: resolveColor(scheme, colors.accent.base, colors.brand.base),
    fontSize: sizes.icon.md,
  },
}))
