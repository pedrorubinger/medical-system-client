import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

type SortOrder = 'descend' | 'ascend' | null

interface IFormatDecimalSeparatorOptions {
  /** @default '.' */
  currentSeparator?: ',' | '.'
  /** @default ',' */
  newSeparator?: ',' | '.'
}

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
      return 'Consulta Confirmada'
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

/**
 * Gets time passed (in years) based in a provided date (YYYY-MM-DD)
 * @param {string} date date in format YYYY-MM-DD
 * @returns time passed since provided date (in years) or null if an invalid date string is provided
 */
export const getTimePassed = (date: string): number | null => {
  return Number(dayjs().from(dayjs(date), true).replaceAll(/\D/g, '')) || null
}

/**
 * Gets time difference between two dates.
 * @param {'month' | 'day'} unit time unity.
 * @param {string} to - date string reference (from -> to)
 * @param {string} from - date string reference (from -> to). Today's date is defined as default value.
 * @returns the difference between the provided dates.
 */
export const getTimeDifference = (
  unit: 'month' | 'day',
  to: string,
  from?: string
): number => {
  return Number(dayjs(from || new Date()).diff(to, unit))
}

/**
 * Formats decimal values separator.
 * @param {string | number} value target value.
 * @param {IFormatDecimalSeparatorOptions} options separator options.
 * @returns a formatted value as string.
 */
export const formatDecimalSeparator = (
  value: number | string,
  options?: IFormatDecimalSeparatorOptions
): string => {
  if (!value) {
    return ''
  }

  const stringfiedValue = value.toString()
  const currentSeparator = options?.currentSeparator || '.'
  const newSeparator = options?.newSeparator || ','
  const removeInvalidChars = new RegExp('[^\\d' + newSeparator + ']', 'g') // /[^\d,]/g

  return stringfiedValue
    ?.replaceAll(currentSeparator, newSeparator)
    ?.replaceAll(removeInvalidChars, '')
}

/**
 * Gets date formatted in text (e.g.: 09/03/1999 às 00:36)
 * @param {string} date date string
 * @returns a formatted date
 */
export const getDateInText = (date: string) => {
  const formattedFullDate = new Date(date).toLocaleString()
  const formattedDate = formattedFullDate?.split(' ')?.[0]
  const time = formattedFullDate?.split(' ')?.[1]?.slice(0, 5)

  return `${formattedDate} às ${time}`
}

/**
 * Gets the disabled status message for icons and buttons title/tooltips.
 * @param {TAppointmentStatus | undefined} status appointment status.
 * @param {number | undefined} timeDiffInDays diferença de tempo em dias.
 * @returns the appropriate tooltip message based in the provided params.
 */
export const getDisabledStatusTitle = (
  status: TAppointmentStatus | undefined,
  timeDiffInDays?: number | undefined
) => {
  if (!status) {
    return 'Ainda não há uma consulta agendada para este horário'
  }

  if (status === 'off') {
    return 'Este horário está indisponível'
  }

  if (status === 'confirmed') {
    return 'Esta consulta já foi confirmada'
  }

  if (status === 'cancelled') {
    return 'Esta consulta foi cancelada'
  }

  if (timeDiffInDays && timeDiffInDays < 0) {
    return 'O dia da consulta ainda não chegou'
  }

  return 'Ainda não é possível confirmar esta consulta'
}

export const getSortOrder = (order: SortOrder = 'ascend'): SortOrder => order
