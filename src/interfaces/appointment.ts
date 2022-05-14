import { IInsurance } from './insurance'
import { IPatient } from './patient'
import { ISpecialty } from './specialty'

export type TAppointmentStatus = 'pending' | 'confirmed' | 'cancelled'

export interface IAppointment {
  id: number
  datetime: string
  is_follow_up: boolean
  last_appointment_datetime?: Date
  notes?: string
  exam_request?: string
  status?: TAppointmentStatus
  is_private: boolean
  tenant_id: number
  patient_id: number
  doctor_id: number
  insurance_id: number
  specialty_id: number
  payment_method_id: number
  created_at: string
  updated_at: string
  patient?: IPatient
  insurance?: IInsurance
  specialty?: ISpecialty
}

export type TAppointmentData = Omit<
  IAppointment,
  'id' | 'created_at' | 'updated_at'
>
