import { createMuiTheme } from "@material-ui/core/styles";
import "@fontsource/inter";

/*
 *   defaults available here https://material-ui.com/customization/default-theme/
 *
 */

const customTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#ffffff",
      main: "#fafafa",
      dark: "#c7c7c7",
      contrastText: "#000000",
    },
    secondary: {
      light: "#ff5f52",
      main: "#c62828",
      dark: "#8e0000",
      contrastText: "#ffffff",
    },
  },
  typography: {
    h5: {
      fontFamily: ["Inter", "sans-serif"].join(","),
    },
    h6: {
      fontFamily: ["Inter", "sans-serif"].join(","),
    },
    overline: {
      fontFamily: ["Inter", "sans-serif"].join(","),
    },
    subtitle1: {
      fontFamily: ["Inter", "sans-serif"].join(","),
    },
    subtitle2: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontWeight: "bolder",
      fontSize: "1rem",
    },
  },
});

export default customTheme;
