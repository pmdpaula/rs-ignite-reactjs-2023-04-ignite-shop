import { createStitches } from "@stitches/react";

export const {
  config,
  styled,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
} = createStitches({
  theme: {
    colors: {
      white: "#fff",

      gray900: "#121214",
      gray800: "#202024",
      gray700: "#29292e",
      gray600: "#323238",
      gray500: "#3d3d4d",
      gray400: "#737380",
      gray300: "#c4c4cc",
      gray200: "#e4e4ee",
      gray100: "#e1e1e6",

      green500: "#00875f",
      green300: "#00b37e",
    },
    fontSizes: {
      md: "1.125rem",
      lg: "1.25rem",
      xl: "1.5rem",
      "2xl": "2rem",
    },
  },
});
