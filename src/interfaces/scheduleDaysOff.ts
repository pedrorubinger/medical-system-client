export interface IScheduleDaysOffFormValues {
  datetime_start: string
  datetime_end: string
}

export interface IScheduleDaysOff {
  id: number
  doctor_id: number
  datetime_start: string // Date
  datetime_end: string // Date
  updated_at: string // Date
  created_at: string // Date
}
