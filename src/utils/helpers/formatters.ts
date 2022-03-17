/** TO DO: Document functions... (JS Docs) */

export const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const formatBrCurrency = (value: string | number = 0): string => {
  return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export const convertBrCurrencyToNumber = (currency: string): number => {
  if (!currency.split('R$')?.[1]) {
    return Number(currency?.replaceAll('.', '').replaceAll(',', '.'))
  }

  return Number(
    currency?.split('R$')?.[1]?.replaceAll('.', '').replaceAll(',', '.')
  )
}
