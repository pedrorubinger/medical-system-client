import { Col, Collapse, Modal, Row, Typography } from 'antd'

import { CollapseInfoContainer } from './styles'
import { IMyAppointment } from '../../../interfaces/appointment'
import { getDrawerWidth } from '../../../utils/helpers/formatters'
import { ReadOnly } from '../../../components/UI/ReadOnly'
import { AppointmentDetailsDocument } from '../../../components/UI/AppointmentDetailsDocument'

interface IMyAppointmentDetailModalProps {
  /** @default false */
  isVisible: boolean
  data?: IMyAppointment
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const MyAppointmentDetailModal = ({
  isVisible = false,
  data,
  onCancel,
}: IMyAppointmentDetailModalProps) => {
  if (!data) {
    return null
  }

  return (
    <Modal
      footer={null}
      visible={isVisible}
      width={getDrawerWidth(!data?.exam_request || !data?.notes ? 900 : 800)}
      onCancel={onCancel}
      title="Detalhes da Consulta"
      destroyOnClose>
      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly label="Nome" value={data.patient.name} paperMode />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Data de Nascimento"
            value={new Date(data.patient.birthdate).toLocaleDateString()}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Email"
            value={data.patient.email || 'Não informado'}
            paperMode
          />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Telefone"
            value={data.patient.primary_phone}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Data da Consulta"
            value={new Date(data.datetime).toLocaleString()}
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

      <Row gutter={24}>
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
                : data?.payment_method?.name || 'Não informado'
            }
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24} sm={24} xs={24}>
          <ReadOnly
            label="Pedido de Exame(s)"
            value={data.exam_request || 'Nenhum'}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24} sm={24} xs={24}>
          <ReadOnly
            label="Prescrição de Medicamento(s)"
            value={data.prescription || 'Nenhum'}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24} sm={24} xs={24}>
          <ReadOnly
            label="Anotações"
            value={data.notes || 'Não informado'}
            paperMode
          />
        </Col>
      </Row>

      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header="Gerar Arquivo" key="0">
          <CollapseInfoContainer>
            <Typography.Text>
              Para poder imprimir os detalhes da consulta, você precisa gerar um
              arquivo <Typography.Text strong>&quot;.pdf&quot;</Typography.Text>
              . Escolha as informações de consulta que aparecerão no arquivo e
              clique no botão <Typography.Text strong>Download</Typography.Text>
              . O arquivo será baixado automaticamente e, então, você poderá
              imprimi-lo. Caso o seu download não aconteça ao clicar no botão,
              verifique as configurações do seu navegador referente ao download
              de arquivos. Você também pode baixá-lo na seção{' '}
              <Typography.Text strong>Prévia</Typography.Text> abaixo. Você
              poderá gerar e baixar este arquivo quantas vezes desejar,
              escolhendo as informações que nele aparecerão.
            </Typography.Text>
          </CollapseInfoContainer>

          <AppointmentDetailsDocument appointment={data} />
        </Collapse.Panel>
      </Collapse>
    </Modal>
  )
}
