/* eslint-disable no-unsafe-optional-chaining */
import { Typography } from 'antd'

import { IAppointment } from '../../../interfaces/appointment'
import { formatBrCurrency } from '../../../utils/helpers/formatters'

const sumAppointmentPrices = (arr: IAppointment[] = []) =>
  arr
    ?.map(({ price }) => price)
    ?.filter(Boolean)
    ?.reduce((acc, curr) => (acc as number) + (curr as number))

export const getAppointmentReportDetails = (records: IAppointment[] = []) => {
  const total = records?.length
  const privateAppointments = records?.filter(
    ({ is_private }) => !!is_private
  )?.length
  const insurancesAppointments = records?.filter(
    ({ insurance_id }) => !!insurance_id
  )?.length
  const followUpAppointments = records?.filter(
    ({ is_follow_up }) => !!is_follow_up
  )?.length
  const confirmedAppointments = records?.filter(
    ({ status }) => status === 'confirmed'
  )?.length
  const pendingAppointments = records?.filter(
    ({ status }) => status === 'pending'
  )?.length
  // const cancelledAppointments = records?.filter(
  //   ({ status }) => status === 'cancelled'
  // )?.length
  const unspecifiedSpecialtyAppointments = records?.filter(
    (item) => !item.specialty?.name
  )?.length
  const specialtyAppointments = records
    ?.map((item) => item.specialty?.name)
    ?.filter(Boolean)
  const appointmentsBySpecialties = specialtyAppointments
    ?.map((item) => ({
      name: item,
      amount: specialtyAppointments?.filter((specialty) => specialty === item)
        ?.length,
    }))
    ?.filter(({ name }, i) => !specialtyAppointments?.includes(name, i + 1))
  const totalPrice = sumAppointmentPrices(
    records?.filter(({ status }) => status === 'confirmed')
  )
  const privateAppointmentsPrice = sumAppointmentPrices(
    records?.filter(
      ({ status, is_private }) => status === 'confirmed' && !!is_private
    )
  )
  const insuranceAppointmentsPrice = sumAppointmentPrices(
    records?.filter(
      ({ status, insurance_id }) => status === 'confirmed' && !!insurance_id
    )
  )

  const source = [
    <Typography.Text key="total">
      <strong>{total}</strong> consulta(s) no total.
    </Typography.Text>,
    <Typography.Text key="private">
      <strong>{privateAppointments}</strong> consulta(s) particulares.
    </Typography.Text>,
    <Typography.Text key="insurance">
      <strong>{insurancesAppointments}</strong> consulta(s) agendadas por meio
      de convênio(s).
    </Typography.Text>,
    <Typography.Text key="follow_up">
      <strong>{followUpAppointments}</strong> consulta(s) de retorno.
    </Typography.Text>,
    <Typography.Text key="confirmed">
      <strong>{confirmedAppointments}</strong> consulta(s) confirmada(s).
    </Typography.Text>,
    <Typography.Text key="pending">
      <strong>{pendingAppointments}</strong> consulta(s) pendente(s).
    </Typography.Text>,
    // <Typography.Text key="cancelled">
    //   <strong>{cancelledAppointments}</strong> consulta(s) cancelada(s).
    // </Typography.Text>,
    ...appointmentsBySpecialties
      ?.map(({ name, amount }) => {
        return (
          <Typography.Text key={`by_specialty_${name}`}>
            <strong>{amount}</strong> consulta(s) agendada(s) para a
            especialidade <strong>{name}</strong>.
          </Typography.Text>
        )
      })
      ?.filter(Boolean),
    <Typography.Text key="no_specialty">
      <strong>{unspecifiedSpecialtyAppointments}</strong> consulta(s)
      agendada(s) sem especificar uma especialidade.
    </Typography.Text>,
    <Typography.Text key="prices">
      Considerando os valores definidos pelo médico(a), a(s) consulta(s)
      totalizaram <strong>{formatBrCurrency(totalPrice || 0)}</strong>, sendo{' '}
      <strong>{formatBrCurrency(privateAppointmentsPrice)}</strong> de
      consulta(s) particular(es) e{' '}
      <strong>{formatBrCurrency(insuranceAppointmentsPrice)}</strong> de
      consulta(s) de convênio(s).
    </Typography.Text>,
  ]

  return source
}
