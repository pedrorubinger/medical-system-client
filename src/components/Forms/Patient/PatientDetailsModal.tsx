import { Col, Modal, Row } from 'antd'
import Axios from 'axios'

import { ICompletePatient, IPatient } from '../../../interfaces/patient'
import { ReadOnly } from '../../UI/ReadOnly'
import { useEffect, useState } from 'react'
import { getDrawerWidth } from '../../../utils/helpers/formatters'

interface IPatientDetailsModalProps {
  /** @default false */
  isVisible: boolean
  data?: ICompletePatient | IPatient
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const hasCompletePatientData = (
  data: ICompletePatient | IPatient
): data is ICompletePatient => {
  return 'allergies' in data
}

export const PatientDetailsModal = ({
  isVisible = false,
  data,
  onCancel,
}: IPatientDetailsModalProps) => {
  const [location, setLocation] = useState('Buscando localização...')

  useEffect(() => {
    ;(async () => {
      const postalCode = data?.address?.postal_code

      if (postalCode) {
        try {
          const url = `https://viacep.com.br/ws/${postalCode}/json/`
          const response = await Axios.get(url)

          if (response?.data?.erro) {
            throw new Error()
          }

          setLocation(
            `${response.data.localidade}, ${response.data.uf} (${postalCode})`
          )
        } catch (err) {
          setLocation(`Cidade referente ao CEP ${postalCode}`)
        }
      } else {
        setLocation('Não informado')
      }
    })()
  }, [data])

  if (!data) {
    return null
  }

  const updatedAt = new Date(data.updated_at).toLocaleString()

  return (
    <Modal
      footer={null}
      width={getDrawerWidth()}
      visible={isVisible}
      onCancel={onCancel}
      title="Detalhes do Paciente">
      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly label="Nome" value={data.name} paperMode />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="E-mail"
            value={data.email || 'Não informado'}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly label="CPF" value={data.cpf} paperMode />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Data de Nascimento"
            value={new Date(data.birthdate)?.toLocaleDateString()}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Telefone Principal"
            value={data.primary_phone}
            paperMode
          />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Telefone Alternativo"
            value={data?.secondary_phone || 'Não informado'}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly label="Nome da Mãe" value={data.mother_name} paperMode />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Nome do Pai"
            value={data?.father_name || 'Não informado'}
            paperMode
          />
        </Col>
      </Row>

      {!!data?.address && (
        <Row gutter={24}>
          <Col span={12} sm={12} xs={24}>
            <ReadOnly
              label="Endereço"
              value={`${data.address?.street}, nº ${data.address?.number}, ${
                !data.address?.neighborhood?.toLowerCase()?.includes('bairro')
                  ? 'Bairro ' + data.address?.neighborhood
                  : data.address?.neighborhood
              }${
                data.address?.complement ? '. ' + data.address?.complement : ''
              }`}
              paperMode
            />
          </Col>

          <Col span={12} sm={12} xs={24}>
            <ReadOnly
              label="Localização"
              value={location || 'Não informado'}
              paperMode
            />
          </Col>
        </Row>
      )}

      {!!hasCompletePatientData(data) && (
        <>
          <Row gutter={24}>
            <Col span={12} sm={12} xs={24}>
              <ReadOnly
                label="Altura (metros)"
                value={
                  data?.height ? `${data.height || 1.68} m` : 'Não informado'
                }
                paperMode
              />
            </Col>

            <Col span={12} sm={12} xs={24}>
              <ReadOnly
                label="Peso (quilos)"
                value={
                  data?.weight ? `${data.weight || 84.3} kg` : 'Não informado'
                }
                paperMode
              />
            </Col>
          </Row>

          {data?.illnesses || data?.allergies ? (
            <>
              <Row gutter={24}>
                <Col span={24} sm={24} xs={24}>
                  <ReadOnly
                    label="Alergias"
                    value={data?.allergies || 'Não consta'}
                    paperMode
                  />
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={24} sm={24} xs={24}>
                  <ReadOnly
                    label="Doenças"
                    value={data?.illnesses || 'Não consta'}
                    paperMode
                  />
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row gutter={24}>
                <Col span={12} sm={12} xs={24}>
                  <ReadOnly
                    label="Alergias"
                    value={data?.allergies || 'Não consta'}
                    paperMode
                  />
                </Col>

                <Col span={12} sm={12} xs={24}>
                  <ReadOnly
                    label="Doenças"
                    value={data?.illnesses || 'Não consta'}
                    paperMode
                  />
                </Col>
              </Row>
            </>
          )}

          {!!data?.notes && (
            <Row gutter={24}>
              <Col span={24} sm={24} xs={24}>
                <ReadOnly
                  label="Anotações Gerais"
                  value={data?.notes || 'Não consta'}
                  paperMode
                />
              </Col>
            </Row>
          )}
        </>
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
          <ReadOnly label="Última Atualização" value={updatedAt} paperMode />
        </Col>
      </Row>
    </Modal>
  )
}
