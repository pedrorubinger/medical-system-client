import { Col, Collapse, Modal, Row, Typography } from 'antd'

import { CollapseInfoContainer } from './styles'
import { IMyAppointment } from '../../interfaces/appointment'
import { getDrawerWidth } from '../../utils/helpers/formatters'
import { ReadOnly } from '../../components/UI/ReadOnly'
import { AppointmentDetailsDocument } from '../../components/UI/AppointmentDetailsDocument'

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
            label="E-mail"
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
            value={data.exam_request || 'Não informado'}
            // value={`
            //   TGO (AST) e TGP (ALT)
            //   Colesterol
            //   TSH e T4 livre
            //   Ureia e creatinina
            //   Eletrocardiograma
            //   Exame de Urina
            // `}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24} sm={24} xs={24}>
          <ReadOnly
            label="Anotações"
            // value={data.notes || 'Não informado'}
            value={`
              Lorem ipsum dolor sit amet, consectetur 69mg adipiscing elit. Donec congue elit ac urna blandit rutrum. Ut sit amet ligula et tellus feugiat tempus id a massa. Donec mauris justo, vulputate nec lacus vitae, gravida imperdiet ipsum. Donec ullamcorper metus augue, at pellentesque enim hendrerit id. In eget arcu non nisl varius luctus. Cras commodo dictum tellus et fringilla. Aenean turpis orci, elementum eu tincidunt eget, pellentesque eu sem. Nulla sagittis sed turpis a feugiat. Aliquam quis ipsum porttitor, tincidunt lectus at, fermentum dui. Nullam dictum lobortis nulla. Phasellus pulvinar commodo porta. Maecenas consequat ante erat, sed sollicitudin ex eleifend quis. Donec a mollis nunc, ac feugiat ipsum. Suspendisse potenti. Donec et nisl sit amet leo cursus aliquam. Nam sit amet congue erat. Nullam auctor porta augue, vitae elementum eros tincidunt ac. Vestibulum ornare varius neque nec condimentum. Fusce fringilla accumsan justo nec volutpat. Maecenas dignissim posuere pulvinar. Suspendisse potenti. Suspendisse tristique eget diam non porta. Cras lacus turpis, luctus a tortor sed, pulvinar interdum augue. Vestibulum vel purus mattis, blandit risus at, sagittis urna. Donec risus nulla, sodales sed feugiat vel, gravida et nunc. Duis aliquet eleifend sollicitudin. Nunc scelerisque scelerisque rutrum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam vehicula ultrices mi. Proin facilisis velit dui, sit amet pellentesque tortor aliquam et. Curabitur id tempus tortor. Nunc non metus vitae libero molestie cursus. Integer vitae nunc leo.
            `}
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
              imprimi-lo. Você poderá gerar e baixar este arquivo quantas vezes
              desejar, escolhendo as informações que nele aparecerão.
            </Typography.Text>
          </CollapseInfoContainer>

          <AppointmentDetailsDocument />
        </Collapse.Panel>
      </Collapse>
    </Modal>
  )
}
