/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
import { Col, Divider, Drawer, notification, Row, Spin, Typography } from 'antd'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { LoadingOutlined } from '@ant-design/icons'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button, Form, InfoMessage, UploadFileLabelBox } from './styles'
import { IMyAppointment } from '../../../../interfaces/appointment'
import { updateAppointment } from '../../../../services/requests/appointment'
import { setFieldErrors } from '../../../../utils/helpers/errors'
import { getDrawerWidth } from '../../../../utils/helpers/formatters'
import {
  ALLOWED_FILE_EXTS,
  FILE_MAX_SIZE,
} from '../../../../utils/constants/files'
import { Input } from '../../../../components/UI/Input'
import { UploadComponent } from '../../../../components/UI/UploadComponent'
import { Label } from '../../../../components/UI/Label'
import { InfoTooltip } from '../../../../components/UI/InfoTooltip'
import { ErrorMessage } from '../../../../components/UI/ErrorMessage'
import { fetchAppointmentFiles } from '../../../../services/requests/appointmentFile'
import { DeleteAppointmentFileModal } from './DeleteAppointmentFileModal'

const LoadingIcon = (
  <LoadingOutlined style={{ marginLeft: 6, fontSize: 14 }} spin />
)

interface IEditAppointmentDrawerProps {
  isVisible: boolean
  data?: IMyAppointment | undefined
  onClose: () => void
  fetchMyAppointments: () => void
  setPatientDetailsModal: () => void
}

interface IDeleteAppointmentFileModalProps {
  isVisible: boolean
  data: {
    name: string
    id: number
  }
  removeFileFromList: () => void
}

interface IEditAppointmentValues {
  notes?: string
  exam_request?: string
  prescription?: string
}

const editAppointmentSchema = Yup.object().shape({
  notes: Yup.string(),
  exam_request: Yup.string(),
  prescription: Yup.string(),
})

export const EditAppointmentDrawer = ({
  data,
  isVisible,
  onClose,
  fetchMyAppointments,
  setPatientDetailsModal,
}: IEditAppointmentDrawerProps) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IEditAppointmentValues>({
    resolver: yupResolver(editAppointmentSchema),
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const [isFetchingFiles, setIsFetchingFiles] = useState(false)
  const [fileError, setFileError] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [deleteFileModal, setDeleteFileModal] =
    useState<IDeleteAppointmentFileModalProps | null>(null)
  const formattedDate = data?.datetime
    ? `${new Date(data?.datetime)?.toLocaleDateString()?.split(' ')?.[0]}`
    : ''
  const watchedFields = watch()
  const allFieldsAreEmpty =
    !Object.values(watchedFields)?.filter(Boolean)?.length

  const closeDrawer = () => {
    reset()
    onClose()
  }

  const onSubmit = async (values: IEditAppointmentValues): Promise<void> => {
    if (!data?.id) {
      return notification.error({
        message:
          'Desculpe, ocorreu um erro ao preencher os dados desta consulta. Por favor, tente novamente mais tarde!',
      })
    }

    const files = fileList?.filter(
      (file) => !file?.status || !['done', 'removed'].includes(file?.status)
    )
    const formData = new FormData()

    if (files?.length) {
      formData.append('notes', values?.notes || '')
      formData.append('exam_request', values?.exam_request || '')
      formData.append('prescription', values?.prescription || '')

      files?.forEach((file, i) => {
        if (file.originFileObj) {
          formData.append(`files[${i}]`, file?.originFileObj)
        }
      })
    }

    const response = await updateAppointment(
      data.id,
      files?.length ? formData : values
    )

    if (response.error) {
      setFieldErrors(setError, response.error)
      return
    }

    notification.success({
      message: 'Os dados da consulta foram preenchidos com sucesso!',
    })
    closeDrawer()
    fetchMyAppointments()
  }

  const getButtonTitle = () => {
    if (allFieldsAreEmpty) {
      return 'Preencha algum dos campos do formulário para salvar os dados'
    }

    if (isSubmitting) {
      return 'Aguarde. Salvando dados da consulta...'
    }

    return 'Clique para atualizar os dados desta consulta'
  }

  const getButtonValue = () => {
    if (isSubmitting) {
      return 'Salvando...'
    }

    return 'Salvar Dados'
  }

  const onChangeUpload = (info: UploadChangeParam<any>) => {
    if (info.file.status === 'removed') {
      return
    }

    const fileSize = Number(info.file.size)
    const totalSizeMB = fileSize / Math.pow(1024, 2)

    if (totalSizeMB > FILE_MAX_SIZE) {
      setFileError(
        `O tamanho do arquivo não pode ultrapassar ${FILE_MAX_SIZE} mb!`
      )
      setTimeout(() => {
        setFileError('')
      }, 3000)
      return
    }

    setFileList(info.fileList)
  }

  const onRemoveFile = (info: UploadFile<any>) => {
    setDeleteFileModal({
      isVisible: true,
      data: {
        id: Number(info.uid),
        name: info.name,
      },
      removeFileFromList: () => {
        setFileError('')
        setFileList(
          [...fileList].filter(
            (file) => file.uid.toString() !== info.uid.toString()
          )
        )
      },
    })
  }

  const fetchAppointmentFilesAsync = useCallback(async (id: number) => {
    setIsFetchingFiles(true)

    const { data: files, error } = await fetchAppointmentFiles(id)

    if (error) {
      notification.error({
        message:
          'Desculpe, mas ocorreu uma falha ao trazer os arquivos. Por favor, tente novamente mais tarde!',
      })
      setFileList([])
    }

    if (files) {
      setFileList(
        [...files].map((file, i) => ({
          uid: file.id.toString(),
          name: `Arquivo de consulta ${i + 1}`,
          status: 'done',
          url: file.file_url,
        }))
      )
    }

    setIsFetchingFiles(false)
  }, [])

  useEffect(() => {
    reset({
      notes: data?.notes || '',
      exam_request: data?.exam_request || '',
      prescription: data?.prescription || '',
    })

    if (isVisible && data?.id) {
      fetchAppointmentFilesAsync(data.id)
    }
  }, [data, isVisible])

  if (!data) {
    return null
  }

  return (
    <Drawer
      visible={isVisible}
      title="Preencher Informações da Consulta"
      width={getDrawerWidth(650)}
      onClose={closeDrawer}>
      <DeleteAppointmentFileModal
        isVisible={deleteFileModal?.isVisible || false}
        data={deleteFileModal?.data}
        removeFileFromList={deleteFileModal?.removeFileFromList}
        onCancel={() => setDeleteFileModal(null)}
      />
      <InfoMessage>
        Você está preenchendo informações da consulta do dia{' '}
        <Typography.Text strong>{formattedDate}</Typography.Text> para o
        paciente <Typography.Text strong>{data?.patient_name}</Typography.Text>.
        Você pode clicar{' '}
        <Typography.Link onClick={() => setPatientDetailsModal()}>
          aqui
        </Typography.Link>{' '}
        para ver as informações detalhadas deste paciente.
      </InfoMessage>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col span={24}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input
                  type="textarea"
                  label="Anotações Gerais"
                  placeholder="Digite aqui suas anotações..."
                  textAreaCols={8}
                  textAreaRows={8}
                  error={errors?.notes?.message}
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Controller
              name="exam_request"
              control={control}
              render={({ field }) => (
                <Input
                  type="textarea"
                  label="Pedido de Exame(s)"
                  placeholder="Digite aqui seu pedido de exames..."
                  textAreaCols={8}
                  textAreaRows={8}
                  error={errors?.exam_request?.message}
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Controller
              name="prescription"
              control={control}
              render={({ field }) => (
                <Input
                  type="textarea"
                  label="Prescrição de Medicamento(s)"
                  placeholder="Digite aqui suas prescrição de medicamentos..."
                  textAreaCols={8}
                  textAreaRows={8}
                  error={errors?.prescription?.message}
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <UploadFileLabelBox>
              <Label>Arquivos da Consulta/Paciente</Label>
              <InfoTooltip
                iconSize={16}
                text={`Insira até 10 arquivos de até ${FILE_MAX_SIZE}mb cada. Os formatos permitidos são: ${ALLOWED_FILE_EXTS.map(
                  (ext) => `.${ext}`
                ).join(', ')}`}
              />
            </UploadFileLabelBox>
            <UploadComponent
              fileList={fileList}
              text={
                isFetchingFiles ? 'Buscando arquivos...' : 'Upload de Arquivos'
              }
              buttonProps={{
                type: 'button',
                color: 'white',
                disabled: isFetchingFiles,
                icon: isFetchingFiles ? (
                  <Spin indicator={LoadingIcon} style={{ marginTop: -6 }} />
                ) : undefined,
              }}
              uploadProps={{
                multiple: true,
                maxCount: 10,
                accept: ALLOWED_FILE_EXTS.map((ext) => `.${ext}`).join(),
                beforeUpload: () => false,
                onChange: onChangeUpload,
                onRemove: onRemoveFile,
              }}
            />
            {!!fileError && <ErrorMessage msg={fileError} />}
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col span={24}>
            <Button
              type="submit"
              disabled={isSubmitting || allFieldsAreEmpty}
              title={getButtonTitle()}>
              {getButtonValue()}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}
