import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Drawer, Table, TablePaginationConfig } from 'antd'
import { FilterValue } from 'antd/lib/table/interface'

import { getFilterProps } from '../../../components/UI/FilterBox/Filter'
import { TableActions } from '../../../components/UI/TableActions'
import { TableHeader } from '../../../components/UI/TableHeader'

import { getDrawerWidth } from '../../../utils/helpers/formatters'
import {
  IMyAppointment,
  TAppointmentStatus,
} from '../../../interfaces/appointment'
import { RootState } from '../../../store'
import {
  fetchMyAppointments,
  IFetchMyAppointmentsParams,
} from '../../../services/requests/appointment'
import { ICompletePatient } from '../../../interfaces/patient'
import { InfoMessage } from './styles'
import { MyAppointmentDetailModal } from './MyAppointmentDetails'
import { RefreshButton } from '../../../components/UI/RefreshButton'
import { getAppointmentColor } from '../../../utils/helpers/elements'
import { EditAppointmentDrawer } from './EditAppointmentDrawer'

interface IFilter {
  datetime: string | null
}

interface IMyAppointmentsDrawerProps {
  /** @default false */
  isVisible?: boolean
  patient?: ICompletePatient
  onClose: () => void
  setPatientDetailsModal: (data: ICompletePatient) => void
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
  patient,
  onClose,
  setPatientDetailsModal,
}: IMyAppointmentsDrawerProps): JSX.Element => {
  const user = useSelector((state: RootState) => state.AuthReducer)
  const doctor = user?.data?.doctor
  const patientId = patient?.id
  const patientName = patient?.name
  const [records, setRecords] = useState<IMyAppointment[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [searchFilters, setSearchFilters] = useState<IFilter>(initialFilters)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    ...initialPagination,
  })
  const [appointmentDetailsModal, setAppointmentDetailsModal] =
    useState<IAppointmentDetailsModalProps | null>(null)
  const [editAppointmentDrawer, setEditAppointmentDrawer] =
    useState<IAppointmentDetailsModalProps | null>(null)

  const fetchMyAppointmentsAsync = useCallback(
    async (params: IFetchMyAppointmentsParams) => {
      setIsFetching(true)

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

      setIsFetching(false)
    },
    [patientId]
  )

  const columns = [
    {
      title: 'Data da Consulta',
      dataIndex: 'datetime',
      key: 'datetime',
      render: (date: string) => {
        const formattedFullDate = new Date(date).toLocaleString()
        const formattedDate = formattedFullDate?.split(' ')?.[0]
        const time = formattedFullDate?.split(' ')?.[1]?.slice(0, 5)

        return `${formattedDate} às ${time}`
      },
    },
    {
      title: 'Convênio',
      dataIndex: 'insurance_name',
      key: 'insurance_name',
    },
    {
      title: 'Retorno',
      dataIndex: 'is_follow_up',
      key: 'is_follow_up',
      render: (is_follow_up: boolean) => (is_follow_up ? 'Sim' : 'Não'),
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
            {
              id: 'edit',
              overlay: 'Clique para editar esta consulta',
              onClick: () =>
                setEditAppointmentDrawer({
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
      width={getDrawerWidth(750)}
      onClose={onClose}
      destroyOnClose>
      <TableHeader
        title={
          patientName
            ? `Consultas de ${patientName?.split(' ')?.[0]} ${
                patientName?.split(' ')?.[1]
              }`
            : 'Consultas do Paciente'
        }
      />
      <InfoMessage>
        Na tabela abaixo você pode acompanhar as consultas atendidas por você
        para este paciente.
      </InfoMessage>

      <RefreshButton
        isFetching={isFetching}
        onFetch={() => fetchMyAppointmentsAsync(initialFetchParams)}
        disabled={isFetching}
      />

      <Table
        rowKey="id"
        dataSource={records}
        loading={isFetching}
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
      <EditAppointmentDrawer
        isVisible={editAppointmentDrawer?.isVisible || false}
        data={editAppointmentDrawer?.data}
        onClose={() => setEditAppointmentDrawer(null)}
        fetchMyAppointments={() => fetchMyAppointmentsAsync(initialFetchParams)}
        setPatientDetailsModal={() =>
          patient ? setPatientDetailsModal(patient) : undefined
        }
      />
    </Drawer>
  )
}
