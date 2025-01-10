import Colors from "./palette";
import Sizes from "./sizes";
import Spacing from "./spacing";
import Typography from "./typography";

export type SkinnedButtonColors = "brand" | "accent";

const Button = {
  colors: {
    light: {
      brand: {
        background: Colors.light.brand[600],
        border: Colors.light.brand[600],
        text: Colors.light.white,
      },
      accent: {
        background: Colors.light.accent[600],
        border: Colors.light.accent[600],
        text: Colors.light.white,
      },
      disabled: {
        background: Colors.light.neutral[200],
        border: Colors.light.neutral[200],
        text: Colors.light.neutral[500],
      },
    },
    dark: {
      brand: {
        background: Colors.dark.brand[500],
        border: Colors.dark.brand[500],
        text: Colors.dark.white,
      },
      accent: {
        background: Colors.dark.accent[600],
        border: Colors.dark.accent[600],
        text: Colors.dark.white,
      },
      disabled: {
        background: Colors.dark.neutral[600],
        border: Colors.dark.neutral[600],
        text: Colors.dark.neutral[300],
      },
    },
  },
  borderWidth: Spacing[0.5],
  radius: Sizes.radius["2xl"],
  sizes: {
    xsmall: {
      px: Spacing[3],
      py: Spacing[2],
      font: Typography.sizes.xs,
    },
    small: {
      px: Spacing[3],
      py: Spacing[2],
      font: Typography.sizes.sm,
    },
    base: {
      px: Spacing[5],
      py: Spacing[3.5],
      font: Typography.sizes.base,
    },
    large: {
      px: Spacing[5],
      py: Spacing[3.5],
      font: Typography.sizes.lg,
    },
    xlarge: {
      px: Spacing[6],
      py: Spacing[4],
      font: Typography.sizes.xl,
    },
  },
};

const CheckBox = {
  colors: {
    light: {
      brand: {
        background: Colors.dark.brand[500],
        border: Colors.light.brand[500],
      },
      accent: {
        background: Colors.light.accent[600],
        border: Colors.light.accent[600],
      },
      disabled: {
        background: Colors.light.neutral[200],
        border: Colors.light.neutral[200],
      },
    },
    dark: {
      brand: {
        background: Colors.dark.brand[600],
        border: Colors.light.brand[600],
      },
      accent: {
        background: Colors.light.accent[600],
        border: Colors.light.accent[600],
      },
      disabled: {
        background: Colors.light.neutral[600],
        border: Colors.light.neutral[600],
      },
    },
  },
  radius: Sizes.radius.full,
  sizes: {
    small: {
      diameter: 16,
      fontSize: Typography.sizes.sm.fontSize,
    },
    medium: {
      diameter: 24,
      fontSize: Typography.sizes.base.fontSize,
    },
    large: {
      diameter: 32,
      fontSize: Typography.sizes.lg.fontSize,
    },
  },
};

const TextInput = {
  colors: {
    light: {
      border: Colors.light.neutral[200],
      background: Colors.light.neutral[50],
    },
    dark: {
      border: Colors.dark.neutral[600],
      background: Colors.dark.neutral[700],
    },
  },
  radius: Sizes.radius["2xl"],
  sizes: {
    small: {
      padding: Spacing[2],
      fontSize: Typography.sizes.sm.fontSize,
      labelFontSize: Typography.sizes.sm.fontSize,
    },
    medium: {
      padding: Spacing[3],
      fontSize: Typography.sizes.base.fontSize,
      labelFontSize: Typography.sizes.base.fontSize,
    },
    large: {
      padding: Spacing[5],
      fontSize: Typography.sizes.xl.fontSize,
      labelFontSize: Typography.sizes.base.fontSize,
    },
  },
};

export default {
  Button,
  CheckBox,
  TextInput,
};
