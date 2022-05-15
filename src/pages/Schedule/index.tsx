/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
import { Col, Row, Table, Tag } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import {
  fetchAppointments,
  IFetchAppointmentsParams,
} from '../../services/requests/appointment'
import { fetchUsersDoctors } from '../../services/requests/user'
// import { IAppointment } from '../../interfaces/appointment'

import {
  getAppointmentStatus,
  getFormattedDoctorSchedule,
} from '../../utils/helpers/formatters'
import { TAppointmentStatus } from '../../interfaces/appointment'
import { IInsurance } from '../../interfaces/insurance'
import { IPaymentMethod } from '../../interfaces/paymentMethod'
import { ISpecialty } from '../../interfaces/specialty'
import { IParsedDaysScheduleSettings } from '../../interfaces/scheduleSettings'
import { Form, InfoMessage } from './styles'
import { PageContent } from '../../components/UI/PageContent'
import { TableActions } from '../../components/UI/TableActions'
import { TableHeader } from '../../components/UI/TableHeader'
import { Input } from '../../components/UI/Input'
import { AppointmentDrawer, IAppointmentDrawerData } from './Drawer'

interface IScheduleDoctorOption {
  insurances?: IInsurance[] | undefined
  appointment_follow_up_limit?: number | undefined
  private_appointment_price?: number | undefined
  payment_methods?: IPaymentMethod[] | undefined
  specialties?: ISpecialty[]
  scheduleSettings: IParsedDaysScheduleSettings
  value: number
  label: string
}

interface IRecord {
  time: string
  patient_id?: number | undefined
  patient_name?: string | undefined
  insurance_id?: number | undefined | null
  insurance_name?: string | undefined
  is_private?: boolean | undefined
  last_appointment_datetime?: string | undefined
  status?: TAppointmentStatus
}

interface ISelectScheduleDataValues {
  date: string
  doctor: IScheduleDoctorOption
}

interface IAppointmentDrawer {
  isVisible?: boolean | undefined
  data?: IAppointmentDrawerData
  type?: 'create' | 'update' | undefined
}

const scheduleSchema = Yup.object().shape({
  date: Yup.string().required('Por favor, insira a data para ver a agenda!'),
})

export const Schedule = (): JSX.Element => {
  const defaultValues = {
    date: new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-'),
    doctor: undefined,
  }
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ISelectScheduleDataValues>({
    defaultValues,
    resolver: yupResolver(scheduleSchema),
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const watchedDoctor = watch('doctor')
  const watchedDate = watch('date')
  const [doctorsList, setDoctorsList] = useState<IScheduleDoctorOption[]>([])
  const [records, setRecords] = useState<any>([])
  const [isFetching, setIsFetching] = useState(false)
  const [appointmentDrawer, setAppointmentDrawer] =
    useState<IAppointmentDrawer | null>(null)
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
      render: (status: TAppointmentStatus | undefined) => {
        let color = '#3ed862'

        if (status === 'pending') {
          color = '#fcd55f'
        }

        if (status === 'confirmed') {
          color = '#4370d8'
        }

        return (
          <Tag color={color} key={status}>
            {getAppointmentStatus(status)}
          </Tag>
        )
      },
    },
    {
      title: 'Ações',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: undefined, appointment: IRecord) => (
        <TableActions
          options={[
            {
              id: 'add',
              overlay: 'Clique para marcar uma consulta neste horário',
              disabledTitle: 'Este horário já está ocupado',
              disabled:
                !watchedDate ||
                !!appointment.status ||
                appointment.status === 'cancelled',
              onClick: () =>
                setAppointmentDrawer({
                  isVisible: true,
                  data: {
                    last_appointment_datetime:
                      appointment.last_appointment_datetime,
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
              overlay: 'Clique para ver detalhes desta consulta',
              disabledTitle:
                'Ainda não há uma consulta agendada para este horário',
              disabled: !appointment.status,
              onClick: () => console.log('clicked to see details', appointment),
            },
            {
              id: 'check',
              overlay: 'Clique para confirmar esta consulta',
              disabledTitle: !appointment.status
                ? 'Ainda não há uma consulta agendada para este horário'
                : 'Esta consulta ainda não pode ser confirmada',
              disabled: appointment.status !== 'pending',
              onClick: () => console.log('clicked to confirm', appointment),
            },
            {
              id: 'delete',
              overlay: 'Clique para cancelar e excluir esta consulta',
              disabledTitle: !appointment.status
                ? 'Ainda não há uma consulta agendada para este horário'
                : 'Esta consulta já está confirmada e não pode ser excluída',
              disabled:
                !appointment.status || appointment.status === 'confirmed',
              onClick: () => console.log('clicked to cancel', appointment),
            },
          ]}
        />
      ),
    },
  ]

  const fetchAppointmentsAsync = useCallback(
    async (params: IFetchAppointmentsParams) => {
      setIsFetching(true)

      const doctorId = params.doctor
      const selectedDay = new Date(watchedDate).getDay()

      if (isNaN(selectedDay) || !doctorId) {
        return
      }

      const response = await fetchAppointments(params)

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

            if (scheduledAppointment && scheduledAppointment.patient) {
              return {
                time: time,
                patient_id: scheduledAppointment.patient_id,
                patient_name: scheduledAppointment.patient.name,
                insurance_id: scheduledAppointment?.insurance_id,
                insurance_name: scheduledAppointment?.insurance?.name,
                status: scheduledAppointment?.status,
                is_private: scheduledAppointment.is_private || false,
              }
            }

            return { time }
          }
        )

        setRecords(formattedAppointments)
      }

      setIsFetching(false)
    },
    [watchedDate, watchedDoctor]
  )

  useEffect(() => {
    ;(async () => {
      setIsFetching(true)

      const response = await fetchUsersDoctors()

      if (response.data) {
        const doctors = response.data
        const formattedDoctorsList: IScheduleDoctorOption[] = doctors.map(
          (userDoctor) => ({
            payment_methods: userDoctor.doctor?.payment_method,
            insurances: userDoctor.doctor?.insurance,
            specialties: userDoctor.doctor?.specialty,
            label: userDoctor.name,
            value: userDoctor.doctor.id,
            last_appointment_datetime:
              userDoctor.doctor.last_appointment_datetime,
            appointment_follow_up_limit:
              userDoctor.doctor.appointment_follow_up_limit,
            private_appointment_price:
              userDoctor.doctor.private_appointment_price,
            scheduleSettings: getFormattedDoctorSchedule(
              userDoctor.doctor.schedule_settings
            ),
          })
        )

        setValue('doctor', formattedDoctorsList?.[0])
        setDoctorsList(formattedDoctorsList)
      }

      setIsFetching(false)
    })()
  }, [])

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
      <TableHeader title="Agenda" />

      <InfoMessage>
        Selecione um médico e uma data para gerenciar as suas consultas.
      </InfoMessage>

      <AppointmentDrawer
        type={appointmentDrawer?.type || 'create'}
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
                  selectOnChange={(newValue: any) =>
                    setValue('doctor', newValue)
                  }
                  showError={false}
                  disabled={isFetching}
                  required
                  isSelect
                  {...field}
                />
              )}
            />
          </Col>
        </Row>
      </Form>

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
          emptyText: 'Não há horários disponíveis nesta data',
        }}
      />
    </PageContent>
  )
}
