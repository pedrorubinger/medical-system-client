export interface IBadRequestError {
  field: string
  message: string
  rule: string
}

export interface IError {
  message: string
  status: number
  code?: string
  validation?: IBadRequestError[]
}
