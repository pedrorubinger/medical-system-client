import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { notification, Table, TablePaginationConfig } from 'antd'
import { FilterValue } from 'antd/lib/table/interface'

import { RootState } from '../../store'
import { AdminsDrawer } from './Drawer'
import { IUser } from '../../interfaces/user'
import { formatCPF, getSortOrder } from '../../utils/helpers/formatters'
import { PageContent } from '../../components/UI/PageContent'
import { TableHeader } from '../../components/UI/TableHeader'
import { TableActions } from '../../components/UI/TableActions'
import { getFilterProps } from '../../components/UI/FilterBox/Filter'
import {
  fetchTenantUsers,
  IFetchTenantUserParams,
} from '../../services/requests/tenantUser'
import { DeleteTenantUserModal as DeletionModal } from './DeletionModal'
import { TRole } from '../../interfaces/roles'
import { UserDetailsModal } from '../../components/Forms/User/UserDetailsModal'

interface IDeletionModal {
  isVisible: boolean
  id: number
  name: string
}

interface IUserDetailsModal {
  data: IUser
}

export const Admins = () => {
  const user = useSelector((state: RootState) => state.AuthReducer)
  const [records, setRecords] = useState<IUser[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [drawerIsVisible, setDrawerIsVisible] = useState(false)
  const [userDetailsModal, setUserDetailsModal] =
    useState<IUserDetailsModal | null>(null)
  const [deletionModal, setDeletionModal] = useState<IDeletionModal | null>(
    null
  )
  interface IFilters {
    cpf: string | null
    name: string | null
    email: string | null
    role: TRole | null
  }

  const initialPagination = { current: 1, pageSize: 5 }
  const initialFetchParams = {
    page: initialPagination.current,
    perPage: initialPagination.pageSize,
  }
  const initialFilters = { cpf: null, name: null, email: null, role: null }
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    ...initialPagination,
  })
  const [searchFilters, setSearchFilters] = useState<IFilters>(initialFilters)
  const ownId = user.data.id

  const fetchAdminsAsync = useCallback(
    async (params: IFetchTenantUserParams) => {
      setIsFetching(true)

      const response = await fetchTenantUsers(params, {
        ownerTenant: !!user?.data?.is_master,
      })

      if (response.error) {
        notification.error({
          message: response.error.message,
        })
      }

      if (response.data) {
        const users = response.data.data

        setRecords(users)

        if (response.data.meta) {
          setPagination((prevPagination) => ({
            ...prevPagination,
            current: response?.data?.meta?.current_page,
            total: response?.data?.meta?.total,
          }))
        }
      }

      setIsFetching(false)
    },
    [ownId]
  )

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: IUser, b: IUser) => a.name.localeCompare(b.name),
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
      sorter: (a: IUser, b: IUser) => a.cpf.localeCompare(b.cpf),
      ...getFilterProps({
        dataIndex: 'cpf',
        inputOptions: { placeholder: 'CPF' },
      }),
      filteredValue: searchFilters.cpf as unknown as FilterValue,
      render: (cpf: string) => formatCPF(cpf),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: IUser, b: IUser) => a.email.localeCompare(b.email),
      ...getFilterProps({
        dataIndex: 'email',
        inputOptions: { placeholder: 'Email' },
      }),
      filteredValue: searchFilters.email as unknown as FilterValue,
    },
    {
      title: 'Telefone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Data de Cadastro',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Ações',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: string, user: IUser) => (
        <TableActions
          options={[
            {
              id: 'info',
              overlay: 'Ver detalhes deste administrador',
              onClick: () => setUserDetailsModal({ data: user }),
            },
            {
              id: 'delete',
              overlay: user.is_master
                ? 'Não é possível excluir este administrador'
                : 'Clique para excluir este administrador',
              disabled: !!user.is_admin,
              onClick: () =>
                setDeletionModal({
                  isVisible: true,
                  name: user.name,
                  id: user.id,
                }),
            },
          ]}
        />
      ),
    },
  ]

  useEffect(() => {
    fetchAdminsAsync(initialFetchParams)
  }, [])

  return (
    <PageContent>
      <DeletionModal
        id={deletionModal?.id || -1}
        isVisible={deletionModal?.isVisible || false}
        name={deletionModal?.name || ''}
        onClose={() => setDeletionModal(null)}
        refetchData={async () => await fetchAdminsAsync(initialFetchParams)}
      />
      <AdminsDrawer
        isVisible={drawerIsVisible}
        onClose={() => setDrawerIsVisible(false)}
        fetchAdmins={async () => await fetchAdminsAsync(initialFetchParams)}
      />
      <UserDetailsModal
        isVisible={!!userDetailsModal}
        data={userDetailsModal?.data}
        onCancel={() => setUserDetailsModal(null)}
      />
      <TableHeader
        title="Administradores"
        newRecordButton={{
          visible: true,
          onClick: () => setDrawerIsVisible(true),
        }}
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
              email: (filters?.email as unknown as string) || null,
              name: (filters?.name as unknown as string) || null,
              role: (filters?.role as unknown as TRole) || null,
            }

            setSearchFilters(search)
          }

          const payload = { ...pagination, ...search }

          await fetchAdminsAsync({
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
