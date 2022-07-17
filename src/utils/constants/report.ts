export type ReportPermission = 'doctor' | 'admin'

interface ReportOption {
  id: number
  key: string
  entities: string[]
  permissions: ReportPermission[]
}

export const reportOptions: ReportOption[] = [
  {
    id: 1,
    key: 'ALL_APPOINTMENTS',
    entities: ['APPOINTMENT'],
    permissions: ['admin'],
  },
  {
    id: 2,
    key: 'ALL_DOCTOR_APPOINTMENTS',
    entities: ['APPOINTMENT'],
    permissions: ['admin', 'doctor'],
  },
  {
    id: 3,
    key: 'USERS',
    entities: ['USER'],
    permissions: ['admin'],
  },
  {
    id: 4,
    key: 'PATIENTS',
    entities: ['PATIENT'],
    permissions: ['admin'],
  },
  {
    id: 5,
    key: 'SPECIALTIES',
    entities: ['SPECIALTY'],
    permissions: ['admin'],
  },
  {
    id: 6,
    key: 'DOCTOR_SPECIALTIES',
    entities: ['SPECIALTY', 'DOCTOR'],
    permissions: ['doctor', 'admin'],
  },
  {
    id: 7,
    key: 'INSURANCES',
    entities: ['INSURANCE'],
    permissions: ['admin'],
  },
  {
    id: 8,
    key: 'DOCTOR_INSURANCES',
    entities: ['INSURANCE', 'DOCTOR'],
    permissions: ['admin', 'doctor'],
  },
  {
    id: 9,
    key: 'DOCTORS',
    entities: ['DOCTOR'],
    permissions: ['admin'],
  },
  {
    id: 10,
    key: 'PAYMENT_METHODS',
    entities: ['PAYMENT_METHOD'],
    permissions: ['admin'],
  },
  {
    id: 11,
    key: 'DOCTOR_PAYMENT_METHODS',
    entities: ['PAYMENT_METHOD', 'DOCTOR'],
    permissions: ['admin', 'doctor'],
  },
  {
    id: 12,
    key: 'SCHEDULE_DAYS_OFF',
    entities: ['SCHEDULE_DAYS_OFF'],
    permissions: ['admin', 'doctor'],
  },
  {
    id: 14,
    key: 'DOCTOR_PATIENTS',
    entities: ['DOCTORS', 'PATIENT'],
    permissions: ['admin', 'doctor'],
  },
]
