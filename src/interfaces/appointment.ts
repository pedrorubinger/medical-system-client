import { IInsurance } from './insurance'
import { IPatient } from './patient'
import { ISpecialty } from './specialty'

export type TAppointmentStatus = 'pending' | 'confirmed' | 'cancelled'

export interface IAppointment {
  id: number
  datetime: string
  is_follow_up: boolean
  last_appointment_datetime?: string
  notes?: string
  exam_request?: string
  status: TAppointmentStatus
  is_private: boolean
  patient_id: number
  doctor_id: number
  insurance_id: number | undefined | null
  specialty_id: number | undefined | null
  payment_method_id: number | undefined | null
  created_at: string
  updated_at: string
  patient?: IPatient
  insurance?: IInsurance | undefined | null
  specialty?: ISpecialty | undefined | null
}

export type TAppointmentData = Omit<
  IAppointment,
  'id' | 'created_at' | 'updated_at'
>
