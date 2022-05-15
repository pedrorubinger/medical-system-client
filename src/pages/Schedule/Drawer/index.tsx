/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Checkbox, Col, Drawer, Row, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button, Form, LinkButton, InfoMessage, CheckboxRow } from './styles'
import { fetchPatients } from '../../../services/requests/patient'
import { IInsurance } from '../../../interfaces/insurance'
import { IPaymentMethod } from '../../../interfaces/paymentMethod'
import { ISpecialty } from '../../../interfaces/specialty'
import { Input } from '../../../components/UI/Input'
import { ReadOnly } from '../../../components/UI/ReadOnly'
import { PatientDrawer } from '../../Patients/Drawer'
import { formatBrCurrency } from '../../../utils/helpers/formatters'

interface ISelectOption {
  value: number
  label: string
}

export interface IAppointmentDrawerData {
  datetime: string
  doctor: ISelectOption
  appointment_follow_up_limit?: number | undefined
  private_appointment_price?: number | undefined
  patient?: ISelectOption | undefined
  insurance?: IInsurance[] | undefined
  payment_method?: IPaymentMethod[] | undefined
  specialty?: ISpecialty[] | undefined
  last_appointment_datetime?: string | undefined
}

interface IAppointmentDrawerProps {
  /** @default undefined */
  isVisible?: boolean | undefined
  data?: IAppointmentDrawerData
  type?: 'create' | 'update'
  onClose: () => void
  // refetchData: () => void
}

interface IIncludePatientDrawerProps {
  /** @default undefined */
  isVisible?: boolean | undefined
}

interface IAppointmentFormValues {
  patient?: ISelectOption
  insurance?: ISelectOption | undefined
  payment_method?: ISelectOption | undefined
  specialty?: ISelectOption | undefined
  is_follow_up: boolean
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
  const [currentStep, setCurrentStep] = useState(1)
  const defaultValues: IAppointmentFormValues = {
    is_follow_up: false,
    patient: undefined,
    insurance: undefined,
    specialty: undefined,
    payment_method: undefined,
  }
  const appointmentSchema = Yup.object().shape({
    doctor: Yup.object().required('Você deve selecionar um médico!'),
    patient:
      currentStep === 1
        ? Yup.object().required('Você deve selecionar um paciente!')
        : Yup.object(),
    insurance: Yup.object(),
    specialty: Yup.object(),
    payment_method: Yup.object(),
  })
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IAppointmentFormValues>({
    resolver: yupResolver(appointmentSchema),
    defaultValues,
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const isEditing = type === 'update'
  const isCreating = type === 'create'
  const watchedPatient = watch('patient', undefined)
  const watchedIsFollowUp = watch('is_follow_up', defaultValues.is_follow_up)
  const watchedInsurance = watch('insurance', defaultValues.insurance)
  const [selectedPatient, setSelectedPatient] = useState<
    ISelectOption | undefined
  >(undefined)
  const [insurances, setInsurances] = useState<ISelectOption[]>([])
  const [specialties, setSpecialties] = useState<ISelectOption[]>([])
  const [paymentMethods, setPaymentMethods] = useState<ISelectOption[]>([])
  const [includePatientDrawer, setIncludePatientDrawer] =
    useState<IIncludePatientDrawerProps | null>(null)

  const closeDrawer = () => {
    setCurrentStep(1)
    reset(defaultValues)
    onClose()
  }

  const onSubmit = async (values: IAppointmentFormValues): Promise<void> => {
    const payload = {
      ...values,
      patient_id: selectedPatient?.value,
    }

    console.log('submitted:', values, payload)
  }

  const getButtonTitle = (): string => {
    if (isSubmitting) {
      return 'Aguarde. Salvando dados...'
    }

    if (isCreating) {
      return 'Clique para agendar esta consulta'
    }

    return 'Clique para atualizar os dados desta consulta'
  }

  const getButtonValue = (): string => {
    if (isSubmitting) {
      return 'Salvando...'
    }

    if (isEditing) {
      return 'Editar Consulta'
    }

    return 'Agendar Consulta'
  }

  const getAppointmentValue = () => {
    if (watchedIsFollowUp) {
      return 'R$ 0,00 - Consulta de Retorno'
    }

    if (watchedInsurance?.value === -1) {
      return data?.private_appointment_price
        ? `${formatBrCurrency(
            data?.private_appointment_price
          )} - Consulta Particular`
        : 'Consulta Particular (valor não cadastrado pelo médico)'
    }

    return 'Pago pelo convênio'
  }

  const onProceed = async (): Promise<void> => {
    await trigger('patient')

    if (!errors.patient) {
      setSelectedPatient(watchedPatient)
      setCurrentStep(2)
    }
  }

  const searchPatientsAsync = async (
    inputValue: string
  ): Promise<ISelectOption[]> => {
    const response = await fetchPatients({ name: inputValue })

    if (response.data) {
      return response.data?.map(({ id, name }) => ({ value: id, label: name }))
    }

    return []
  }

  const loadOptions = async (
    inputValue: string,
    callback: (options: ISelectOption[]) => void
  ) => {
    callback(await searchPatientsAsync(inputValue))
  }

  const AppointmentInfoFields = (
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
    </>
  )

  const DefaultAppointmentTextInfo = (
    <>
      {!!data && (
        <>
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
          .
        </>
      )}
    </>
  )

  const FormContentStepOne = (
    <>
      {!!data && (
        <InfoMessage>
          {DefaultAppointmentTextInfo} Para prosseguir com o agendamento, você
          deve selecionar um paciente. Para isso, digite seu nome no campo
          apropriado abaixo. Caso não o encontre, clique em{' '}
          <Typography.Text strong>Cadastrar Paciente</Typography.Text> para
          realizar seu cadastro.
        </InfoMessage>
      )}
      {AppointmentInfoFields}
      <Row>
        <Col span={24}>
          <Controller
            control={control}
            name="patient"
            render={({ field }) => (
              <Input
                label="Selecionar Paciente"
                placeholder="Digite o nome do paciente"
                error={errors?.patient?.value?.message}
                selectOnChange={(newValue: any) => {
                  setValue('patient', newValue)
                }}
                loadAsyncOptions={loadOptions}
                required
                isSelectAsync
                {...field}
              />
            )}
          />
          <LinkButton
            type="link"
            title="Não encontrou o paciente? Clique para cadastrá-lo e prosseguir com o agendamento"
            onClick={() => setIncludePatientDrawer({ isVisible: true })}>
            Cadastrar Paciente
          </LinkButton>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Button
            type="button"
            title={
              !watchedPatient
                ? 'Selecione um paciente para continuar com o agendamento'
                : 'Clique para continuar com o agendamento da consulta'
            }
            disabled={!watchedPatient}
            onClick={onProceed}>
            Continuar
          </Button>
        </Col>
      </Row>
    </>
  )

  const FormContentStepTwo = (
    <>
      <InfoMessage>{DefaultAppointmentTextInfo}</InfoMessage>

      <LinkButton
        type="link"
        title="Deseja selecionar outro paciente?"
        style={{ marginBottom: 5 }}
        onClick={() => {
          setValue('patient', undefined)
          setCurrentStep(1)
        }}>
        Selecionar outro paciente
      </LinkButton>

      <Row>
        <Col span={24}>
          <ReadOnly
            label="Paciente"
            value={selectedPatient?.label || 'Não identificado'}
            required
          />
        </Col>
      </Row>

      {AppointmentInfoFields}

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

      {!!data?.appointment_follow_up_limit && (
        <Row>
          <Col span={24}>
            <ReadOnly
              label="Limite de Dias (Consulta de Retorno)"
              value={`${data.appointment_follow_up_limit} dias`}
              required
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col span={24}>
          {/* TO DO: Calculate the difference in days between last appointment and current day... */}
          <ReadOnly
            label="Data da Última Consulta"
            value={data?.last_appointment_datetime || 'Nenhuma'}
            required
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ReadOnly
            label="Valor Final (R$)"
            value={getAppointmentValue()}
            required
          />
        </Col>
      </Row>

      <CheckboxRow>
        <Col>
          <Controller
            name="is_follow_up"
            control={control}
            render={({ field }) => (
              <Checkbox
                onChange={field.onChange}
                value={field.value}
                checked={field.value}>
                É consulta de retorno
              </Checkbox>
            )}
          />
        </Col>
      </CheckboxRow>

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
      <Form onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 1 && FormContentStepOne}
        {currentStep === 2 && FormContentStepTwo}
      </Form>
      <PatientDrawer
        type="create"
        isVisible={includePatientDrawer?.isVisible || false}
        onClose={() => setIncludePatientDrawer(null)}
        fetchPatients={() => null}
      />
    </Drawer>
  )
}
