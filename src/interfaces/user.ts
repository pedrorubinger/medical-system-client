import { IDoctor } from './doctor'
import { TRole } from './roles'

export interface IUser {
  id: number
  name: string
  email: string
  cpf: string
  phone: string
  is_admin: number | boolean
  is_clinic_owner: number | boolean
  is_master: number | boolean
  role: TRole
  reset_password_token: string | null
  doctor?: IDoctor
  created_at: string
  updated_at: string
}
