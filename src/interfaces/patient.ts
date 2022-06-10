import { IAddress } from './address'

export interface IPatient {
  id: number
  name: string
  cpf: string
  birthdate: string
  mother_name: string
  primary_phone: string
  address_id?: number | undefined
  father_name?: string | undefined
  secondary_phone?: string | undefined
  email?: string
  address?: IAddress | undefined
  created_at: string
  updated_at: string
}

interface IAddressData
  extends Omit<IAddress, 'id' | 'created_at' | 'updated_at'> {
  id?: number
}

export type TPatientData = Omit<
  IPatient,
  'id' | 'created_at' | 'updated_at' | 'address'
> & { address?: IAddressData }

export interface IMyPatient {
  notes?: string
  allergies?: string
  illnesses?: string
  height?: number
  weight?: number
  doctor_id: number
  patient_id: number
}

export interface ICompletePatient extends IPatient, IMyPatient {}
