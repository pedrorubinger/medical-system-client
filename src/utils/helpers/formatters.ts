import { TAppointmentStatus } from '../../interfaces/appointment'
import {
  IParsedDaysScheduleSettings,
  IScheduleSettings,
} from '../../interfaces/scheduleSettings'
import { isISODate } from './validators'

/**
 * Transforms a plain string into a formatted CPF
 * @param value - CPF text
 * @returns a formatted CPF string
 */
export const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

/**
 * Transforms a plain string into a formatted CEP (Brazilian format)
 * @param value - CEP plain string
 * @returns a formatted CEP string
 */
export const formatCEP = (value: string) => {
  return value.replace(/\D/g, '').replace(/(\d{5})(\d{1,3})/, '$1-$2')
}

/**
 * Formats a plain string or number in brazilian currency format.
 * @param value - Plain monetary value
 * @returns a formatted monetary string (BR)
 */
export const formatBrCurrency = (value: string | number = 0): string => {
  return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/**
 * Converts a formatted brazilian monetary value into a plain monetary number
 * @param currency - Formatted monetary value (e.g.: R$ 350,00 ; R$ 2.000,00)
 * @returns plain monetary number
 */
export const convertBrCurrencyToNumber = (currency: string): number => {
  if (!currency.split('R$')?.[1]) {
    return Number(currency?.replaceAll('.', '').replaceAll(',', '.'))
  }

  return Number(
    currency?.split('R$')?.[1]?.replaceAll('.', '').replaceAll(',', '.')
  )
}

/**
 * Gets a responsive width to Antd Drawer.
 * @param {number | undefined} baseWidth width number in px that will be used whether the window inner width is greater than 900px
 * @returns a numeric width based in window inner width
 */
export const getDrawerWidth = (baseWidth = 800): number => {
  return window.innerWidth > 900 ? baseWidth : window.innerWidth
}

/**
 * Gets translated and formatted appointment status.
 * @param {TAppointmentStatus | undefined} status appointment status
 * @returns an appointment status.
 */
export const getAppointmentStatus = (
  status?: TAppointmentStatus | undefined
) => {
  switch (status) {
    case 'off':
      return 'Horário indisponível'
    case 'cancelled':
      return 'Cancelada'
    case 'confirmed':
      return 'Paciente Consultado'
    case 'pending':
      return 'Aguardando Paciente'
    default:
      return 'Horário Disponível'
  }
}

/**
 * Gets formatted doctor's schedule with the available times for each day of week.
 * @param {IScheduleSettings | null | undefined} schedule doctor's schedule settings.
 * @returns an object containing the available times for each day of week based in the doctor's schedule settings.
 */
export const getFormattedDoctorSchedule = (
  schedule?: IScheduleSettings | null
): IParsedDaysScheduleSettings => {
  const times: IParsedDaysScheduleSettings = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  }

  if (schedule?.monday) {
    times.monday = JSON.parse(schedule?.monday)?.times
  }

  if (schedule?.tuesday) {
    times.tuesday = JSON.parse(schedule?.tuesday)?.times
  }

  if (schedule?.wednesday) {
    times.wednesday = JSON.parse(schedule?.wednesday)?.times
  }

  if (schedule?.thursday) {
    times.thursday = JSON.parse(schedule?.thursday)?.times
  }

  if (schedule?.friday) {
    times.friday = JSON.parse(schedule?.friday)?.times
  }

  if (schedule?.saturday) {
    times.saturday = JSON.parse(schedule?.saturday)?.times
  }

  if (schedule?.sunday) {
    times.sunday = JSON.parse(schedule?.sunday)?.times
  }

  return times
}

/**
 * Gets UTC date.
 * @param {string} ISODate date string in ISO8601 format.
 * @param {boolean} plainDate flag that indicates if the function must return the formatted date in a plain format. Assigned as false by default.
 * @returns the formatted date in ISO8601 format or a Date object.
 */
export const getUTCDate = (ISODate: string, plainDate = false) => {
  if (!isISODate(ISODate)) {
    return ISODate
  }

  const date = new Date(ISODate)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const formattedDate = new Date(
    new Date(date).setUTCHours(hours, minutes, 0, 0)
  )

  return plainDate ? formattedDate : formattedDate.toISOString()
}
