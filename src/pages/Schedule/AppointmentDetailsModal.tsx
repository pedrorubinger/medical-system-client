import { Col, Modal, Row } from 'antd'
import { ReadOnly } from '../../components/UI/ReadOnly'

import { IScheduledAppointment } from '../../interfaces/appointment'
import {
  getAppointmentStatus,
  getDrawerWidth,
} from '../../utils/helpers/formatters'

interface IAppointmentDetailsModalProps {
  /** @default false */
  isVisible: boolean
  date: string
  data?: IScheduledAppointment
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const AppointmentDetailsModal = ({
  isVisible = false,
  data,
  date,
  onCancel,
}: IAppointmentDetailsModalProps) => {
  if (!data || !date) {
    return null
  }

  return (
    <Modal
      footer={null}
      visible={isVisible}
      width={getDrawerWidth()}
      onCancel={onCancel}
      title="Detalhes da Consulta">
      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Status"
            value={getAppointmentStatus(data.status)}
            paperMode
          />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Dia e Horário"
            value={`${date} às ${data.time}`}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly label="Médico(a)" value={data.doctor_name} paperMode />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Especialidade Atendida"
            value={data.specialty_name || 'Não informada'}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Data da Última Consulta"
            value={
              data?.last_appointment_datetime
                ? new Date(data.last_appointment_datetime).toDateString()
                : 'Nenhum registro'
            }
            paperMode
          />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Consulta de Retorno"
            value={data?.is_follow_up ? 'Sim' : 'Não'}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Nome do Paciente"
            value={data.patient_name}
            paperMode
          />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Telefone Principal"
            value={data.patient_phone || 'Não informado'}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Convênio"
            value={
              data.is_private
                ? 'Nenhum (consulta particular)'
                : data.insurance_name || 'Não informado'
            }
            paperMode
          />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Método de Pagamento"
            value={
              data?.insurance_name && !data?.is_private
                ? 'Pago pelo convênio'
                : data.payment_method_name || 'Não informado'
            }
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Agendado em"
            value={new Date(data.created_at).toLocaleString()}
            paperMode
          />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Última Atualização"
            value={new Date(data.updated_at).toLocaleString()}
            paperMode
          />
        </Col>
      </Row>
    </Modal>
  )
}
