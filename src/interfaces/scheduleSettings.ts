export interface IScheduleSettings {
  doctor_id: number
  id: number
  sunday?: string
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  updated_at: string
  created_at: string
}

export interface IParsedDaysScheduleSettings {
  sunday: string[]
  monday: string[]
  tuesday: string[]
  wednesday: string[]
  thursday: string[]
  friday: string[]
  saturday: string[]
}
