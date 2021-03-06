/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
import { Col, Collapse, Modal, notification, Row, Spin, Typography } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Axios from 'axios'

import {
  AppointmentFilesContainer,
  CollapseInfoContainer,
  LinkButton,
} from './styles'
import { IMyAppointment } from '../../../interfaces/appointment'
import { IAppointmentFile } from '../../../interfaces/appointmentFile'
import { fetchAppointmentFiles } from '../../../services/requests/appointmentFile'
import { getDrawerWidth } from '../../../utils/helpers/formatters'
import { AppointmentDetailsDocument } from '../../../components/UI/AppointmentDetailsDocument'
import { ReadOnly } from '../../../components/UI/ReadOnly'
import { Text } from '../../../components/UI/Text'

interface IMyAppointmentDetailModalProps {
  /** @default false */
  isVisible: boolean
  data?: IMyAppointment
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const LoadingIcon = <LoadingOutlined style={{ fontSize: 15 }} spin />

export const MyAppointmentDetailModal = ({
  isVisible = false,
  data,
  onCancel,
}: IMyAppointmentDetailModalProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [filesError, setFilesError] = useState('')
  const [files, setFiles] = useState<IAppointmentFile[]>([])
  const onlyOne = files.length === 1

  const fetchAppointmentFilesAsync = useCallback(async (id: number) => {
    setIsFetching(true)

    const { data: files, error } = await fetchAppointmentFiles(id)

    if (error) {
      setFilesError('Falha ao encontrar os arquivos.')
      setFiles([])
    }

    if (files) {
      setFilesError('')
      setFiles(files)
    }

    setIsFetching(false)
  }, [])

  const downloadFiles = async () => {
    if (!files?.length) {
      return
    }

    try {
      setIsDownloading(true)

      const links: { el: HTMLAnchorElement; fileName: string }[] = []

      for (const file of files) {
        const response = await Axios.get(file.file_url, {
          responseType: 'arraybuffer',
        })
        const linkEl = document.createElement('a')
        const objectURL = URL.createObjectURL(
          new Blob([response.data], {
            type: response?.headers?.['content-type'],
          })
        )
        const patientFirstName = data?.patient_name?.split(' ')?.[0]
        const fileName = `${patientFirstName}_${file.file_name}`

        linkEl.setAttribute('href', objectURL)
        linkEl.setAttribute('id', fileName)
        linkEl.setAttribute('target', '_blank')
        links.push({ el: linkEl, fileName })
      }

      for (const link of links) {
        link.el.setAttribute('download', link.fileName)
        link.el.click()
      }
    } catch (err) {
      notification.error({
        message:
          'Desculpe, mas ocorreu um erro ao fazer o download! Por favor, tente novamente mais tarde ou entre em contato!',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const getFilesContent = () => {
    if (isFetching || !isMounted) {
      return (
        <AppointmentFilesContainer>
          <Text value="Checando se h?? arquivos..." />{' '}
          <Spin
            indicator={LoadingIcon}
            style={{ marginLeft: 8, marginTop: 4 }}
          />
        </AppointmentFilesContainer>
      )
    }

    if (filesError) {
      const Message = (
        <>
          {filesError}
          <LinkButton
            type="link"
            title="Clique para tentar buscar os arquivos novamente"
            style={{ marginBottom: 5 }}
            onClick={() => {
              if (data?.id) {
                fetchAppointmentFilesAsync(data.id)
              }
            }}>
            &nbsp;Tentar novamente
          </LinkButton>
        </>
      )

      return (
        <AppointmentFilesContainer>
          <Text value={Message} />
        </AppointmentFilesContainer>
      )
    }

    if (files.length) {
      const Message = (
        <>
          {`H?? ${files.length} ${onlyOne ? 'arquivo' : 'arquivos'} ${
            onlyOne ? 'registrado' : 'registrados'
          } para esta consulta.`}
          <LinkButton
            type="link"
            title={`Clique para baixar ${onlyOne ? 'o' : 'os'} ${
              onlyOne ? 'arquivo' : 'arquivos'
            }`}
            style={{ marginBottom: 5 }}
            disabled={isDownloading}
            onClick={downloadFiles}>
            &nbsp;{isDownloading ? 'Baixando' : 'Baixar'}{' '}
            {onlyOne ? 'arquivo' : 'arquivos'}
          </LinkButton>
          {!!isDownloading && (
            <Spin
              indicator={LoadingIcon}
              style={{ marginLeft: -6, marginBottom: 4 }}
            />
          )}
        </>
      )

      return (
        <AppointmentFilesContainer>
          <Text value={Message} />
        </AppointmentFilesContainer>
      )
    }

    return 'Nenhum arquivo'
  }

  useEffect(() => {
    setIsMounted(true)

    if (data?.id && isVisible) {
      fetchAppointmentFilesAsync(data.id)
    }

    return () => {
      setIsMounted(false)
    }
  }, [data, isVisible])

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
            label="Data de Nascimento e Sexo"
            value={`${new Date(
              data.patient?.birthdate
            )?.toLocaleDateString()} - ${
              data.patient?.sex === 'female' ? 'Feminino' : 'Masculino'
            }`}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Email"
            value={data.patient.email || 'N??o informado'}
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
            label="??ltima Atualiza????o"
            value={new Date(data.updated_at).toLocaleString()}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Consulta de Retorno"
            value={data?.is_follow_up ? 'Sim' : 'N??o'}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="Conv??nio"
            value={
              data.is_private
                ? 'Nenhum (consulta particular)'
                : data.insurance_name || 'N??o informado'
            }
            paperMode
          />
        </Col>

        <Col span={12} sm={12} xs={24}>
          <ReadOnly
            label="M??todo de Pagamento"
            value={
              data?.insurance_name && !data?.is_private
                ? 'Pago pelo conv??nio'
                : data?.payment_method?.name || 'N??o informado'
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
            label="Prescri????o de Medicamento(s)"
            value={data.prescription || 'Nenhum'}
            paperMode
          />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24} sm={24} xs={24}>
          <ReadOnly
            label="Anota????es"
            value={data.notes || 'N??o informado'}
            paperMode
          />
        </Col>
      </Row>

      <Row>
        <Col span={24} sm={24} xs={24}>
          <ReadOnly
            label={onlyOne ? 'Arquivo' : 'Arquivos'}
            value={getFilesContent()}
            paperMode
          />
        </Col>
      </Row>

      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel
          header="Gerar arquivo com informa????es da consulta"
          key="0">
          <CollapseInfoContainer>
            <Typography.Text>
              Para poder imprimir os detalhes da consulta, voc?? precisa gerar um
              arquivo <Typography.Text strong>&quot;.pdf&quot;</Typography.Text>
              . Escolha as informa????es de consulta que aparecer??o no arquivo e
              clique no bot??o <Typography.Text strong>Download</Typography.Text>
              . O arquivo ser?? baixado automaticamente e, ent??o, voc?? poder??
              imprimi-lo. Caso o seu download n??o aconte??a ao clicar no bot??o,
              verifique as configura????es do seu navegador referente ao download
              de arquivos. Voc?? tamb??m pode baix??-lo na se????o{' '}
              <Typography.Text strong>Pr??via</Typography.Text> abaixo. Voc??
              poder?? gerar e baixar este arquivo quantas vezes desejar,
              escolhendo as informa????es que nele aparecer??o.
            </Typography.Text>
          </CollapseInfoContainer>

          <AppointmentDetailsDocument appointment={data} />
        </Collapse.Panel>
      </Collapse>
    </Modal>
  )
}
