import { Tag } from 'antd'

import { TAppointmentStatus } from '../../interfaces/appointment'
import { getAppointmentStatus } from './formatters'

export const getAppointmentColor = (status: TAppointmentStatus | undefined) => {
  let color = '#3ed862'

  if (status === 'off') {
    color = '#cccccc'
  }

  if (status === 'pending') {
    color = '#fcd55f'
  }

  if (status === 'confirmed') {
    color = '#4370d8'
  }

  return (
    <Tag color={color} key={status}>
      {getAppointmentStatus(status)}
    </Tag>
  )
}
