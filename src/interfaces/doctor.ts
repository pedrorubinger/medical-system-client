import { IInsurance } from './insurance'
import { IPaymentMethod } from './paymentMethod'
import { ISpecialty } from './specialty'
import { IUser } from './user'

export interface IDoctorInsurance extends IInsurance {
  price: number
}

export interface IDoctor {
  id: number
  user_id: number
  crm_document: string
  created_at: string
  insurance: IDoctorInsurance[]
  specialty: ISpecialty[]
  payment_method: IPaymentMethod[]
  private_appointment_price: number
  appointment_follow_up_limit: number
  updated_at: string
  user?: IUser
}
