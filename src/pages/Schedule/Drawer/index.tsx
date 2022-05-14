/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Col, Drawer, Row, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button, Form, InfoMessage } from './styles'
import { IInsurance } from '../../../interfaces/insurance'
import { IPaymentMethod } from '../../../interfaces/paymentMethod'
import { ISpecialty } from '../../../interfaces/specialty'
import { Input } from '../../../components/UI/Input'
import { ReadOnly } from '../../../components/UI/ReadOnly'

interface ISelectOption {
  value: number
  label: string
}

export interface IAppointmentDrawerData {
  datetime: string
  doctor: ISelectOption
  insurance?: IInsurance[] | undefined
  payment_method?: IPaymentMethod[] | undefined
  specialty?: ISpecialty[] | undefined
}

interface IAppointmentDrawerProps {
  /** @default false */
  isVisible?: boolean
  data?: IAppointmentDrawerData
  type?: 'create' | 'update'
  onClose: () => void
  // refetchData: () => void
}

interface IAppointmentFormValues {
  insurance?: ISelectOption | undefined
  payment_method?: ISelectOption | undefined
  specialty?: ISelectOption | undefined
}

const getFormattedSelectOpts = (
  arr: IInsurance[] | ISpecialty[] | IPaymentMethod[] | undefined
): ISelectOption[] | undefined =>
  arr ? arr.map(({ id, name }) => ({ label: name, value: id })) : undefined

const addNoneOpt = (arr?: ISelectOption[] | undefined, label = 'Nenhum') => {
  if (arr) {
    arr.unshift({ value: -1, label })
  }

  return arr
}

export const AppointmentDrawer = ({
  isVisible = false,
  data,
  type,
  onClose,
}: IAppointmentDrawerProps) => {
  const defaultValues: IAppointmentFormValues = {
    insurance: undefined,
    specialty: undefined,
    payment_method: undefined,
  }
  const appointmentSchema = Yup.object().shape({
    doctor: Yup.object().required('Você deve selecionar um médico!'),
    insurance: Yup.object(),
    specialty: Yup.object(),
    payment_method: Yup.object(),
  })
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IAppointmentFormValues>({
    resolver: yupResolver(appointmentSchema),
    defaultValues,
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const isEditing = type === 'update'
  const isCreating = type === 'create'
  const [insurances, setInsurances] = useState<ISelectOption[]>([])
  const [specialties, setSpecialties] = useState<ISelectOption[]>([])
  const [paymentMethods, setPaymentMethods] = useState<ISelectOption[]>([])

  const closeDrawer = () => {
    reset(defaultValues)
    onClose()
  }

  const onSubmit = async (values: IAppointmentFormValues) => {
    console.log('submitted:', values)
  }

  const getButtonTitle = () => {
    if (isSubmitting) {
      return 'Aguarde. Salvando dados...'
    }

    if (isCreating) {
      return 'Clique para agendar esta consulta'
    }

    return 'Clique para atualizar os dados desta consulta'
  }

  const getButtonValue = () => {
    if (isSubmitting) {
      return 'Salvando...'
    }

    if (isCreating) {
      return 'Agendar Consulta'
    }

    if (isEditing) {
      return 'Editar Consulta'
    }
  }

  const FormContent = (
    <>
      <Row>
        <Col span={24}>
          <ReadOnly
            label="Médico"
            value={data?.doctor.label || 'Não identificado'}
            required
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ReadOnly
            label="Data e Horário"
            value={
              data?.datetime
                ? new Date(data?.datetime).toLocaleString()
                : 'Não identificado'
            }
            required
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Controller
            control={control}
            name="insurance"
            render={({ field }) => (
              <Input
                label="Convênio Médico"
                placeholder="Selecionar Convênios"
                error={errors?.insurance?.value?.message}
                options={insurances}
                selectOnChange={(newValue: any) =>
                  setValue('insurance', newValue)
                }
                isSelect
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Controller
            control={control}
            name="payment_method"
            render={({ field }) => (
              <Input
                label="Método de Pagamento"
                placeholder="Selecionar Método de Pagamento"
                error={errors?.payment_method?.value?.message}
                options={paymentMethods}
                selectOnChange={(newValue: any) =>
                  setValue('payment_method', newValue)
                }
                isSelect
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Controller
            control={control}
            name="specialty"
            render={({ field }) => (
              <Input
                label="Especialidade"
                placeholder="Selecionar Especialidade"
                error={errors?.specialty?.value?.message}
                options={specialties}
                selectOnChange={(newValue: any) =>
                  setValue('specialty', newValue)
                }
                isSelect
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
            disabled={isSubmitting}
            title={getButtonTitle()}>
            {getButtonValue()}
          </Button>
        </Col>
      </Row>
    </>
  )

  useEffect(() => {
    const insurancesArr = addNoneOpt(
      getFormattedSelectOpts(data?.insurance),
      'Nenhum (Consulta Particular)'
    )
    const paymentMethodsArr = addNoneOpt(
      getFormattedSelectOpts(data?.payment_method),
      'Não informado'
    )
    const specialtiesArr = addNoneOpt(
      getFormattedSelectOpts(data?.specialty),
      'Nenhuma'
    )

    setInsurances(insurancesArr || [])
    setPaymentMethods(paymentMethodsArr || [])
    setSpecialties(specialtiesArr || [])
    reset({
      insurance: insurancesArr?.[0],
      specialty: specialtiesArr?.[0],
      payment_method: paymentMethodsArr?.[0],
    })
  }, [data])

  return (
    <Drawer
      visible={isVisible}
      title={isCreating ? 'Agendar Consulta' : 'Editar Consulta'}
      width={450}
      onClose={closeDrawer}
      destroyOnClose>
      {!!data && (
        <InfoMessage>
          Você está agendando uma consulta com{' '}
          <Typography.Text strong>{data?.doctor?.label}</Typography.Text> para o
          dia{' '}
          <Typography.Text strong>
            {new Date(data?.datetime).toLocaleDateString()}
          </Typography.Text>{' '}
          às{' '}
          <Typography.Text strong>
            {new Date(data?.datetime)
              .toLocaleTimeString('pt-BR')
              .substring(0, 5)}
          </Typography.Text>
          . Selecione um paciente fazendo uma busca pelo seu nome no campo
          apropriado no formulário abaixo. Caso o paciente não esteja
          cadastrado, clique no botão{' '}
          <Typography.Text strong>Cadastrar Paciente</Typography.Text> para
          fazer seu cadastro e então agendar sua consulta.
        </InfoMessage>
      )}
      <Form onSubmit={handleSubmit(onSubmit)}>{FormContent}</Form>
    </Drawer>
  )
}
