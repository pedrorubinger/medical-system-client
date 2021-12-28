import { TRole } from './roles'

export interface IUser {
  id: number
  name: string
  email: string
  cpf: string
  phone: string
  is_admin: number | boolean
  role: TRole
  reset_password_token: string | null
  created_at: string
  updated_at: string
}
