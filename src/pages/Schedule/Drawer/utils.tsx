import { Col, Row, Typography } from 'antd'
import { ReadOnly } from '../../../components/UI/ReadOnly'
import { IInsurance } from '../../../interfaces/insurance'
import { IPaymentMethod } from '../../../interfaces/paymentMethod'
import { ISpecialty } from '../../../interfaces/specialty'
import { findLastAppointment } from '../../../services/requests/appointment'
import {
  formatBrCurrency,
  getDateInText,
  getTimeDifference,
} from '../../../utils/helpers/formatters'
import { IAppointmentDrawerData } from './CreateAppointmentDrawer'

interface IFindLastAppointmentDateAsyncResponse {
  is_follow_up: boolean
  last_appointment_date: string
}

interface ISelectOption {
  value: number
  label: string
}

type RelatedDataArr = ISelectOption[] | undefined

interface IRelatedDataResponse {
  insurancesArr: RelatedDataArr
  specialtiesArr: RelatedDataArr
  paymentMethodsArr: RelatedDataArr
}

/**
 * Gets formatted options to select input component.
 * @param {IInsurance[] | ISpecialty[] | IPaymentMethod[] | undefined} arr plain array of options.
 * @returns array of formatted options.
 */
const getFormattedSelectOpts = (
  arr: IInsurance[] | ISpecialty[] | IPaymentMethod[] | undefined
): ISelectOption[] | undefined =>
  arr ? arr.map(({ id, name }) => ({ label: name, value: id })) : undefined

const addNoneOpt = (
  arr?: ISelectOption[] | undefined,
  label = 'Não informado'
) => {
  if (arr) {
    arr.unshift({ value: -1, label })
  }

  return arr
}

/**
 * Fetches the patient's last appointment.
 * @param {number} patientId patient id.
 * @param {number} doctorId doctor id.
 * @param {number | undefined} appointment_follow_up_limit appointment follow up limit (in days).
 * @returns all necessary data to be handled in the screen.
 */
export const findLastAppointmentDateAsync = async (
  patientId: number,
  doctorId: number,
  targetDate: string,
  appointment_follow_up_limit?: number | undefined
): Promise<IFindLastAppointmentDateAsyncResponse> => {
  const response = await findLastAppointment(patientId, doctorId)
  const definedData = {
    is_follow_up: false,
    last_appointment_date: 'Nenhum registro',
  }

  if (!response.error) {
    if (response.data && response.data?.datetime) {
      const datetime = response.data.datetime
      const diffInDays = getTimeDifference('day', datetime, targetDate)
      const formattedDate = getDateInText(datetime)

      const getDiffInDaysLabel = () => {
        if (diffInDays <= 0 || !appointment_follow_up_limit) {
          return ''
        }

        if (diffInDays === 1) {
          return `(ontem)`
        }

        if (diffInDays >= Number(appointment_follow_up_limit)) {
          definedData.is_follow_up = false
          return `(há mais de ${appointment_follow_up_limit} dias atrás)`
        } else {
          definedData.is_follow_up = true
        }

        return `(${diffInDays} dias atrás)`
      }

      definedData.last_appointment_date = `${formattedDate} ${getDiffInDaysLabel()}`
    } else {
      definedData.last_appointment_date = 'Nenhum registro'
    }
  }

  return definedData
}

/**
 * Gets appointment related data (payment methods, insurances and specialties) ready to be used as options for select component.
 * @param {IAppointmentDrawerData | undefined} data drawer data.
 * @returns an object with the formatted array options.
 */
export const getFormattedRelatedData = (
  data: IAppointmentDrawerData | undefined
): IRelatedDataResponse => {
  const insurancesArr = addNoneOpt(
    getFormattedSelectOpts(data?.insurance),
    'Nenhum (Consulta Particular)'
  )
  const paymentMethodsArr = addNoneOpt(
    getFormattedSelectOpts(data?.payment_method)
  )
  const specialtiesArr = addNoneOpt(getFormattedSelectOpts(data?.specialty))

  return {
    insurancesArr,
    specialtiesArr,
    paymentMethodsArr,
  }
}

/**
 * Gets appointment price.
 * @param {boolean} watchedIsFollowUp useHookForm watched value (is_follow_up).
 * @param {ISelectOption | undefined} watchedInsurance useHookForm watched value (insurance).
 * @param {IAppointmentDrawerData | undefined} data drawer data.
 * @returns the appointment price in a legible text format.
 */
export const getAppointmentValue = (
  watchedIsFollowUp: boolean,
  watchedInsurance: ISelectOption | undefined,
  data: IAppointmentDrawerData | undefined
) => {
  if (watchedIsFollowUp) {
    return 'R$ 0,00 - Consulta de Retorno'
  }

  if (watchedInsurance?.value === -1) {
    return data?.private_appointment_price
      ? `${formatBrCurrency(
          data?.private_appointment_price
        )} - Consulta Particular`
      : 'Consulta Particular (valor não cadastrado pelo médico)'
  }

  return 'Pago pelo convênio'
}

/**
 * Gets default appointment text.
 * @param {IAppointmentDrawerData | undefined} data drawer data.
 * @param {'update' | 'create'} type edition or creation mode.
 * @returns a JSX element with formatted text.
 */
export const getDefaultAppointmentTextInfo = (
  data: IAppointmentDrawerData | undefined,
  type: 'update' | 'create'
): JSX.Element => (
  <>
    {!!data && (
      <>
        Você está {type === 'create' ? 'agendando' : 'editando'} uma consulta
        com <Typography.Text strong>{data?.doctor?.label}</Typography.Text> para
        o dia{' '}
        <Typography.Text strong>
          {new Date(data?.datetime).toLocaleDateString()}
        </Typography.Text>{' '}
        às{' '}
        <Typography.Text strong>
          {new Date(data?.datetime).toLocaleTimeString('pt-BR').substring(0, 5)}
        </Typography.Text>
        .
      </>
    )}
  </>
)

/**
 * Gets appointment info fields (doctor and datetime).
 * @param {IAppointmentDrawerData | undefined} data drawer data.
 * @returns a JSX element with formatted text.
 */
export const getAppointmentInfoFields = (
  data: IAppointmentDrawerData | undefined
): JSX.Element => (
  <>
    <Row>
      <Col span={24}>
        <ReadOnly
          label="Médico"
          value={data?.doctor.label || 'Não identificado'}
          required
        />
      </Col>
    </Row>

    <Row>
      <Col span={24}>
        <ReadOnly
          label="Data e Horário"
          value={
            data?.datetime
              ? `${new Date(data?.datetime).toLocaleDateString()} às ${new Date(
                  data?.datetime
                )
                  .toLocaleTimeString('pt-BR')
                  .substring(0, 5)}`
              : 'Não identificado'
          }
          required
        />
      </Col>
    </Row>
  </>
)
