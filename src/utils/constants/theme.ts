interface IThemeButtonProps {
  color: string
  border: string
  text: string
  hover?: string
}

export type TButtonColors = 'primary' | 'white' | 'new'

interface IThemeButton {
  primary: IThemeButtonProps
  white: IThemeButtonProps
  new: IThemeButtonProps
}

interface ITheme {
  primary?: string
  buttons: IThemeButton
}

export const Theme: ITheme = {
  primary: '#3762bf',
  buttons: {
    primary: {
      color: '#3762bf',
      border: '#214ca8',
      hover: '#214ca8',
      text: '#fff',
    },
    white: {
      color: '#fff',
      border: '#c6c6c6',
      text: '#000',
    },
    new: {
      color: '#0eb74f',
      border: '#09a545',
      hover: '#09a545',
      text: '#fff',
    },
  },
}
