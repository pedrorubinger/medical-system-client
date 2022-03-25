import { DaysOfWeek, TDayOfWeek } from '../../interfaces/week'

export const week: { value: TDayOfWeek; label: string }[] = [
  { value: 'sunday', label: DaysOfWeek.sunday },
  { value: 'monday', label: DaysOfWeek.monday },
  { value: 'tuesday', label: DaysOfWeek.tuesday },
  { value: 'wednesday', label: DaysOfWeek.wednesday },
  { value: 'thursday', label: DaysOfWeek.thursday },
  { value: 'friday', label: DaysOfWeek.friday },
  { value: 'saturday', label: DaysOfWeek.saturday },
]
