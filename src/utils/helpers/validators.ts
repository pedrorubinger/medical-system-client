import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

interface IDateIsInRangeParams {
  current: string
  start: string
  end: string
}

/**
 * Validates if the provided date is in the range
 * @param {IDateIsInRangeParams} params - current date, start of range and end of range.
 * @returns if the provided date is in the range (true or false).
 */
export const dateIsInRange = ({
  current,
  start,
  end,
}: IDateIsInRangeParams): boolean => {
  return dayjs(current).isBetween(dayjs(start), dayjs(end), undefined, '[]')
}

/**
 * Validates if the provided date string is in ISO8601 format.
 * @param {string} ISODate date string
 * @returns true or false
 */
export const isISODate = (ISODate: string) => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(ISODate)) {
    return false
  }

  return new Date(ISODate).toISOString() === ISODate
}
