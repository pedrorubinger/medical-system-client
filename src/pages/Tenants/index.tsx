import { useCallback, useEffect, useState } from 'react'
import { notification, Table, TablePaginationConfig } from 'antd'
import { FilterValue } from 'antd/lib/table/interface'

import { ITenant } from '../../interfaces/tenant'
import { getFilterProps } from '../../components/UI/FilterBox/Filter'
import { PageContent } from '../../components/UI/PageContent'
import { TableActions } from '../../components/UI/TableActions'
import { TableHeader } from '../../components/UI/TableHeader'
import {
  fetchTenants,
  IFetchTenantsParams,
} from '../../services/requests/tenant'
import { TenantModal } from './Modal'
import { CreateTenantDrawer } from './Drawer'
import { ListTenantUsers } from './Users'

type TModalType = 'delete' | 'toggle'

interface IFilters {
  name: string | null
}

interface IModalProps {
  type: TModalType
  isVisible: boolean
  isActive?: boolean
  id: number
  name: string
}

interface IListUsersDrawerProps {
  isVisible: boolean
  tenantName: string
  tenantId: number
}

const initialPagination = { current: 1, pageSize: 5 }
const initialFetchParams = {
  page: initialPagination.current,
  perPage: initialPagination.pageSize,
}
const initialFilters = { name: null }
const modalInitialProps = {
  type: 'delete' as TModalType,
  isVisible: false,
  name: '',
  id: -1,
}

export const Tenants = (): JSX.Element => {
  const [listUsersDrawer, setListUsersDrawer] =
    useState<IListUsersDrawerProps | null>(null)
  const [modal, setModal] = useState<IModalProps>(modalInitialProps)
  const [creationDrawer, setCreationDrawer] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [records, setRecords] = useState<ITenant[]>([])
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    ...initialPagination,
  })
  const [searchFilters, setSearchFilters] = useState<IFilters>(initialFilters)

  const columns = [
    {
      title: 'Nome da Clínica',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ITenant, b: ITenant) => a.name.localeCompare(b.name),
      ...getFilterProps({
        dataIndex: 'name',
        inputOptions: { placeholder: 'Nome' },
      }),
      filteredValue: searchFilters.name as unknown as FilterValue,
    },
    {
      title: 'Ativo',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: number | boolean) => (isActive ? 'Sim' : 'Não'),
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
      render: (_: string, tenant: ITenant) => (
        <TableActions
          options={[
            {
              id: 'users',
              overlay: 'Gerenciar os usuários dessa clínica',
              onClick: () =>
                setListUsersDrawer({
                  isVisible: true,
                  tenantId: tenant.id,
                  tenantName: tenant.name,
                }),
            },
            {
              id: 'repeat',
              overlay: tenant.is_active
                ? 'Tornar clínica inativa'
                : 'Tornar clínica ativa',
              onClick: () =>
                setModal({
                  isVisible: true,
                  type: 'toggle',
                  isActive: !tenant.is_active,
                  name: tenant.name,
                  id: tenant.id,
                }),
            },
            {
              id: 'delete',
              overlay: 'Excluir clínica',
              onClick: () =>
                setModal({
                  isVisible: true,
                  type: 'delete',
                  name: tenant.name,
                  id: tenant.id,
                }),
            },
          ]}
        />
      ),
    },
  ]

  const fetchTenantsAsync = useCallback(async (params: IFetchTenantsParams) => {
    setIsFetching(true)

    const response = await fetchTenants(params)

    if (response.error) {
      notification.error({
        message: response.error.message,
      })
    }

    if (response.data) {
      const tenants = response.data.data

      setRecords(tenants)

      if (response.data.meta) {
        setPagination((prevPagination) => ({
          ...prevPagination,
          current: response?.data?.meta?.current_page,
          total: response?.data?.meta?.total,
        }))
      }
    }

    setIsFetching(false)
  }, [])

  useEffect(() => {
    fetchTenantsAsync(initialFetchParams)
  }, [])

  return (
    <PageContent>
      <TenantModal
        type={modal?.type}
        isVisible={modal?.isVisible}
        id={modal?.id}
        name={modal?.name}
        isActive={modal?.isActive}
        onClose={() => setModal(modalInitialProps)}
        refetchData={async () => await fetchTenantsAsync(initialFetchParams)}
      />
      <ListTenantUsers
        tenantName={listUsersDrawer?.tenantName || ''}
        isVisible={listUsersDrawer?.isVisible || false}
        tenantId={listUsersDrawer?.tenantId || -1}
        onClose={() => setListUsersDrawer(null)}
      />
      <CreateTenantDrawer
        isVisible={creationDrawer}
        onClose={() => setCreationDrawer(false)}
        refetchData={async () => await fetchTenantsAsync(initialFetchParams)}
      />
      <TableHeader
        title="Clínicas"
        newRecordButton={{
          visible: true,
          onClick: () => setCreationDrawer(true),
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
              name: (filters?.name as unknown as string) || null,
            }

            setSearchFilters(search)
          }

          const payload = { ...pagination, ...search }

          await fetchTenantsAsync({
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
