interface IThemeButtonProps {
  color: string
  border: string
  text: string
}

export type TButtonColors = 'primary'

interface IThemeButton {
  primary: IThemeButtonProps
}

interface ITheme {
  primary: string
  buttons: IThemeButton
}

export const Theme: ITheme = {
  primary: '#3762bf',
  buttons: {
    primary: {
      color: '#3762bf',
      border: '#214ca8',
      text: '#fff',
    },
  },
}
