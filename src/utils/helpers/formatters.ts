/**
 * Transforms a plain string into a formatted CPF
 * @param value - CPF text
 * @returns a formatted CPF string
 */
export const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

/**
 * Transforms a plain string into a formatted CEP (Brazilian format)
 * @param value - CEP plain string
 * @returns a formatted CEP string
 */
export const formatCEP = (value: string) => {
  return value.replace(/\D/g, '').replace(/(\d{5})(\d{1,3})/, '$1-$2')
}

/**
 * Formats a plain string or number in brazilian currency format.
 * @param value - Plain monetary value
 * @returns a formatted monetary string (BR)
 */
export const formatBrCurrency = (value: string | number = 0): string => {
  return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/**
 * Converts a formatted brazilian monetary value into a plain monetary number
 * @param currency - Formatted monetary value (e.g.: R$ 350,00 ; R$ 2.000,00)
 * @returns plain monetary number
 */
export const convertBrCurrencyToNumber = (currency: string): number => {
  if (!currency.split('R$')?.[1]) {
    return Number(currency?.replaceAll('.', '').replaceAll(',', '.'))
  }

  return Number(
    currency?.split('R$')?.[1]?.replaceAll('.', '').replaceAll(',', '.')
  )
}

/**
 * Gets a responsive width to Antd Drawer.
 * @returns a numeric width based in window inner width
 */
export const getDrawerWidth = () => {
  return window.innerWidth > 900 ? 800 : window.innerWidth - 100
}
