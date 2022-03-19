import { useCallback, useEffect, useState } from 'react'
import { Drawer, notification, Table, TablePaginationConfig } from 'antd'
import { useSelector } from 'react-redux'
import { FilterValue } from 'antd/lib/table/interface'

import { RootState } from '../../../store'
import { IUser } from '../../../interfaces/user'
import { TRole } from '../../../interfaces/roles'
import { getTranslatedRole } from '../../../utils/helpers/roles'
import { getDrawerWidth } from '../../../utils/helpers/formatters'
import { getFilterProps } from '../../../components/UI/FilterBox/Filter'
import { TableHeader } from '../../../components/UI/TableHeader'
import { UserDetailsModal } from '../../../components/Forms/User/UserDetailsModal'
import { TableActions } from '../../../components/UI/TableActions'
import { CreateTenantUserDrawer } from './CreateUserDrawer'
import { DeletionModal } from '../../Users/DeletionModal'
import {
  deleteTenantUser,
  fetchTenantUsers,
  IFetchTenantUserParams,
} from '../../../services/requests/tenantUser'

interface IListTenantUsersProps {
  tenantId: number
  /** @default false */
  isVisible: boolean
  tenantName: string
  onClose: () => void
}

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

export const ListTenantUsers = ({
  tenantId,
  isVisible,
  tenantName,
  onClose,
}: IListTenantUsersProps): JSX.Element => {
  const [records, setRecords] = useState<IUser[]>([])
  const [isFetching, setIsFetching] = useState(false)
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
  const loggedUser = useSelector((state: RootState) => state.AuthReducer)

  /**
   * Validates if the specified user can be deleted by the user who's logged in based in system's business rules.
   * @param userToBeDeleted User to be deleted.
   * @returns true or false.
   */
  const canDeleteUser = (userToBeDeleted: IUser): boolean => {
    if (userToBeDeleted.is_master) {
      return false
    }

    if (loggedUser.data.is_master) {
      return true
    }

    if (loggedUser.data.role !== 'developer' && userToBeDeleted.is_admin) {
      return false
    }

    return true
  }

  const fetchUsersAsync = useCallback(
    async (params: IFetchTenantUserParams) => {
      setIsFetching(true)

      const response = await fetchTenantUsers(params, {
        id: tenantId,
        ownerTenant: false,
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
    [tenantId]
  )

  const onDeleteUser = async (id: number) => {
    setIsDeleting(true)

    const response = await deleteTenantUser(id, {
      id: tenantId,
      ownerTenant: false,
    })

    if (response.success) {
      notification.success({ message: 'O usuário foi excluído com sucesso!' })
      setIsDeleting(false)
      setDeletionModal(null)
      fetchUsersAsync(initialFetchParams)
    } else if (response.error) {
      setIsDeleting(false)
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
              overlay: !canDeleteUser(user)
                ? 'Não é possível excluir este usuário'
                : 'Clique para excluir este usuário',
              disabled: !canDeleteUser(user),
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
    if (isVisible) {
      fetchUsersAsync(initialFetchParams)
    }
  }, [isVisible])

  return (
    <Drawer
      title={`Usuários da Clínica ${tenantName}`}
      visible={isVisible}
      width={getDrawerWidth()}
      onClose={onClose}
      destroyOnClose>
      <CreateTenantUserDrawer
        tenantId={tenantId}
        isVisible={drawer}
        onClose={() => setDrawer(false)}
        fetchUsers={async () => await fetchUsersAsync(initialFetchParams)}
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
        loading={isFetching}
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
        scroll={{ x: !records?.length ? undefined : true }}
      />
    </Drawer>
  )
}
