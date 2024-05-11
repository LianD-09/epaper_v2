export const Color = {
    primary: {
        100: '#f8f8f8',
        200: '#e6e7ea',
        300: '#adb0b9',
        400: '#8c909d',
        500: '#7b808f',
        600: '#6b7081',
        700: '#5a6073', /// main
        800: '#484d5c',
        900: '#363a45'
    },
    secondary: {
        100: '#fff5e4',
        200: '#ffefd2',
        300: '#ffe9c0',
        400: '#ffe2ae',
        500: '#ffdfa5', /// main
        600: '#e6c995',
        700: '#aa956e',
        800: '#887758',
        900: '#554a37',
    },
    info: {
        50: '#f0f6fb',
        100: '#e0edf7',
        200: '#c1dbef',
        300: '#a2c9e8',
        400: '#83b7e0',
        500: '#64a5d8', /// main
        600: '#5a95c2',
        700: '#467397',
        800: '#32536c',
        900: '#284256',
    },
    success: {
        100: '#d7eee3',
        200: '#bce2d0',
        300: '#afdcc7',
        400: '#94d1b4',
        500: '#79c5a1', /// main
        600: '#619e81',
        700: '#558a71',
        800: '#3d6351',
        900: '#304f40',
    },
    purple: {
        600: '#d9b1d5'
    },
    orange: {
        700: '#f47e32',
    },
    error: {
        300: '#FCE9EA',
        400: '#FCE9EA',
        500: '#FFA4B0',
        600: '#FFA4B0',
        700: '#FF8D9C', /// main
        800: '#FF7183',
        900: '#ff4e64',
    },
    disable: {
        50: '#f6f6f6',
        100: '#ededed',
        200: '#d3d3d3',
        300: '#c1c1c1',
        400: '#b8b8b8',
        500: '#a6a6a6',
        600: '#858585',
        700: '#646464', /// main
        800: '#424242',
        900: '#323232'
    },
    white: {
        100: '#ffffff',
    },
    black: {
        100: '#000000'
    }
}

export const toOpacity = (opacity: number, color: String) => color + (opacity * 255 < 16 ? '0' : '') + `${Math.round(opacity * 255).toString(16)}`;


export default Color;
