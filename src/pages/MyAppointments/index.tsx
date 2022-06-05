import { useCallback, useEffect, useState } from 'react'
import { Table, TablePaginationConfig } from 'antd'
import { FilterValue } from 'antd/lib/table/interface'

import { getFilterProps } from '../../components/UI/FilterBox/Filter'
import { PageContent } from '../../components/UI/PageContent'
import { TableActions } from '../../components/UI/TableActions'
import { TableHeader } from '../../components/UI/TableHeader'

import {
  fetchMyAppointments,
  IFetchMyAppointmentsParams,
} from '../../services/requests/appointment'
import { IMyAppointment } from '../../interfaces/appointment'
import { RootState } from '../../store'
import { useSelector } from 'react-redux'
import { InfoMessage } from './styles'
import { MyAppointmentDetailModal } from './MyAppointmentDetails'

interface IFilter {
  datetime: string | null
  patient_name: string | null
}

interface IAppointmentDetailsModalProps {
  isVisible: boolean
  data: IMyAppointment
}

const initialPagination = { current: 1, pageSize: 5 }
const initialFetchParams = {
  page: initialPagination.current,
  perPage: initialPagination.pageSize,
}
const initialFilters: IFilter = {
  datetime: null,
  patient_name: null,
}

export const MyAppointments = (): JSX.Element => {
  const user = useSelector((state: RootState) => state.AuthReducer)
  const doctor = user?.data?.doctor
  const [records, setRecords] = useState<IMyAppointment[]>([])
  const [fetching, setFetching] = useState(false)
  const [searchFilters, setSearchFilters] = useState<IFilter>(initialFilters)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    ...initialPagination,
  })
  const [appointmentDetailsModal, setAppointmentDetailsModal] =
    useState<IAppointmentDetailsModalProps | null>(null)

  const fetchMyAppointmentsAsync = useCallback(
    async (params: IFetchMyAppointmentsParams) => {
      setFetching(true)

      const response = await fetchMyAppointments(doctor.id, params)

      if (response.data) {
        const appointments = response.data

        setRecords(
          [...appointments].map((appointment) => ({
            ...appointment,
            insurance_name:
              appointment?.insurance?.name || 'Nenhum (Particular)',
            patient: appointment.patient,
            patient_name: appointment.patient.name,
          }))
        )

        if (response.meta) {
          setPagination((prevPagination) => ({
            ...prevPagination,
            current: response.meta?.current_page,
            total: response.meta?.total,
          }))
        }
      }

      setFetching(false)
    },
    []
  )

  const columns = [
    {
      title: 'Paciente',
      dataIndex: 'patient_name',
      key: 'patient_name',
      sorter: (a: IMyAppointment, b: IMyAppointment) =>
        a.patient_name.localeCompare(b.patient_name),
      ...getFilterProps({
        dataIndex: 'patient_name',
        inputOptions: { placeholder: 'Nome' },
      }),
      filteredValue: searchFilters.patient_name as unknown as FilterValue,
    },
    {
      title: 'Data da Consulta',
      dataIndex: 'datetime',
      key: 'datetime',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Convênio',
      dataIndex: 'insurance_name',
      key: 'insurance_name',
    },
    {
      title: 'Última Consulta',
      dataIndex: 'last_appointment_datetime',
      key: 'last_appointment_datetime',
      render: (date: string) =>
        date ? new Date(date).toLocaleString() : 'Nenhuma',
    },
    {
      title: 'É Retorno',
      dataIndex: 'is_follow_up',
      key: 'is_follow_up',
      render: (is_follow_up: boolean) => (is_follow_up ? 'Sim' : 'Não'),
    },
    {
      title: 'Ações',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: string, appointment: IMyAppointment) => (
        <TableActions
          options={[
            {
              id: 'info',
              overlay: 'Clique para ver detalhes desta consulta',
              onClick: () =>
                setAppointmentDetailsModal({
                  isVisible: true,
                  data: appointment,
                }),
            },
          ]}
        />
      ),
    },
  ]

  useEffect(() => {
    fetchMyAppointmentsAsync(initialFetchParams)
  }, [])

  return (
    <PageContent>
      <TableHeader title="Minhas Consultas" />
      <InfoMessage>
        Na tabela abaixo você pode acompanhar as consultas e os pacientes
        atendidos por você.
      </InfoMessage>
      <Table
        rowKey="id"
        dataSource={records}
        loading={fetching}
        columns={columns}
        pagination={pagination}
        onChange={async (pagination, filters, sorter, meta) => {
          const sorting = Array.isArray(sorter) ? sorter?.[0] : sorter
          let search = { ...searchFilters }

          if (meta.action === 'filter') {
            search = {
              datetime: (filters?.datetime as unknown as string) || null,
              patient_name:
                (filters?.patient_name as unknown as string) || null,
              // name: (filters?.name as unknown as string) || null,
              // cpf: (filters?.cpf as unknown as string) || null,
              // motherName: (filters?.motherName as unknown as string) || null,
              // primaryPhone:
              //   (filters?.primaryPhone as unknown as string) || null,
              // email: (filters?.email as unknown as string) || null,
            }

            setSearchFilters(search)
          }

          const payload = { ...pagination, ...search }

          await fetchMyAppointmentsAsync({
            ...payload,
            page: payload.current || initialPagination.current,
            perPage: payload.pageSize || initialPagination.pageSize,
            order: sorting.order === 'ascend' ? 'asc' : 'desc',
            orderBy: sorting?.field?.toString(),
          })
        }}
        scroll={{ x: !records?.length ? undefined : true }}
      />
      <MyAppointmentDetailModal
        isVisible={!!appointmentDetailsModal}
        data={appointmentDetailsModal?.data}
        onCancel={() => setAppointmentDetailsModal(null)}
      />
    </PageContent>
  )
}
