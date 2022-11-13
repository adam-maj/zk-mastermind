import {
  extendTheme,
  StyleFunctionProps,
  type ThemeConfig,
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `"Space Mono", system-ui, sans-serif`,
    body: `"Roboto Mono", system-ui, sans-serif`,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: "#111",
      },
    }),
  },
  components: {
    Text: {
      baseStyle: {
        color: "white",
        fontSize: "sm",
      },
    },
    Heading: {
      baseStyle: {
        color: "white",
      },
    },
  },
});

export default theme;
