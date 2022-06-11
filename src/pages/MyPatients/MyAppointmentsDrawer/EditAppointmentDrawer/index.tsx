import { useEffect } from 'react'
import { Col, Drawer, notification, Row, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { IMyAppointment } from '../../../../interfaces/appointment'
import { setFieldErrors } from '../../../../utils/helpers/errors'
import { getDrawerWidth } from '../../../../utils/helpers/formatters'
import { Button, Form, InfoMessage } from './styles'
import { Input } from '../../../../components/UI/Input'
import { updateAppointment } from '../../../../services/requests/appointment'

interface IEditAppointmentDrawerProps {
  isVisible: boolean
  data?: IMyAppointment | undefined
  onClose: () => void
  fetchMyAppointments: () => void
  setPatientDetailsModal: () => void
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

    const response = await updateAppointment(data.id, values)

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

  useEffect(() => {
    reset({
      notes: data?.notes || '',
      exam_request: data?.exam_request || '',
      prescription: data?.prescription || '',
    })
  }, [data])

  if (!data) {
    return null
  }

  return (
    <Drawer
      visible={isVisible}
      title="Preencher Informações da Consulta"
      width={getDrawerWidth(650)}
      onClose={closeDrawer}>
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
