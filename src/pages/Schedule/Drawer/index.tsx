/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
import { Checkbox, Col, Drawer, notification, Row, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button, Form, LinkButton, InfoMessage, CheckboxRow } from './styles'
import { fetchPatients } from '../../../services/requests/patient'
import {
  findLastAppointment,
  storeAppointment,
} from '../../../services/requests/appointment'
import { IInsurance } from '../../../interfaces/insurance'
import { IPaymentMethod } from '../../../interfaces/paymentMethod'
import { ISpecialty } from '../../../interfaces/specialty'
import { TAppointmentStatus } from '../../../interfaces/appointment'
import {
  formatBrCurrency,
  getDateInText,
  getDrawerWidth,
  getTimeDifference,
} from '../../../utils/helpers/formatters'
import { setFieldErrors } from '../../../utils/helpers/errors'
import { Input } from '../../../components/UI/Input'
import { ReadOnly } from '../../../components/UI/ReadOnly'
import { PatientDrawer } from '../../Patients/Drawer'

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
}

interface IAppointmentDrawerProps {
  /** @default undefined */
  isVisible?: boolean | undefined
  data?: IAppointmentDrawerData
  type?: 'create' | 'update'
  onClose: () => void
  refetchData: () => void
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

const addNoneOpt = (
  arr?: ISelectOption[] | undefined,
  label = 'Não informado'
) => {
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
  refetchData,
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
    setError,
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
  const [isFetchingLastAppointment, setIsFetchingLastAppointment] =
    useState(false)
  const [lastAppointmentDate, setLastAppointmentDate] =
    useState('Nenhum registro')
  const [includePatientDrawer, setIncludePatientDrawer] =
    useState<IIncludePatientDrawerProps | null>(null)

  const closeDrawer = () => {
    setCurrentStep(1)
    reset(defaultValues)
    onClose()
  }

  const findLastAppointmentDateAsync = useCallback(
    async (patientId: number, doctorId: number) => {
      setIsFetchingLastAppointment(true)

      const response = await findLastAppointment(patientId, doctorId)

      if (!response.error) {
        if (response.data && response.data?.datetime) {
          const diffInDays = getTimeDifference('day', response.data.datetime)
          const formattedDate = getDateInText(response.data.datetime)

          const getDiffInDaysLabel = () => {
            if (diffInDays <= 0 || !data?.appointment_follow_up_limit) {
              return ''
            }

            if (diffInDays === 1) {
              return `(ontem)`
            }

            if (diffInDays >= Number(data.appointment_follow_up_limit)) {
              setValue('is_follow_up', false)
              return `(há mais de ${data.appointment_follow_up_limit} dias atrás)`
            } else {
              setValue('is_follow_up', true)
            }

            return `(${diffInDays} dias atrás)`
          }

          setLastAppointmentDate(`${formattedDate} ${getDiffInDaysLabel()}`)
        } else {
          setLastAppointmentDate('Nenhum registro')
        }
      }

      setIsFetchingLastAppointment(false)
    },
    [data]
  )

  const onSubmit = async (values: IAppointmentFormValues): Promise<void> => {
    if (!data?.datetime || !selectedPatient?.value) {
      notification.error({
        message:
          'Ocorreu um erro ao agendar esta consulta. Por favor, recarregue a página, tente novamente mais tarde ou contate-nos.',
      })
      return
    }

    const payload = {
      patient_id: selectedPatient.value,
      datetime: data.datetime,
      is_follow_up: !!values.is_follow_up,
      is_private: !values.insurance?.value || values.insurance?.value === -1,
      doctor_id: data?.doctor.value,
      status: 'pending' as TAppointmentStatus,
      insurance_id:
        !values.insurance?.value || values.insurance?.value === -1
          ? null
          : values.insurance.value,
      specialty_id:
        !values.specialty?.value || values.specialty?.value === -1
          ? null
          : values.specialty.value,
      payment_method_id:
        !values.payment_method?.value || values.payment_method?.value === -1
          ? null
          : values.payment_method.value,
    }

    const response = await storeAppointment(payload)

    if (response.error) {
      setFieldErrors(setError, response.error)
      return
    }

    if (isCreating) {
      notification.success({
        message: 'A consulta foi agendada com sucesso!',
      })
    }

    if (isEditing) {
      notification.success({
        message: 'Os dados da consulta foram atualizados com sucesso!',
      })
    }

    closeDrawer()
    refetchData()
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
      return 'Processando...'
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
                ? `${new Date(
                    data?.datetime
                  ).toLocaleDateString()} às ${new Date(data?.datetime)
                    .toLocaleTimeString('pt-BR')
                    .substring(0, 5)}`
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
            onClick={() => {
              setValue('patient', defaultValues.patient)
              setSelectedPatient(undefined)
              setIncludePatientDrawer({ isVisible: true })
            }}>
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
      <InfoMessage>
        {DefaultAppointmentTextInfo} Confira se os dados da consulta estão
        corretos e preencha os campos restantes para finalizar este agendamento.
      </InfoMessage>

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

      {!!watchedIsFollowUp ||
        !watchedInsurance?.value ||
        (!!watchedInsurance?.value && watchedInsurance?.value === -1 && (
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
        ))}

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
            value={
              isFetchingLastAppointment ? 'Verificando...' : lastAppointmentDate
            }
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
    if (isVisible && watchedPatient?.value && data?.doctor?.value) {
      findLastAppointmentDateAsync(watchedPatient.value, data.doctor.value)
    }
  }, [watchedPatient, data])

  useEffect(() => {
    const insurancesArr = addNoneOpt(
      getFormattedSelectOpts(data?.insurance),
      'Nenhum (Consulta Particular)'
    )
    const paymentMethodsArr = addNoneOpt(
      getFormattedSelectOpts(data?.payment_method)
    )
    const specialtiesArr = addNoneOpt(getFormattedSelectOpts(data?.specialty))

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
      width={getDrawerWidth(450)}
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
