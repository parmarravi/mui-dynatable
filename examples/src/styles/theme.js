import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { primaryColor, backgroundColor, secondaryColor } from "./colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      default: backgroundColor,
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // color: '#FFFEFA',
          // backgroundColor: primaryColor,
          fontFamily: "Barlow",
          fontWeight: 700,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        barColorPrimary: {
          backgroundColor: "#E8E8E8", // Change the color here
        },
      },
    },
    // MuiAppBar: {
    //     styleOverrides: {
    //         color: primaryColor
    //     }
    // },
  },

  typography: {
    fontFamily: "Barlow, BarlowSemiCondensed",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
  },

  // overrides: {
  //     MuiCssBaseline: {
  // '@global': {
  //     '*': {
  //         scrollbarWidth: 'thin',
  //         scrollbarColor: '#B7B7B7 transparent',
  //         '&::-webkit-scrollbar': {
  //             width: 6,
  //             height: 6,
  //             backgroundColor: 'transparent'
  //         },
  //         '&::-webkit-scrollbar-track': {
  //             backgroundColor: 'transparent'
  //         },
  //         '&::-webkit-scrollbar-thumb': {
  //             borderRadius: 6,
  //             backgroundColor: '#B7B7B7',
  //             minHeight: 24,
  //             minWidth: 24
  //         },
  //         '&::-webkit-scrollbar-thumb:focus': {
  //             backgroundColor: '#adadad'
  //         },
  //         '&::-webkit-scrollbar-thumb:active': {
  //             backgroundColor: '#adadad'
  //         },
  //         '&::-webkit-scrollbar-thumb:hover': {
  //             backgroundColor: '#adadad'
  //         },
  //         '&::-webkit-scrollbar-corner': {
  //             backgroundColor: 'transparent'
  //         }
  //     }
  // }
  //     }
  // }
});

export default theme;
