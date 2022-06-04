import { IInsurance } from './insurance'
import { IPatient } from './patient'
import { IPaymentMethod } from './paymentMethod'
import { ISpecialty } from './specialty'

export type TAppointmentStatus = 'off' | 'pending' | 'confirmed' | 'cancelled'

export interface IAppointment {
  id: number
  datetime: string
  is_follow_up: boolean
  last_appointment_datetime?: string | undefined | null
  notes?: string | undefined | null
  exam_request?: string | undefined | null
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
  payment_method?: IPaymentMethod | undefined | null
  insurance?: IInsurance | undefined | null
  specialty?: ISpecialty | undefined | null
}

export type TAppointmentData = Omit<
  IAppointment,
  'id' | 'created_at' | 'updated_at'
>

export interface IScheduledAppointment {
  insurance_id?: number | null | undefined
  insurance_name?: string | undefined
  is_private: boolean
  is_follow_up: boolean
  patient_id: number
  patient_name: string
  status: TAppointmentStatus
  time: string
  patient_phone: string
  specialty_id?: number | null | undefined
  specialty_name?: string | undefined
  last_appointment_datetime?: string | null | undefined
  payment_method_id?: number | null | undefined
  payment_method_name?: string | null | undefined
  doctor_id: number
  doctor_name: string
  created_at: string
  updated_at: string
}

export interface IMyAppointment extends Omit<IAppointment, 'patient'> {
  notes?: string | undefined | null
  exam_request?: string | undefined | null
  patient: IPatient
  patient_name: string
  insurance_name: string
}
