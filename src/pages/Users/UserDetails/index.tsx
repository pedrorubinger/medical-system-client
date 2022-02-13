import { Col, Modal, Row } from 'antd'

import { IUser } from '../../../interfaces/user'
import { getTranslatedRole } from '../../../utils/helpers/roles'
import { ReadOnly } from '../../../components/UI/ReadOnly'

interface IUserDetailsModalProps {
  /** @default false */
  isVisible: boolean
  data?: IUser
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

/** TO DO: Implement doctors' specialties and insurances... */
export const UserDetailsModal = ({
  isVisible = false,
  data,
  onCancel,
}: IUserDetailsModalProps) => {
  if (!data) {
    return null
  }

  const isDoctor = data.role === 'doctor'

  return (
    <Modal
      footer={null}
      width={800}
      visible={isVisible}
      onCancel={onCancel}
      title="Detalhes do Usuário">
      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly label="Nome" value={data.name} paperMode />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly label="E-mail" value={data.email} paperMode />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly label="CPF" value={data.cpf} paperMode />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly label="Telefone" value={data.phone} paperMode />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col
          span={isDoctor ? 12 : 24}
          sm={isDoctor ? undefined : 12}
          xs={isDoctor ? undefined : 24}>
          <ReadOnly
            label="Função/Papel"
            value={`${getTranslatedRole(data.role, true)}${
              data.is_admin ? ' / Admin' : ''
            }`}
            paperMode
          />
        </Col>

        {isDoctor && (
          <Col span={12} sm={12} xs={24}>
            <ReadOnly
              label="CRM"
              value={data?.doctor?.crm_document || ''}
              paperMode
            />
          </Col>
        )}
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Data de Registro"
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
