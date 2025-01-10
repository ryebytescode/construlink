import type {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'

// biome-ignore lint/style/useEnumInitializers:
export enum IconSet {
  MaterialIcon,
  MaterialCommunityIcons,
  Ionicons,
  AntDesign,
}

export interface GlyphMap {
  MaterialIcons: keyof typeof MaterialIcons.glyphMap
  MaterialCommunityIcons: keyof typeof MaterialCommunityIcons.glyphMap
  Ionicons: keyof typeof Ionicons.glyphMap
  AntDesign: keyof typeof AntDesign.glyphMap
}

export type IconType =
  | { set: IconSet.MaterialIcon; name: GlyphMap['MaterialIcons'] }
  | {
      set: IconSet.MaterialCommunityIcons
      name: GlyphMap['MaterialCommunityIcons']
    }
  | { set: IconSet.Ionicons; name: GlyphMap['Ionicons'] }
  | { set: IconSet.AntDesign; name: GlyphMap['AntDesign'] }
