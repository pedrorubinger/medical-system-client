export interface ITenant {
  id: number
  name: string
  created_at: string
  updated_at: string
  is_active: number | boolean
}

export interface ITenantFormValues {
  name: string
  is_active: boolean
}
