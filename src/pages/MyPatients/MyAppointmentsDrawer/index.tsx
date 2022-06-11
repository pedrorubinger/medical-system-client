import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Drawer, Table, TablePaginationConfig } from 'antd'
import { FilterValue } from 'antd/lib/table/interface'

import { getFilterProps } from '../../../components/UI/FilterBox/Filter'
import { TableActions } from '../../../components/UI/TableActions'
import { TableHeader } from '../../../components/UI/TableHeader'

import { getDrawerWidth } from '../../../utils/helpers/formatters'
import { IMyAppointment } from '../../../interfaces/appointment'
import { RootState } from '../../../store'
import {
  fetchMyAppointments,
  IFetchMyAppointmentsParams,
} from '../../../services/requests/appointment'
import { InfoMessage } from './styles'
import { MyAppointmentDetailModal } from './MyAppointmentDetails'

interface IFilter {
  datetime: string | null
}

interface IMyAppointmentsDrawerProps {
  /** @default false */
  isVisible?: boolean
  patientName?: string
  patientId?: number
  onClose: () => void
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
}

export const MyAppointmentsDrawer = ({
  isVisible = false,
  patientName,
  patientId,
  onClose,
}: IMyAppointmentsDrawerProps): JSX.Element => {
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

      const response = await fetchMyAppointments(doctor.id, {
        ...params,
        patientId,
      })

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
    [patientId]
  )

  const columns = [
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
    if (isVisible) {
      fetchMyAppointmentsAsync(initialFetchParams)
    }
  }, [isVisible])

  return (
    <Drawer
      title="Atendimentos"
      visible={isVisible}
      width={getDrawerWidth(650)}
      onClose={onClose}
      destroyOnClose>
      <TableHeader
        title={
          patientName
            ? `Consultas de ${patientName?.split(' ')?.[0]}`
            : 'Consultas do Paciente'
        }
      />
      <InfoMessage>
        Na tabela abaixo você pode acompanhar as consultas atendidas por você
        para este paciente.
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
    </Drawer>
  )
}
