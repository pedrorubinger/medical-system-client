/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
import { Col, Row, Table, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'

import { Form, InfoMessage, RefreshButton } from './styles'
import { RootState } from '../../store'
import {
  fetchAppointments,
  IFetchAppointmentsParams,
} from '../../services/requests/appointment'
import { fetchUsersDoctors, IUserDoctor } from '../../services/requests/user'
import {
  getDisabledStatusTitle,
  getFormattedDoctorSchedule,
  getTimeDifference,
  getUTCDate,
} from '../../utils/helpers/formatters'
import { dateIsInRange } from '../../utils/helpers/validators'
import { TAppointmentStatus } from '../../interfaces/appointment'
import { IInsurance } from '../../interfaces/insurance'
import { IPaymentMethod } from '../../interfaces/paymentMethod'
import { ISpecialty } from '../../interfaces/specialty'
import { IScheduleDaysOff } from '../../interfaces/scheduleDaysOff'
import { IParsedDaysScheduleSettings } from '../../interfaces/scheduleSettings'
import { PageContent } from '../../components/UI/PageContent'
import { TableActions } from '../../components/UI/TableActions'
import { TableHeader } from '../../components/UI/TableHeader'
import { Input } from '../../components/UI/Input'
import {
  AppointmentDrawer,
  IAppointmentDrawerData,
} from './Drawer/CreateAppointmentDrawer'
import { AppointmentDetailsModal } from './AppointmentDetailsModal'
import { DeleteAppointmentModal } from './DeleteAppointmentModal'
import { ConfirmAppointmentModal } from './ConfirmAppointmentModal'
import { getAppointmentColor } from '../../utils/helpers/elements'
import {
  EditAppointmentDrawer,
  IEditAppointmentFormValues,
} from './Drawer/EditAppointmentDrawer'

interface IScheduleDoctorOption {
  insurances?: IInsurance[] | undefined
  appointment_follow_up_limit?: number | undefined
  private_appointment_price?: number | undefined
  payment_methods?: IPaymentMethod[] | undefined
  specialties?: ISpecialty[]
  scheduleSettings: IParsedDaysScheduleSettings
  schedule_days_off: IScheduleDaysOff[] | null
  value: number
  label: string
}

interface IRecord {
  time: string
  patient_id?: number | undefined
  id?: number | undefined
  appointment_id?: number | undefined
  patient_name?: string | undefined
  insurance_id?: number | undefined | null
  insurance_name?: string | undefined
  specialty_id?: number | undefined | null
  specialty_name?: string | undefined
  payment_method_id?: number | undefined | null
  payment_method_name?: string | undefined
  is_private?: boolean | undefined
  is_follow_up?: boolean | undefined
  status?: TAppointmentStatus
}

interface ISelectScheduleDataValues {
  date: string
  doctor: IScheduleDoctorOption
}

interface IAppointmentDrawerProps {
  isVisible?: boolean | undefined
  data?: IAppointmentDrawerData
}

interface IAppointmentDetailsModalProps {
  isVisible: boolean
  data: any
}

interface IDeleteAppointmentModalProps {
  isVisible: boolean
  id: number
  datetime: string
  patientName: string
}

interface IGetActionStatusResponse {
  disabledTitle: string
  disabled: boolean
}

type IConfirmAppointmentModalProps = IDeleteAppointmentModalProps

const scheduleSchema = Yup.object().shape({
  date: Yup.string().required('Por favor, insira a data para ver a agenda!'),
})

const getFormattedDoctorsList = (doctors: IUserDoctor[]) =>
  doctors.map((userDoctor) => ({
    payment_methods: userDoctor.doctor?.payment_method,
    insurances: userDoctor.doctor?.insurance,
    specialties: userDoctor.doctor?.specialty,
    label: userDoctor.name,
    value: userDoctor.doctor.id,
    appointment_follow_up_limit: userDoctor.doctor.appointment_follow_up_limit,
    private_appointment_price: userDoctor.doctor.private_appointment_price,
    scheduleSettings: getFormattedDoctorSchedule(
      userDoctor.doctor.schedule_settings
    ),
    schedule_days_off: userDoctor.doctor.schedule_days_off,
  }))

export const Schedule = (): JSX.Element => {
  const defaultValues = {
    date: new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-'),
    doctor: undefined,
  }
  const user = useSelector((state: RootState) => state.AuthReducer)
  const isDoctor = !!user?.data?.doctor
  const isManager = user?.data?.role === 'manager'
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ISelectScheduleDataValues>({
    defaultValues,
    mode: 'onBlur',
    shouldUnregister: true,
    resolver: yupResolver(scheduleSchema),
  })
  const watchedDoctor = watch('doctor')
  const watchedDate = watch('date')
  const timeDiffInDays = watchedDate
    ? getTimeDifference('day', watchedDate)
    : -1
  const [doctorsList, setDoctorsList] = useState<IScheduleDoctorOption[]>([])
  const [records, setRecords] = useState<any>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [appointmentDrawer, setAppointmentDrawer] =
    useState<IAppointmentDrawerProps | null>(null)
  const [editAppointmentDrawer, setEditAppointmentDrawer] = useState<
    | (IAppointmentDrawerProps & {
        appointmentId?: number
        initialData: IEditAppointmentFormValues
      })
    | null
  >(null)
  const [appointmentDetailsModal, setAppointmentDetailsModal] =
    useState<IAppointmentDetailsModalProps | null>(null)
  const [deleteAppointmentModal, setDeleteAppointmentModal] =
    useState<IDeleteAppointmentModalProps | null>(null)
  const [confirmAppointmentModal, setConfirmAppointmentModal] =
    useState<IConfirmAppointmentModalProps | null>(null)

  const columns = [
    {
      title: 'Horário',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Paciente',
      dataIndex: 'patient_name',
      key: 'patient_name',
      render: (patient_name: string | undefined) => patient_name || 'Nenhum',
    },
    {
      title: 'Convênio',
      dataIndex: 'insurance_name',
      key: 'insurance_name',
      render: (insurance_name: string | undefined, record: IRecord) =>
        record.is_private ? 'Particular' : insurance_name || 'Nenhum',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: TAppointmentStatus) => getAppointmentColor(status),
    },
    {
      title: 'Ações',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: undefined, appointment: IRecord) => {
        const getActionStatus = (id: string): IGetActionStatusResponse => {
          const status = appointment?.status

          if (id === 'add') {
            if (isDoctor) {
              return {
                disabled: true,
                disabledTitle: 'Você não pode agendar uma consulta',
              }
            }

            return {
              disabled: !watchedDate || !!status || status === 'cancelled',
              disabledTitle: getDisabledStatusTitle(status),
            }
          }

          if (id === 'edit') {
            if (isDoctor) {
              return {
                disabled: true,
                disabledTitle: 'Você não pode editar esta consulta',
              }
            }

            return {
              disabled: !watchedDate || status !== 'pending',
              disabledTitle: getDisabledStatusTitle(status),
            }
          }

          if (id === 'info') {
            return {
              disabled: !status || status === 'off',
              disabledTitle: getDisabledStatusTitle(status),
            }
          }

          if (id === 'check') {
            return {
              disabled: status !== 'pending' || timeDiffInDays < 0,
              disabledTitle: getDisabledStatusTitle(status, timeDiffInDays),
            }
          }

          if (id === 'delete') {
            if (isDoctor) {
              return {
                disabled: true,
                disabledTitle: 'Você não pode excluir esta consulta',
              }
            }

            return {
              disabled: !status || ['confirmed', 'off'].includes(status),
              disabledTitle: getDisabledStatusTitle(status),
            }
          }

          return {
            disabled: false,
            disabledTitle: '',
          }
        }

        const addAppointmentActionSts = getActionStatus('add')
        const editAppointmentActionSts = getActionStatus('edit')
        const infoAppointmentActionSts = getActionStatus('info')
        const confirmAppointmentActionSts = getActionStatus('check')
        const deleteAppointmentActionSts = getActionStatus('delete')

        return (
          <TableActions
            options={[
              {
                id: 'add',
                overlay: 'Marcar consulta neste horário',
                disabledTitle: addAppointmentActionSts?.disabledTitle,
                disabled: addAppointmentActionSts?.disabled,
                onClick: () =>
                  setAppointmentDrawer({
                    isVisible: true,
                    data: {
                      appointment_follow_up_limit:
                        watchedDoctor.appointment_follow_up_limit,
                      private_appointment_price:
                        watchedDoctor.private_appointment_price,
                      datetime: `${watchedDate} ${appointment.time}`,
                      doctor: watchedDoctor,
                      insurance: watchedDoctor.insurances,
                      specialty: watchedDoctor.specialties,
                      payment_method: watchedDoctor.payment_methods,
                    },
                  }),
              },
              {
                id: 'edit',
                overlay: 'Editar consulta',
                disabledTitle: editAppointmentActionSts?.disabledTitle,
                disabled: editAppointmentActionSts?.disabled,
                onClick: () =>
                  setEditAppointmentDrawer({
                    isVisible: true,
                    appointmentId: appointment?.id,
                    initialData: {
                      is_follow_up: appointment.is_follow_up || false,
                      insurance:
                        appointment?.insurance_id && appointment?.insurance_name
                          ? {
                              value: appointment.insurance_id,
                              label: appointment.insurance_name,
                            }
                          : undefined,
                      specialty:
                        appointment?.specialty_id && appointment?.specialty_name
                          ? {
                              value: appointment.specialty_id,
                              label: appointment.specialty_name,
                            }
                          : undefined,
                      payment_method:
                        appointment?.payment_method_id &&
                        appointment?.payment_method_name
                          ? {
                              value: appointment.payment_method_id,
                              label: appointment.payment_method_name,
                            }
                          : undefined,
                    },
                    data: {
                      patient: {
                        value: appointment.patient_id || 0,
                        label: appointment.patient_name || '',
                      },
                      appointment_follow_up_limit:
                        watchedDoctor.appointment_follow_up_limit,
                      private_appointment_price:
                        watchedDoctor.private_appointment_price,
                      datetime: `${watchedDate} ${appointment.time}`,
                      doctor: watchedDoctor,
                      insurance: watchedDoctor.insurances,
                      specialty: watchedDoctor.specialties,
                      payment_method: watchedDoctor.payment_methods,
                    },
                  }),
              },
              {
                id: 'info',
                overlay: 'Detalhes da consulta',
                disabledTitle: infoAppointmentActionSts?.disabledTitle,
                disabled: infoAppointmentActionSts?.disabled,
                onClick: () =>
                  setAppointmentDetailsModal({
                    isVisible: true,
                    data: appointment,
                  }),
              },
              {
                id: 'check',
                overlay: 'Confirmar consulta',
                disabledTitle: confirmAppointmentActionSts?.disabledTitle,
                disabled: confirmAppointmentActionSts?.disabled,
                onClick: () =>
                  setConfirmAppointmentModal({
                    isVisible: true,
                    datetime: `${watchedDate
                      ?.split('-')
                      ?.reverse()
                      ?.join('/')} às ${appointment.time}`,
                    id: appointment?.id || -1,
                    patientName: appointment.patient_name || '',
                  }),
              },
              {
                id: 'delete',
                overlay: 'Cancelar e excluir consulta',
                disabledTitle: deleteAppointmentActionSts?.disabledTitle,
                disabled: deleteAppointmentActionSts?.disabled,
                onClick: () =>
                  setDeleteAppointmentModal({
                    isVisible: true,
                    datetime: `${watchedDate
                      ?.split('-')
                      ?.reverse()
                      ?.join('/')} às ${appointment.time}`,
                    id: appointment?.id || -1,
                    patientName: appointment.patient_name || '',
                  }),
              },
            ]}
          />
        )
      },
    },
  ]

  const fetchAppointmentsAsync = useCallback(
    async (params: IFetchAppointmentsParams) => {
      setIsFetching(true)
      setIsMounted(true)

      const doctorId = params.doctor
      const selectedDay = new Date(watchedDate).getDay()

      if (isNaN(selectedDay) || !doctorId) {
        return
      }

      const response = await fetchAppointments(params)
      const dayOff = watchedDoctor.schedule_days_off?.filter(
        ({ datetime_start, datetime_end }) =>
          dateIsInRange({
            current: watchedDate,
            start: datetime_start?.split('T')?.[0],
            end: datetime_end?.split('T')?.[0],
          })
      )?.[0]

      if (response.data) {
        const appointments = response.data
        const availableTimes = Object.values(watchedDoctor.scheduleSettings)?.[
          selectedDay
        ]
        const formattedAppointments: IRecord[] = [...availableTimes].map(
          (time) => {
            const scheduledAppointment = appointments.find(
              (appointment) =>
                new Date(appointment.datetime)
                  .toLocaleTimeString('pt-BR')
                  .substring(0, 5) === time
            )
            const hours = time.split(':')[0]
            const minutes = time.split(':')[1]
            const fullDatetime = new Date(
              new Date(watchedDate).setUTCHours(hours, minutes, 0, 0)
            ).toISOString()
            const datetimeIsOff = dayOff
              ? dateIsInRange({
                  current: fullDatetime,
                  start: getUTCDate(dayOff.datetime_start).toString(),
                  end: getUTCDate(dayOff.datetime_end).toString(),
                })
              : false

            if (datetimeIsOff) {
              return { time, status: 'off' }
            }

            if (scheduledAppointment && scheduledAppointment.patient) {
              return {
                time,
                id: scheduledAppointment.id,
                patient_id: scheduledAppointment.patient_id,
                patient_name: scheduledAppointment.patient.name,
                patient_phone: scheduledAppointment.patient?.primary_phone,
                insurance_id: scheduledAppointment?.insurance_id,
                insurance_name: scheduledAppointment?.insurance?.name,
                specialty_id: scheduledAppointment?.specialty_id,
                specialty_name: scheduledAppointment?.specialty?.name,
                status: scheduledAppointment?.status,
                is_private: scheduledAppointment.is_private || false,
                is_follow_up: scheduledAppointment.is_follow_up || false,
                payment_method_id: scheduledAppointment?.payment_method_id,
                payment_method_name: scheduledAppointment?.payment_method?.name,
                doctor_id: scheduledAppointment?.doctor_id,
                doctor_name: watchedDoctor?.label,
                created_at: scheduledAppointment.created_at,
                updated_at: scheduledAppointment.updated_at,
              }
            }

            return { time }
          }
        )

        setRecords(
          formattedAppointments.sort((a, b) => a.time.localeCompare(b.time))
        )
      }

      setIsFetching(false)
    },
    [watchedDate, watchedDoctor]
  )

  const fetchDoctorsListAsync = useCallback(async () => {
    setIsFetching(true)

    const response = await fetchUsersDoctors()

    if (response.data) {
      const doctors = response.data
      const formattedDoctorsList: IScheduleDoctorOption[] =
        getFormattedDoctorsList(doctors)

      setValue('doctor', formattedDoctorsList?.[0])
      setDoctorsList(formattedDoctorsList)
    }

    setIsFetching(false)
  }, [])

  useEffect(() => {
    if (isManager) {
      fetchDoctorsListAsync()
    }

    if (isDoctor) {
      const formattedDoctorsList: IScheduleDoctorOption[] =
        getFormattedDoctorsList([user.data])

      setValue('doctor', formattedDoctorsList?.[0])
    }

    return () => {
      setIsMounted(false)
    }
  }, [isManager, isDoctor])

  useEffect(() => {
    if (!watchedDate) {
      setValue('date', defaultValues.date)
    }

    if (watchedDoctor?.value && watchedDate) {
      fetchAppointmentsAsync({
        date: watchedDate,
        doctor: watchedDoctor.value,
      })
    }
  }, [watchedDate, watchedDoctor])

  return (
    <PageContent>
      <TableHeader title={isDoctor ? 'Minha Agenda' : 'Agenda de Consultas'} />
      {!!isManager && (
        <InfoMessage>
          Selecione um médico e uma data para gerenciar as suas consultas.
          Quando o paciente for atendido, não se esqueça de confirmar sua
          consulta na agenda para que os dados das consultas e dos pacientes
          permaneçam sempre consistentes no sistema.
        </InfoMessage>
      )}

      {!!isDoctor && (
        <InfoMessage>
          Selecione uma data para gerenciar as suas consultas. Quando o paciente
          for atendido, não se esqueça de confirmar sua consulta na agenda para
          que os dados das consultas e dos pacientes permaneçam sempre
          consistentes no sistema. Você também pode confirmar uma consulta na
          página&nbsp;
          <Typography.Text strong>Meus Pacientes</Typography.Text>.
        </InfoMessage>
      )}

      {/* SELECTORS */}
      <Form>
        <Row gutter={12}>
          <Col span={4} sm={12} md={12} xs={12} lg={6}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  label="Data"
                  error={errors?.date?.message}
                  disabled={isFetching}
                  required
                  {...field}
                />
              )}
            />
          </Col>

          {!!isManager && (
            <Col span={6} lg={8} sm={12} xs={12}>
              <Controller
                name="doctor"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Médico"
                    placeholder="Selecionar Médico"
                    error={errors?.doctor?.value?.message}
                    options={doctorsList}
                    showError={false}
                    disabled={isFetching}
                    selectOnChange={(newValue: any) =>
                      setValue('doctor', newValue)
                    }
                    required
                    isSelect
                    {...field}
                  />
                )}
              />
            </Col>
          )}
        </Row>
      </Form>

      {/* MODALS AND DRAWERS */}
      <AppointmentDrawer
        isVisible={appointmentDrawer?.isVisible || false}
        data={appointmentDrawer?.data}
        onClose={() => setAppointmentDrawer(null)}
        refetchData={() =>
          fetchAppointmentsAsync({
            date: watchedDate,
            doctor: watchedDoctor.value,
          })
        }
      />
      <EditAppointmentDrawer
        isVisible={editAppointmentDrawer?.isVisible || false}
        data={editAppointmentDrawer?.data}
        appointmentId={editAppointmentDrawer?.appointmentId}
        appointmentInitialData={editAppointmentDrawer?.initialData}
        onClose={() => setEditAppointmentDrawer(null)}
        refetchData={() =>
          fetchAppointmentsAsync({
            date: watchedDate,
            doctor: watchedDoctor.value,
          })
        }
      />
      <AppointmentDetailsModal
        date={watchedDate?.split('-')?.reverse()?.join('/')}
        isVisible={appointmentDetailsModal?.isVisible || false}
        data={appointmentDetailsModal?.data}
        onCancel={() => setAppointmentDetailsModal(null)}
      />
      <DeleteAppointmentModal
        datetime={deleteAppointmentModal?.datetime || ''}
        isVisible={deleteAppointmentModal?.isVisible || false}
        onCancel={() => setDeleteAppointmentModal(null)}
        refetchAppointments={() =>
          fetchAppointmentsAsync({
            date: watchedDate,
            doctor: watchedDoctor.value,
          })
        }
        id={deleteAppointmentModal?.id}
        patientName={deleteAppointmentModal?.patientName}
      />
      <ConfirmAppointmentModal
        datetime={confirmAppointmentModal?.datetime || ''}
        isVisible={confirmAppointmentModal?.isVisible || false}
        onCancel={() => setConfirmAppointmentModal(null)}
        refetchAppointments={() =>
          fetchAppointmentsAsync({
            date: watchedDate,
            doctor: watchedDoctor.value,
          })
        }
        id={confirmAppointmentModal?.id}
        patientName={confirmAppointmentModal?.patientName}
      />

      {/* SCHEDULE */}
      <Table
        rowKey="time"
        rowClassName={(record, index) =>
          index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
        }
        dataSource={records}
        loading={isFetching}
        columns={columns}
        pagination={false}
        scroll={{ x: !records?.length ? undefined : true }}
        locale={{
          emptyText:
            !isMounted || isFetching
              ? 'Buscando dados...'
              : 'Não há horários disponíveis nesta data',
        }}
      />
      <RefreshButton
        isFetching={isFetching}
        disabled={isFetching}
        title={
          isManager
            ? 'Clique para atualizar a lista de médicos e suas respectivas agendas'
            : 'Clique para atualizar sua agenda de consultas'
        }
        onFetch={() => fetchDoctorsListAsync()}
      />
    </PageContent>
  )
}
