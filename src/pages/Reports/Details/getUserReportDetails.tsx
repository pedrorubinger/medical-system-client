/* eslint-disable no-unsafe-optional-chaining */
import { Typography } from 'antd'

import { IUser } from '../../../interfaces/user'

export const getUserReportDetails = (records: IUser[] = []) => {
  const total = records?.length
  const adminUsers = records?.filter(({ is_admin }) => is_admin)?.length
  const doctorUsers = records?.filter(({ doctor }) => !!doctor)?.length
  const managerUsers = records?.filter(({ role }) => role === 'manager')?.length

  const source = [
    <Typography.Text key="total">
      <strong>{total}</strong> usuário(s) no total.
    </Typography.Text>,
    <Typography.Text key="admins">
      <strong>{adminUsers}</strong> administrador(es) no total.
    </Typography.Text>,
    <Typography.Text key="doctors">
      <strong>{doctorUsers}</strong> médico(as) no total.
    </Typography.Text>,
    <Typography.Text key="managers">
      <strong>{managerUsers}</strong> secretário(as) no total.
    </Typography.Text>,
  ]

  return source
}
