/* eslint-disable no-unsafe-optional-chaining */
import { Col, List, Modal, Row, Typography } from 'antd'

import { SubtitleContainer } from './styles'
import { IAppointment } from '../../interfaces/appointment'
import { IPatient } from '../../interfaces/patient'
import { IReportEntities } from '../../interfaces/report'
import { IUser } from '../../interfaces/user'
import { getAppointmentReportDetails } from './Details/getAppointmentReportDetails'
import { getPatientReportDetails } from './Details/getPatientReportDetails'
import { getUserReportDetails } from './Details/getUserReportDetails'

interface IReportDetailsModalProps {
  /** @default false */
  isVisible: boolean
  /** @default [] */
  data?: IReportEntities | undefined
  id?: string
  onCancel?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const ReportDetailsModal = ({
  isVisible,
  data = [],
  id,
  onCancel,
}: IReportDetailsModalProps) => {
  if (!data || !id) {
    return null
  }

  const getSubtitle = () => {
    let text = ''

    if (id === 'APPOINTMENTS' && data?.length) {
      text =
        'Abaixo você encontra os detalhes da(s) consulta(s) encontradas no intervalo especificado por você.'
    }

    if (id === 'PATIENTS' && data?.length) {
      text =
        'Abaixo você encontra os detalhes do(s) paciente(s) que foram cadastrados no intervalo especificado por você.'
    }

    if (id === 'USERS' && data?.length) {
      text =
        'Abaixo você encontra os detalhes do(s) usuário(s) que foram cadastrados no intervalo especificado por você.'
    }

    return <Typography.Text type="secondary">{text}</Typography.Text>
  }

  const getGrid = () => {
    let source: JSX.Element[] = []

    if (id === 'APPOINTMENTS' && data?.length) {
      source = getAppointmentReportDetails(data as IAppointment[])
    }

    if (id === 'PATIENTS' && data?.length) {
      source = getPatientReportDetails(data as IPatient[])
    }

    if (id === 'USERS' && data?.length) {
      source = getUserReportDetails(data as IUser[])
    }

    if (!source?.length) {
      return (
        <Row gutter={24}>
          <Col>
            <Typography.Text type="secondary">
              Não encontramos detalhes para este item do relatório.
            </Typography.Text>
          </Col>
        </Row>
      )
    }

    return (
      <List
        header={false}
        footer={false}
        dataSource={source}
        renderItem={(item) => <List.Item>{item}</List.Item>}
        bordered
      />
    )
  }

  return (
    <Modal
      visible={isVisible}
      title="Detalhes"
      footer={false}
      onCancel={onCancel}
      okButtonProps={{ danger: true }}
      destroyOnClose>
      <SubtitleContainer>{getSubtitle()}</SubtitleContainer>
      {getGrid()}
    </Modal>
  )
}
