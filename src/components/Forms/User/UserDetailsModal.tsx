import { Col, Modal, Row } from 'antd'

import { getTranslatedRole } from '../../../utils/helpers/roles'
import { IUser } from '../../../interfaces/user'
import { ReadOnly } from '../../UI/ReadOnly'
import { IDoctorInsurance } from '../../../interfaces/doctor'
import { ISpecialty } from '../../../interfaces/specialty'

interface IUserDetailsModalProps {
  /** @default false */
  isVisible: boolean
  data?: IUser
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const UserDetailsModal = ({
  isVisible = false,
  data,
  onCancel,
}: IUserDetailsModalProps) => {
  if (!data) {
    return null
  }

  const isDoctor = data.role === 'doctor'

  /**
   * Get a list of medical specialties or insurances properly formatted (string).
   * @param array Array of doctor insurances or doctor specialties.
   * @returns a string with listed insurances or specialties.
   */
  const getInsurancesOrSpecs = (
    type: 'specialty' | 'insurance',
    array?: IDoctorInsurance[] | ISpecialty[] | undefined
  ): string => {
    if (!array?.length) {
      return type === 'specialty' ? 'Nenhuma especialidade' : 'Nenhum convênio'
    }

    const itemsName = array.map((item) => item.name)
    const lastIndex = itemsName.length - 1
    return `${itemsName.slice(0, lastIndex).join(', ')} e ${
      itemsName[lastIndex]
    }`
  }

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

      {isDoctor && (
        <Row gutter={24}>
          <Col span={12} sm={12} xs={24}>
            <ReadOnly
              label="Convênios"
              value={getInsurancesOrSpecs('insurance', data?.doctor?.insurance)}
              paperMode
            />
          </Col>

          <Col span={12} sm={12} xs={24}>
            <ReadOnly
              label="Especialidades"
              value={getInsurancesOrSpecs('specialty', data?.doctor?.specialty)}
              paperMode
            />
          </Col>
        </Row>
      )}

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Data de Cadastro"
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
