import { useCallback, useEffect, useState } from 'react'
import { notification, Table, TablePaginationConfig } from 'antd'
import { useSelector } from 'react-redux'

import {
  deleteUser,
  fetchUsers,
  IFetchUsersParams,
} from '../../services/requests/user'
import { getFilterProps } from '../../components/UI/FilterBox/Filter'
import { getTranslatedRole } from '../../utils/helpers/roles'
import { PageContent } from '../../components/UI/PageContent'
import { TableHeader } from '../../components/UI/TableHeader'
import { IUser } from '../../interfaces/user'
import { TRole } from '../../interfaces/roles'
import { UsersDrawer } from './Drawer'
import { TableActions } from '../../components/UI/TableActions'
import { DeletionModal } from './DeletionModal'
import { RootState } from '../../store'
import { FilterValue } from 'antd/lib/table/interface'
import { UserDetailsModal } from './UserDetails'

interface IDeletionModalProps {
  isVisible: boolean
  userName: string
  onOk: () => void
}

interface IUserDetailsModal {
  data: IUser
}

interface IFilters {
  cpf: string | null
  role: TRole | null
  name: string | null
  email: string | null
}

const initialPagination = { current: 1, pageSize: 5 }
const initialFetchParams = {
  page: initialPagination.current,
  perPage: initialPagination.pageSize,
}
const initialFilters = { cpf: null, name: null, email: null, role: null }
const roles = [
  { value: 'doctor', text: 'Médico(a)' },
  { value: 'manager', text: 'Gestor(a)' },
]

export const Users = (): JSX.Element => {
  const [records, setRecords] = useState<IUser[]>([])
  const [fetching, setFetching] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [userDetailsModal, setUserDetailsModal] =
    useState<IUserDetailsModal | null>(null)
  const [deletionModal, setDeletionModal] =
    useState<IDeletionModalProps | null>(null)
  const [drawer, setDrawer] = useState(false)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    ...initialPagination,
  })
  const [searchFilters, setSearchFilters] = useState<IFilters>(initialFilters)
  const user = useSelector((state: RootState) => state.AuthReducer)
  const ownId = user.data.id

  const fetchUsersAsync = useCallback(
    async (params: IFetchUsersParams) => {
      setFetching(true)

      const response = await fetchUsers(params)

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

      setFetching(false)
    },
    [ownId]
  )

  const onDeleteUser = async (id: number) => {
    setIsDeleting(true)

    const response = await deleteUser(id)

    if (response.success) {
      notification.success({ message: 'O usuário foi excluído com sucesso!' })
      setIsDeleting(false)
      setDeletionModal(null)
      fetchUsersAsync(initialFetchParams)
    } else if (response.error) {
      setIsDeleting(false)
      notification.error({ message: response.error.message })
    }
  }

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
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: IUser, b: IUser) => a.email.localeCompare(b.email),
      ...getFilterProps({
        dataIndex: 'email',
        inputOptions: { placeholder: 'E-mail' },
      }),
      filteredValue: searchFilters.email as unknown as FilterValue,
    },
    {
      title: 'Função',
      dataIndex: 'role',
      key: 'role',
      ...getFilterProps({
        dataIndex: 'role',
        inputOptions: {
          filterType: 'selection',
          selectionOptions: {
            items: roles,
          },
        },
        iconType: 'selection',
      }),
      filteredValue: searchFilters.role as unknown as FilterValue,
      render: (role: TRole, record: IUser) =>
        `${getTranslatedRole(role, true)}${record.is_admin ? ' / Admin' : ''}`,
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
              overlay: 'Clique para ver detalhes deste usuário',
              onClick: () => setUserDetailsModal({ data: user }),
            },
            {
              id: 'delete',
              overlay: user.is_admin
                ? 'Não é possível excluir este usuário pois ele também é um administrador'
                : 'Clique para excluir este usuário',
              disabled: !!user.is_admin,
              onClick: () =>
                setDeletionModal({
                  isVisible: true,
                  userName: user.name,
                  onOk: () => onDeleteUser(user.id),
                }),
            },
          ]}
        />
      ),
    },
  ]

  useEffect(() => {
    fetchUsersAsync(initialFetchParams)
  }, [])

  return (
    <PageContent>
      <UsersDrawer
        isVisible={drawer}
        onClose={() => setDrawer(false)}
        fetchUsers={() => fetchUsersAsync(initialFetchParams)}
      />
      <UserDetailsModal
        isVisible={!!userDetailsModal}
        data={userDetailsModal?.data}
        onCancel={() => setUserDetailsModal(null)}
      />
      <DeletionModal
        isVisible={deletionModal?.isVisible || false}
        onCancel={() => setDeletionModal(null)}
        onOk={deletionModal?.onOk}
        loading={isDeleting}
        userName={deletionModal?.userName || ''}
      />
      <TableHeader
        title="Usuários"
        newRecordButton={{
          visible: true,
          onClick: () => setDrawer(true),
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
              cpf: (filters?.cpf as unknown as string) || null,
              role: (filters?.role as unknown as TRole) || null,
              email: (filters?.email as unknown as string) || null,
              name: (filters?.name as unknown as string) || null,
            }

            setSearchFilters(search)
          }

          const payload = { ...pagination, ...search }

          await fetchUsersAsync({
            ...payload,
            page: payload.current || initialPagination.current,
            perPage: payload.pageSize || initialPagination.pageSize,
            order: sorting.order === 'ascend' ? 'asc' : 'desc',
            orderBy: sorting?.field?.toString(),
          })
        }}
        scroll={{ x: true }}
      />
    </PageContent>
  )
}
