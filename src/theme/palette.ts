export type Scheme = "light" | "dark";
export type ColorType = "brand" | "accent" | "neutral";
export type UIState = "success" | "info" | "warning" | "danger";

type Color = {
  base: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

type Palette = {
  white: string;
  black: string;
  neutral: Color;
  brand: Color;
  accent: Color;
  states: Record<UIState, Color>;
};

const colors: Palette = {
  white: "#ffffff",
  black: "#0a0a0a",
  neutral: {
    base: "#171717",
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },
  brand: {
    base: "#4C30D7",
    50: "#edeafb",
    100: "#c8bff3",
    200: "#a394ea",
    300: "#7e69e2",
    400: "#593fda",
    500: "#3f25c0",
    600: "#311d96",
    700: "#23156b",
    800: "#150c40",
    900: "#070415",
  },
  accent: {
    base: "#FBBD48",
    50: "#fef6e6",
    100: "#fde4b4",
    200: "#fcd282",
    300: "#fbc050",
    400: "#faae1e",
    500: "#e19405",
    600: "#af7304",
    700: "#7d5203",
    800: "#4b3102",
    900: "#191001",
  },
  states: {
    success: {
      base: "#29E547",
      50: "#CDF9D4",
      100: "#BBF7C4",
      200: "#96F2A5",
      300: "#72EE86",
      400: "#4DE966",
      500: "#29E547",
      600: "#17BF32",
      700: "#118D25",
      800: "#0B5B18",
      900: "#05290B",
    },
    warning: {
      base: "#E57529",
      50: "#F9DFCD",
      100: "#F7D3BB",
      200: "#F2BB96",
      300: "#EEA472",
      400: "#E98C4D",
      500: "#E57529",
      600: "#BF5B17",
      700: "#8D4311",
      800: "#5B2B0B",
      900: "#291305",
    },
    danger: {
      base: "#E52929",
      50: "#f9e0e0",
      100: "#F7BBBB",
      200: "#F29696",
      300: "#EE7272",
      400: "#E94D4D",
      500: "#E52929",
      600: "#BF1717",
      700: "#8D1111",
      800: "#5B0B0B",
      900: "#290505",
    },
    info: {
      base: "#2996E5",
      50: "#CDE6F9",
      100: "#BBDDF7",
      200: "#96CCF2",
      300: "#72BAEE",
      400: "#4DA8E9",
      500: "#2996E5",
      600: "#1778BF",
      700: "#11598D",
      800: "#0B395B",
      900: "#051A29",
    },
  },
};

const light = {
  ...colors,
  background: colors.white,
  modalBackground: "#413e41d9",
  disabled: "#6C757D",
  outline: colors.neutral[50],
  primaryText: colors.neutral[600],
  secondaryText: "#757575",
};

const dark = {
  ...colors,
  background: "#141314",
  modalBackground: "#141314d9",
  disabled: "#BDBDBD",
  outline: colors.neutral[700],
  primaryText: colors.white,
  secondaryText: "#bdbdbd",
};

export default {
  colors,
  light,
  dark,
};
