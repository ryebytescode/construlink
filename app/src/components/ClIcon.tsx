import { type GlyphMap, IconSet, type IconType } from '@/types/icons'
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import type { IconProps } from '@expo/vector-icons/build/createIconSet'
import React from 'react'

interface ClIconProps extends Omit<IconProps<string>, 'name'> {
  set: IconType['set']
  name: IconType['name']
}

export function ClIcon({ set, name, ...props }: ClIconProps) {
  return (
    <>
      {set === IconSet.MaterialIcon && (
        <MaterialIcons {...props} name={name as GlyphMap['MaterialIcons']} />
      )}
      {set === IconSet.MaterialCommunityIcons && (
        <MaterialCommunityIcons
          {...props}
          name={name as GlyphMap['MaterialCommunityIcons']}
        />
      )}
      {set === IconSet.Ionicons && (
        <Ionicons {...props} name={name as GlyphMap['Ionicons']} />
      )}
      {set === IconSet.AntDesign && (
        <AntDesign {...props} name={name as GlyphMap['AntDesign']} />
      )}
    </>
  )
}
