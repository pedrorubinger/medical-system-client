import { IInsurance } from './insurance'
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
  updated_at: string
  user?: IUser
}
