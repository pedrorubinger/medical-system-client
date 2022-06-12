export interface IInsurance {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface IInsuranceFormValues {
  name: string
  price?: string | undefined
  include?: boolean | undefined
}
