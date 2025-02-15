import { ClButton } from '@/components/ClButton'
import { ClPageView } from '@/components/ClPageView'
import { ClRadioInput } from '@/components/ClRadio'
import type { Role } from '@/lib/constants'
import { Cl } from '@/lib/options'
import { Spacing } from '@/theme'
import { router } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

export default function RoleSelectionScreen() {
  const [role, setRole] = useState<Role>()

  return (
    <ClPageView
      id="role-selection"
      title="Select your role"
      contentContainerStyle={{ flex: 1 }}
    >
      <ClRadioInput
        id="role"
        options={Cl.role}
        radioInputStyles={{ paddingVertical: Spacing[6] }}
        value={role}
        onChange={(value) => setRole(value as Role)}
      />
      <View style={{ flex: 1 }} />
      <ClButton
        text="Next"
        disabled={!role}
        onPress={() =>
          router.push({ pathname: '/auth/method-chooser', params: { role } })
        }
      />
    </ClPageView>
  )
}
