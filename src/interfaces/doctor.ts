import { IUser } from './user'

export interface IDoctor {
  id: number
  user_id: number
  crm_document: string
  created_at: string
  updated_at: string
  user?: IUser
}
