import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, TablePaginationConfig } from 'antd'
import { FilterValue } from 'antd/lib/table/interface'

import { RootState } from '../../store'
import { InfoMessage } from './styles'
import { IFetchPatientsParams } from '../../services/requests/patient'
import { fetchMyPatients } from '../../services/requests/myPatient'
import { ICompletePatient } from '../../interfaces/patient'
import { PatientDetailsModal } from '../../components/Forms/Patient/PatientDetailsModal'
import { getFilterProps } from '../../components/UI/FilterBox/Filter'
import { PageContent } from '../../components/UI/PageContent'
import { TableActions } from '../../components/UI/TableActions'
import { TableHeader } from '../../components/UI/TableHeader'
import { EditMyPatientDrawer } from './Drawer'
import { getTimePassed } from '../../utils/helpers/formatters'
import { MyAppointmentsDrawer } from './MyAppointmentsDrawer'
import { RefreshButton } from '../../components/UI/RefreshButton'

interface IFilter {
  cpf: string | null
  email: string | null
  name: string | null
  primaryPhone: string | null
}

interface IPatientDetailsModalProps {
  isVisible: boolean
  data: ICompletePatient
}

type EditPatientDrawerProps = IPatientDetailsModalProps & {
  data: ICompletePatient & { age: number }
}

interface IMyAppointmentsDrawerProps {
  isVisible: boolean
  patient: ICompletePatient
}

const initialPagination = { current: 1, pageSize: 5 }
const initialFetchParams = {
  page: initialPagination.current,
  perPage: initialPagination.pageSize,
}
const initialFilters: IFilter = {
  cpf: null,
  name: null,
  email: null,
  primaryPhone: null,
}

export const MyPatients = (): JSX.Element => {
  const user = useSelector((state: RootState) => state.AuthReducer)
  const doctor = user?.data?.doctor
  const [records, setRecords] = useState<ICompletePatient[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [searchFilters, setSearchFilters] = useState<IFilter>(initialFilters)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    ...initialPagination,
  })
  const [myAppointmentsDrawer, setMyAppointmentsDrawer] =
    useState<IMyAppointmentsDrawerProps | null>(null)
  const [patientDetailsModal, setPatientDetailsModal] =
    useState<IPatientDetailsModalProps | null>(null)
  const [editPatientDrawer, setEditPatientDrawer] =
    useState<EditPatientDrawerProps | null>(null)

  const fetchMyPatientsAsync = useCallback(
    async (params: IFetchPatientsParams) => {
      setIsFetching(true)

      const response = await fetchMyPatients(doctor.id, params)

      if (response.data) {
        const patients = response.data

        setRecords(patients)

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
    []
  )

  const columns = [
    {
      title: 'Paciente',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ICompletePatient, b: ICompletePatient) =>
        a.name.localeCompare(b.name),
      ...getFilterProps({
        dataIndex: 'name',
        inputOptions: { placeholder: 'Nome' },
      }),
      filteredValue: searchFilters.name as unknown as FilterValue,
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
      sorter: (a: ICompletePatient, b: ICompletePatient) =>
        a.cpf.localeCompare(b.cpf),
      ...getFilterProps({
        dataIndex: 'cpf',
        inputOptions: { placeholder: 'CPF' },
      }),
      filteredValue: searchFilters.cpf as unknown as FilterValue,
    },
    {
      title: 'Telefone',
      dataIndex: 'primary_phone',
      key: 'primary_phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getFilterProps({
        dataIndex: 'email',
        inputOptions: { placeholder: 'Email' },
      }),
      filteredValue: searchFilters.email as unknown as FilterValue,
      render: (email?: string) => email || 'Nenhum',
    },
    {
      title: 'Última Atualização',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Ações',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: string, patient: ICompletePatient) => (
        <TableActions
          options={[
            {
              id: 'info',
              overlay: 'Clique para ver detalhes deste paciente',
              onClick: () =>
                setPatientDetailsModal({
                  isVisible: true,
                  data: patient,
                }),
            },
            {
              id: 'edit',
              overlay: 'Clique para editar os dados deste paciente',
              onClick: () =>
                setEditPatientDrawer({
                  isVisible: true,
                  data: {
                    ...patient,
                    age: getTimePassed(patient.birthdate) || 0,
                  },
                }),
            },
            {
              id: 'book',
              overlay: 'Clique para ver as consultas deste paciente',
              onClick: () =>
                setMyAppointmentsDrawer({
                  isVisible: true,
                  patient,
                }),
            },
          ]}
        />
      ),
    },
  ]

  useEffect(() => {
    fetchMyPatientsAsync(initialFetchParams)
  }, [])

  return (
    <PageContent>
      <TableHeader title="Meus Pacientes" />
      <InfoMessage>
        Na tabela abaixo você pode acompanhar os pacientes que já foram
        atendidos por você.
      </InfoMessage>

      <RefreshButton
        title={
          isFetching
            ? 'Buscando dados...'
            : 'Clique para buscar a lista de pacientes mais atualizada'
        }
        isFetching={isFetching}
        disabled={isFetching}
        onFetch={() => fetchMyPatientsAsync(initialFetchParams)}
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
              cpf: (filters?.cpf as unknown as string) || null,
              name: (filters?.name as unknown as string) || null,
              email: (filters?.email as unknown as string) || null,
              primaryPhone:
                (filters?.primaryPhone as unknown as string) || null,
            }

            setSearchFilters(search)
          }

          const payload = { ...pagination, ...search }

          await fetchMyPatientsAsync({
            ...payload,
            page: payload.current || initialPagination.current,
            perPage: payload.pageSize || initialPagination.pageSize,
            order: sorting.order === 'ascend' ? 'asc' : 'desc',
            orderBy: sorting?.field?.toString(),
          })
        }}
        scroll={{ x: !records?.length ? undefined : true }}
      />
      <PatientDetailsModal
        isVisible={!!patientDetailsModal}
        data={patientDetailsModal?.data}
        onCancel={() => setPatientDetailsModal(null)}
      />
      <EditMyPatientDrawer
        isVisible={editPatientDrawer?.isVisible || false}
        data={editPatientDrawer?.data}
        fetchPatients={() => fetchMyPatientsAsync(initialFetchParams)}
        onClose={() => setEditPatientDrawer(null)}
      />
      <MyAppointmentsDrawer
        isVisible={myAppointmentsDrawer?.isVisible}
        patient={myAppointmentsDrawer?.patient}
        onClose={() => setMyAppointmentsDrawer(null)}
        setPatientDetailsModal={(data: ICompletePatient) =>
          setPatientDetailsModal({ data, isVisible: true })
        }
      />
    </PageContent>
  )
}
