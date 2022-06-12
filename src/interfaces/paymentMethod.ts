export interface IPaymentMethod {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface IPaymentMethodFormValues {
  name: string
  include?: boolean
}
