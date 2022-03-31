import { ScheduleAvailableTimes } from './AvailableScheduleTimes'
import { ScheduleDaysOff } from './DaysOff'

export const ScheduleSettings = () => {
  return (
    <>
      <ScheduleAvailableTimes />
      <ScheduleDaysOff />
    </>
  )
}
