import { useCallback, useEffect, useState } from 'react'
import { Drawer, notification } from 'antd'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { getDrawerWidth } from '../../../utils/helpers/formatters'
import { IAppointmentDrawerData } from './CreateAppointmentDrawer'
import {
  findLastAppointmentDateAsync,
  getAppointmentInfoFields,
  getDefaultAppointmentTextInfo,
  getFormattedRelatedData,
} from './utils'
import { Form, InfoMessage } from './styles'
import { AppointmentMainForm } from './AppointmentMainForm'
import { setFieldErrors } from '../../../utils/helpers/errors'
import { updateAppointment } from '../../../services/requests/appointment'

interface ISelectOption {
  value: number
  label: string
}

export interface IEditAppointmentFormValues {
  insurance?: ISelectOption | undefined
  payment_method?: ISelectOption | undefined
  specialty?: ISelectOption | undefined
  is_follow_up: boolean
}

interface IEditAppointmentDrawerProps {
  /** @default false */
  isVisible?: boolean | undefined
  appointmentId?: number | undefined
  data?: IAppointmentDrawerData
  appointmentInitialData?: IEditAppointmentFormValues
  onClose: () => void
  refetchData: () => void
}

const defaultValues: IEditAppointmentFormValues = {
  is_follow_up: false,
  insurance: undefined,
  specialty: undefined,
  payment_method: undefined,
}

export const EditAppointmentDrawer = ({
  isVisible,
  appointmentId,
  data,
  appointmentInitialData,
  onClose,
  refetchData,
}: IEditAppointmentDrawerProps) => {
  const appointmentSchema = Yup.object().shape({
    insurance: Yup.object(),
    specialty: Yup.object(),
    payment_method: Yup.object(),
  })
  const [insurances, setInsurances] = useState<ISelectOption[]>([])
  const [specialties, setSpecialties] = useState<ISelectOption[]>([])
  const [paymentMethods, setPaymentMethods] = useState<ISelectOption[]>([])
  const [isFetchingLastAppointment, setIsFetchingLastAppointment] =
    useState(false)
  const [lastAppointmentDate, setLastAppointmentDate] =
    useState('Nenhum registro')
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IEditAppointmentFormValues>({
    resolver: yupResolver(appointmentSchema),
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const watchedIsFollowUp = watch(
    'is_follow_up',
    !!appointmentInitialData?.is_follow_up
  )
  const watchedInsurance = watch('insurance', defaultValues.insurance)

  const closeDrawer = () => {
    reset(defaultValues)
    onClose()
  }

  const resetData = useCallback((item: ISelectOption | undefined) => {
    if (!item) {
      return null
    }

    return { label: item.label, value: item.value }
  }, [])

  const onSubmit = async (values: IEditAppointmentFormValues) => {
    if (!appointmentId) {
      notification.error({
        message:
          'Ocorreu um erro ao atualizar esta consulta. Por favor, recarregue a página, tente novamente mais tarde ou contate-nos.',
      })
      return
    }

    const payload = {
      doctor_id: data?.doctor?.value,
      is_follow_up: !!values.is_follow_up,
      is_private: !values.insurance?.value || values.insurance?.value === -1,
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
    const response = await updateAppointment(appointmentId, payload)

    if (response.error) {
      setFieldErrors(setError, response.error)
      return
    }

    notification.success({
      message: 'Os dados da consulta foram atualizados com sucesso!',
    })

    closeDrawer()
    refetchData()
  }

  useEffect(() => {
    if (isVisible && data?.patient?.value && data?.doctor?.value) {
      ;(async () => {
        setIsFetchingLastAppointment(true)

        const response = await findLastAppointmentDateAsync(
          data?.patient?.value || -1,
          data.doctor.value
        )

        if (response.is_follow_up) {
          setValue('is_follow_up', response.is_follow_up)
        }

        setLastAppointmentDate(response.last_appointment_date)
        setIsFetchingLastAppointment(false)
      })()
    }
  }, [data?.patient, data])

  useEffect(() => {
    const response = getFormattedRelatedData(data)

    setInsurances(response.insurancesArr || [])
    setPaymentMethods(response.paymentMethodsArr || [])
    setSpecialties(response.specialtiesArr || [])

    reset({
      insurance:
        resetData(appointmentInitialData?.insurance) ||
        response.insurancesArr?.[0],
      specialty:
        resetData(appointmentInitialData?.specialty) ||
        response.specialtiesArr?.[0],
      payment_method:
        resetData(appointmentInitialData?.payment_method) ||
        response.paymentMethodsArr?.[0],
    })
  }, [data])

  if (!data) {
    return null
  }

  return (
    <Drawer
      visible={isVisible}
      title="Editar Consulta"
      width={getDrawerWidth(450)}
      onClose={closeDrawer}
      destroyOnClose>
      <InfoMessage>
        {getDefaultAppointmentTextInfo(data, 'update')} Confira se os dados da
        consulta estão corretos e preencha os campos restantes para atualizar os
        dados deste agendamento.
      </InfoMessage>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <AppointmentMainForm
          type="update"
          data={data}
          defaultValues={appointmentInitialData}
          AppointmentInfoFields={getAppointmentInfoFields(data)}
          control={control}
          errors={errors}
          insurances={insurances}
          isFetchingLastAppointment={isFetchingLastAppointment}
          isSubmitting={isSubmitting}
          lastAppointmentDate={lastAppointmentDate}
          paymentMethods={paymentMethods}
          selectedPatient={{
            value: data.patient?.value || 0,
            label: data.patient?.label || '',
          }}
          specialties={specialties}
          watchedInsurance={watchedInsurance}
          watchedIsFollowUp={watchedIsFollowUp}
          setValue={setValue}
        />
      </Form>
    </Drawer>
  )
}
