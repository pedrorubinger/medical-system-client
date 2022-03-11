import { IDoctor } from './doctor'
import { TRole } from './roles'

export interface IUser {
  id: number
  tenant_id: number
  name: string
  email: string
  cpf: string
  phone: string
  is_admin: number | boolean
  role: TRole
  reset_password_token: string | null
  doctor?: IDoctor
  created_at: string
  updated_at: string
}

export interface IUserFormValues {
  name: string
  email: string
  cpf: string
  phone: string
  is_admin: boolean
  role: TRole
}
