import { useCallback, useEffect, useState } from 'react'
import { Table, TablePaginationConfig } from 'antd'
import { FilterValue } from 'antd/lib/table/interface'

import { IPatient } from '../../interfaces/patient'
import {
  fetchPatients,
  IFetchPatientsParams,
} from '../../services/requests/patient'
import { getFilterProps } from '../../components/UI/FilterBox/Filter'
import { PageContent } from '../../components/UI/PageContent'
import { TableActions } from '../../components/UI/TableActions'
import { TableHeader } from '../../components/UI/TableHeader'
import { PatientDrawer } from './Drawer'
import { DeletePatientModal as DeletionModal } from './DeletionModal'
import { PatientDetailsModal } from '../../components/Forms/Patient/PatientDetailsModal'
import { getSortOrder } from '../../utils/helpers/formatters'

interface IFilter {
  name: string | null
  cpf: string | null
  motherName: string | null
  primaryPhone: string | null
  email: string | null
}

interface IPatientDrawer {
  isVisible: boolean
  type: 'create' | 'update'
  data?: IPatient
}

interface IDeletionModalProps {
  isVisible: boolean
  id: number
  patientName: string
}

interface IPatientDetailsModalProps {
  isVisible: boolean
  data: IPatient
}

const initialPagination = { current: 1, pageSize: 5 }
const initialFetchParams = {
  page: initialPagination.current,
  perPage: initialPagination.pageSize,
}
const initialFilters: IFilter = {
  name: null,
  cpf: null,
  motherName: null,
  primaryPhone: null,
  email: null,
}

export const Patients = (): JSX.Element => {
  const [records, setRecords] = useState<IPatient[]>([])
  const [fetching, setFetching] = useState(false)
  const [searchFilters, setSearchFilters] = useState<IFilter>(initialFilters)
  const [deletionModal, setDeletionModal] =
    useState<IDeletionModalProps | null>(null)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    ...initialPagination,
  })
  const [drawer, setDrawer] = useState<IPatientDrawer | null>(null)
  const [patientDetailsModal, setPatientDetailsModal] =
    useState<IPatientDetailsModalProps | null>(null)

  const fetchPatientsAsync = useCallback(
    async (params: IFetchPatientsParams) => {
      setFetching(true)

      const response = await fetchPatients(params)

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

      setFetching(false)
    },
    []
  )

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: IPatient, b: IPatient) => a.name.localeCompare(b.name),
      ...getFilterProps({
        dataIndex: 'name',
        inputOptions: { placeholder: 'Nome' },
      }),
      defaultSortOrder: getSortOrder(),
      filteredValue: searchFilters.name as unknown as FilterValue,
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
      sorter: (a: IPatient, b: IPatient) => a.cpf.localeCompare(b.cpf),
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
      render: (_: string, patient: IPatient) => (
        <TableActions
          options={[
            {
              id: 'info',
              overlay: 'Detalhes do paciente',
              onClick: () =>
                setPatientDetailsModal({ isVisible: true, data: patient }),
            },
            {
              id: 'edit',
              overlay: 'Editar paciente',
              onClick: () =>
                setDrawer({ isVisible: true, type: 'update', data: patient }),
            },
            {
              id: 'delete',
              overlay: 'Excluir paciente',
              onClick: () =>
                setDeletionModal({
                  id: patient.id,
                  isVisible: true,
                  patientName: patient.name,
                }),
            },
          ]}
        />
      ),
    },
  ]

  useEffect(() => {
    fetchPatientsAsync(initialFetchParams)
  }, [])

  return (
    <PageContent>
      <PatientDetailsModal
        isVisible={!!patientDetailsModal}
        data={patientDetailsModal?.data}
        onCancel={() => setPatientDetailsModal(null)}
      />
      <PatientDrawer
        type={drawer?.type || 'create'}
        isVisible={drawer?.isVisible || false}
        data={drawer?.data}
        onClose={() => setDrawer(null)}
        fetchPatients={() => fetchPatientsAsync(initialFetchParams)}
      />
      <DeletionModal
        isVisible={deletionModal?.isVisible || false}
        id={deletionModal?.id}
        patientName={deletionModal?.patientName || ''}
        refetchPatients={() => fetchPatientsAsync(initialFetchParams)}
        onCancel={() => setDeletionModal(null)}
      />
      <TableHeader
        title="Pacientes"
        newRecordButton={{
          visible: true,
          onClick: () => setDrawer({ isVisible: true, type: 'create' }),
        }}
      />
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
              name: (filters?.name as unknown as string) || null,
              cpf: (filters?.cpf as unknown as string) || null,
              motherName: (filters?.motherName as unknown as string) || null,
              primaryPhone:
                (filters?.primaryPhone as unknown as string) || null,
              email: (filters?.email as unknown as string) || null,
            }

            setSearchFilters(search)
          }

          const payload = { ...pagination, ...search }

          await fetchPatientsAsync({
            ...payload,
            page: payload.current || initialPagination.current,
            perPage: payload.pageSize || initialPagination.pageSize,
            order: sorting.order === 'ascend' ? 'asc' : 'desc',
            orderBy: sorting?.field?.toString(),
          })
        }}
        scroll={{ x: !records?.length ? undefined : true }}
      />
    </PageContent>
  )
}
