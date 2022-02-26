import { IInsurance } from './insurance'
import { ISpecialty } from './specialty'
import { IUser } from './user'

export interface IDoctor {
  id: number
  user_id: number
  crm_document: string
  created_at: string
  insurance: IInsurance[]
  specialty: ISpecialty[]
  updated_at: string
  user?: IUser
}
