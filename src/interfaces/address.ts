export interface IAddress {
  id: number
  street: string
  number: string
  postal_code: string
  neighborhood: string
  complement?: string
  created_at: string
  updated_at: string
}

export type TAddressData = Omit<IAddress, 'id' | 'created_at' | 'updated_at'>
