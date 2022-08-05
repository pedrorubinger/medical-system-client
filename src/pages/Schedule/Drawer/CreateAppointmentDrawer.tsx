/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Col, Drawer, notification, Row, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button, Form, LinkButton, InfoMessage } from './styles'
import { fetchPatients } from '../../../services/requests/patient'
import { storeAppointment } from '../../../services/requests/appointment'
import { IInsurance } from '../../../interfaces/insurance'
import { IPaymentMethod } from '../../../interfaces/paymentMethod'
import { ISpecialty } from '../../../interfaces/specialty'
import { TAppointmentStatus } from '../../../interfaces/appointment'
import { getDrawerWidth } from '../../../utils/helpers/formatters'
import { setFieldErrors } from '../../../utils/helpers/errors'
import { Input } from '../../../components/UI/Input'
import { PatientDrawer } from '../../Patients/Drawer'
import {
  findLastAppointmentDateAsync,
  getAppointmentInfoFields,
  getDefaultAppointmentTextInfo,
  getFormattedRelatedData,
} from './utils'
import { AppointmentMainForm } from './AppointmentMainForm'

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
  onClose: () => void
  refetchData: () => void
}

interface IIncludePatientDrawerProps {
  /** @default undefined */
  isVisible?: boolean | undefined
}

export interface ICreateAppointmentFormValues {
  patient?: ISelectOption
  insurance?: ISelectOption | undefined
  payment_method?: ISelectOption | undefined
  specialty?: ISelectOption | undefined
  is_follow_up: boolean
}

export const AppointmentDrawer = ({
  isVisible = false,
  data,
  onClose,
  refetchData,
}: IAppointmentDrawerProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const defaultValues: ICreateAppointmentFormValues = {
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
  } = useForm<ICreateAppointmentFormValues>({
    resolver: yupResolver(appointmentSchema),
    defaultValues,
    shouldUnregister: true,
    mode: 'onBlur',
  })
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

  const onSubmit = async (
    values: ICreateAppointmentFormValues
  ): Promise<void> => {
    if (!data?.datetime || !selectedPatient?.value) {
      notification.error({
        message:
          'Ocorreu um erro ao agendar esta consulta. Por favor, recarregue a página, tente novamente mais tarde ou contate-nos.',
      })
      return
    }

    const datetime = new Date(data.datetime)?.toISOString()
    const hours = datetime?.split('T')[0]
    const minutes = datetime?.split('T')[1]?.split(':00.000Z')[0]
    const payload = {
      patient_id: selectedPatient.value,
      datetime: `${hours} ${minutes}`,
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

    notification.success({
      message: 'A consulta foi agendada com sucesso!',
    })

    closeDrawer()
    refetchData()
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
      return response.data?.map(({ id, name, cpf }) => ({
        value: id,
        label: `${name} - ${cpf}`,
      }))
    }

    return []
  }

  const loadOptions = async (
    inputValue: string,
    callback: (options: ISelectOption[]) => void
  ) => {
    callback(await searchPatientsAsync(inputValue))
  }

  const FormContentStepOne = (
    <>
      {!!data && (
        <InfoMessage>
          {getDefaultAppointmentTextInfo(data, 'create')} Para prosseguir com o
          agendamento, você deve selecionar um paciente. Para isso, digite seu
          nome no campo apropriado abaixo. Caso não o encontre, clique em{' '}
          <Typography.Text strong>Cadastrar Paciente</Typography.Text> para
          realizar seu cadastro.
        </InfoMessage>
      )}
      {getAppointmentInfoFields(data)}
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
        {getDefaultAppointmentTextInfo(data, 'create')} Confira se os dados da
        consulta estão corretos e preencha os campos restantes para finalizar
        este agendamento.
      </InfoMessage>

      <AppointmentMainForm
        type="create"
        data={data}
        AppointmentInfoFields={getAppointmentInfoFields(data)}
        control={control}
        errors={errors}
        insurances={insurances}
        isFetchingLastAppointment={isFetchingLastAppointment}
        isSubmitting={isSubmitting}
        lastAppointmentDate={lastAppointmentDate}
        paymentMethods={paymentMethods}
        selectedPatient={selectedPatient}
        specialties={specialties}
        watchedInsurance={watchedInsurance}
        watchedIsFollowUp={watchedIsFollowUp}
        setCurrentStep={setCurrentStep}
        setValue={setValue}
      />
    </>
  )

  useEffect(() => {
    if (isVisible && watchedPatient?.value && data?.doctor?.value) {
      ;(async () => {
        setIsFetchingLastAppointment(true)

        const response = await findLastAppointmentDateAsync(
          watchedPatient.value,
          data.doctor.value,
          data?.appointment_follow_up_limit
        )

        setValue('is_follow_up', response.is_follow_up)
        setLastAppointmentDate(response.last_appointment_date)
        setIsFetchingLastAppointment(false)
      })()
    }
  }, [watchedPatient, data])

  useEffect(() => {
    const response = getFormattedRelatedData(data)

    setInsurances(response.insurancesArr || [])
    setPaymentMethods(response.paymentMethodsArr || [])
    setSpecialties(response.specialtiesArr || [])
    reset({
      insurance: response.insurancesArr?.[0],
      specialty: response.specialtiesArr?.[0],
      payment_method: response.paymentMethodsArr?.[0],
    })
  }, [data])

  return (
    <Drawer
      visible={isVisible}
      title="Agendar Consulta"
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
