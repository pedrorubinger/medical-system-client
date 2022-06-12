import { useCallback, useEffect, useState } from 'react'
import { notification, Table, TablePaginationConfig, Typography } from 'antd'
import { FilterValue } from 'antd/lib/table/interface'

import { getFilterProps } from '../../components/UI/FilterBox/Filter'
import { IPaymentMethod } from '../../interfaces/paymentMethod'
import { PageContent } from '../../components/UI/PageContent'
import { TableActions } from '../../components/UI/TableActions'
import { TableHeader } from '../../components/UI/TableHeader'
import {
  deletePaymentMethod,
  fetchPaymentMethods,
  IFetchPaymentMethodsParams,
} from '../../services/requests/paymentMethod'
import { PaymentMethodDrawer } from './Drawer'
import { DeletionModal } from './DeletionModal'
import { getSortOrder } from '../../utils/helpers/formatters'
import { InfoMessage } from './styles'

interface IFilter {
  name: string | null
}

interface IPaymentMethodDrawer {
  isVisible: boolean
  data?: IPaymentMethod
  type: 'create' | 'update'
}

interface IDeletionModalProps {
  isVisible: boolean
  paymentMethodName: string
  onOk: () => void
}

const initialPagination = { current: 1, pageSize: 5 }
const initialFetchParams = {
  page: initialPagination.current,
  perPage: initialPagination.pageSize,
}
const initialFilters: IFilter = { name: null }

export const PaymentMethods = (): JSX.Element => {
  const [records, setRecords] = useState<IPaymentMethod[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [searchFilters, setSearchFilters] = useState<IFilter>(initialFilters)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletionModal, setDeletionModal] =
    useState<IDeletionModalProps | null>(null)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    ...initialPagination,
  })
  const [drawer, setDrawer] = useState<IPaymentMethodDrawer | null>(null)

  const fetchPaymentMethodsAsync = useCallback(
    async (params: IFetchPaymentMethodsParams) => {
      setIsFetching(true)

      const response = await fetchPaymentMethods(params)

      if (response.data) {
        const paymentMethods = response.data

        setRecords(paymentMethods)

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

  const onDeletePaymentMethod = async (id: number) => {
    setIsDeleting(true)

    const response = await deletePaymentMethod(id)

    if (response.success) {
      notification.success({
        message: 'O método de pagamento foi excluído com sucesso!',
      })
      setIsDeleting(false)
      setDeletionModal(null)
      fetchPaymentMethodsAsync(initialFetchParams)
    } else if (response.error) {
      setIsDeleting(false)
    }
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: IPaymentMethod, b: IPaymentMethod) =>
        a.name.localeCompare(b.name),
      ...getFilterProps({
        dataIndex: 'name',
        inputOptions: { placeholder: 'Nome' },
      }),
      defaultSortOrder: getSortOrder(),
      filteredValue: searchFilters.name as unknown as FilterValue,
    },
    {
      title: 'Data de Cadastro',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
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
      render: (_: string, paymentMethod: IPaymentMethod) => (
        <TableActions
          options={[
            {
              id: 'edit',
              overlay: 'Editar método de pagamento',
              onClick: () =>
                setDrawer({
                  isVisible: true,
                  type: 'update',
                  data: paymentMethod,
                }),
            },
            {
              id: 'delete',
              overlay: 'Excluir método de pagamento',
              onClick: () =>
                setDeletionModal({
                  isVisible: true,
                  paymentMethodName: paymentMethod.name,
                  onOk: () => onDeletePaymentMethod(paymentMethod.id),
                }),
            },
          ]}
        />
      ),
    },
  ]

  useEffect(() => {
    fetchPaymentMethodsAsync(initialFetchParams)
  }, [])

  return (
    <PageContent>
      <PaymentMethodDrawer
        type={drawer?.type || 'create'}
        isVisible={drawer?.isVisible || false}
        data={drawer?.data}
        onClose={() => setDrawer(null)}
        fetchPaymentMethods={() => fetchPaymentMethodsAsync(initialFetchParams)}
      />
      <DeletionModal
        isVisible={deletionModal?.isVisible || false}
        onCancel={() => setDeletionModal(null)}
        onOk={deletionModal?.onOk}
        loading={isDeleting}
        paymentMethodName={deletionModal?.paymentMethodName || ''}
      />
      <TableHeader
        title="Métodos de Pagamento"
        newRecordButton={{
          visible: true,
          onClick: () => setDrawer({ isVisible: true, type: 'create' }),
        }}
      />
      <InfoMessage>
        Abaixo estão listados todos os métodos de pagamento atendidos pela
        clínica. Cada médico poderá, na página de{' '}
        <Typography.Text strong>Meus Dados</Typography.Text>, gerenciar os
        métodos de pagamento aceitos em suas consultas.
      </InfoMessage>
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

          await fetchPaymentMethodsAsync({
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
