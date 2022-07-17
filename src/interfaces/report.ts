import { IAppointment } from './appointment'
import { IDoctor } from './doctor'
import { IInsurance } from './insurance'
import { IPatient } from './patient'
import { IPaymentMethod } from './paymentMethod'
import { IScheduleDaysOff } from './scheduleDaysOff'
import { ISpecialty } from './specialty'
import { IUser } from './user'

export type IReportPermission = 'admin' | 'doctor'

export type IReportEntities =
  | IAppointment[]
  | IDoctor[]
  | IInsurance[]
  | IPatient[]
  | IPaymentMethod[]
  | ISpecialty[]
  | IUser[]
  | IScheduleDaysOff[]

export interface IReport extends Partial<IDoctor> {
  appointments: IAppointment[]
  doctors: IDoctor[]
  insurances: IInsurance[]
  patients: IPatient[]
  paymentMethods: IPaymentMethod[]
  specialties: ISpecialty[]
  users: IUser[]
}
