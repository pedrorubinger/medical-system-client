import { useCallback, useEffect, useState } from 'react'
import { notification, Table, TablePaginationConfig } from 'antd'
import { FilterValue } from 'antd/lib/table/interface'

import { getFilterProps } from '../../components/UI/FilterBox/Filter'
import { IInsurance } from '../../interfaces/insurance'
import { PageContent } from '../../components/UI/PageContent'
import { TableActions } from '../../components/UI/TableActions'
import { TableHeader } from '../../components/UI/TableHeader'
import {
  deleteInsurance,
  fetchInsurances,
  IFetchInsurancesParams,
} from '../../services/requests/insurance'
import { InsuranceDrawer } from './Drawer'
import { DeletionModal } from './DeletionModal'

interface IFilter {
  name: string | null
}

interface IInsuranceDrawer {
  isVisible: boolean
  type: 'create' | 'update'
  data?: IInsurance
}

interface IDeletionModalProps {
  isVisible: boolean
  insuranceName: string
  onOk: () => void
}

const initialPagination = { current: 1, pageSize: 5 }
const initialFetchParams = {
  page: initialPagination.current,
  perPage: initialPagination.pageSize,
}
const initialFilters: IFilter = { name: null }

export const Insurances = (): JSX.Element => {
  const [records, setRecords] = useState<IInsurance[]>([])
  const [fetching, setFetching] = useState(false)
  const [searchFilters, setSearchFilters] = useState<IFilter>(initialFilters)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletionModal, setDeletionModal] =
    useState<IDeletionModalProps | null>(null)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    ...initialPagination,
  })
  const [drawer, setDrawer] = useState<IInsuranceDrawer | null>(null)

  const fetchInsurancesAsync = useCallback(
    async (params: IFetchInsurancesParams) => {
      setFetching(true)

      const response = await fetchInsurances(params)

      if (response.data) {
        const insurances = response.data

        setRecords(insurances)

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

  const onDeleteInsurance = async (id: number) => {
    setIsDeleting(true)

    const response = await deleteInsurance(id)

    if (response.success) {
      notification.success({ message: 'O convênio foi excluído com sucesso!' })
      setIsDeleting(false)
      setDeletionModal(null)
      fetchInsurancesAsync(initialFetchParams)
    } else if (response.error) {
      setIsDeleting(false)
    }
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: IInsurance, b: IInsurance) => a.name.localeCompare(b.name),
      ...getFilterProps({
        dataIndex: 'name',
        inputOptions: { placeholder: 'Nome' },
      }),
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
      render: (_: string, insurance: IInsurance) => (
        <TableActions
          options={[
            {
              id: 'edit',
              overlay: 'Clique para editar este convênio',
              onClick: () =>
                setDrawer({ isVisible: true, type: 'update', data: insurance }),
            },
            {
              id: 'delete',
              overlay: 'Clique para excluir este convênio',
              onClick: () =>
                setDeletionModal({
                  isVisible: true,
                  insuranceName: insurance.name,
                  onOk: () => onDeleteInsurance(insurance.id),
                }),
            },
          ]}
        />
      ),
    },
  ]

  useEffect(() => {
    fetchInsurancesAsync(initialFetchParams)
  }, [])

  return (
    <PageContent>
      <InsuranceDrawer
        type={drawer?.type || 'create'}
        isVisible={drawer?.isVisible || false}
        data={drawer?.data}
        onClose={() => setDrawer(null)}
        fetchInsurances={() => fetchInsurancesAsync(initialFetchParams)}
      />
      <DeletionModal
        isVisible={deletionModal?.isVisible || false}
        onCancel={() => setDeletionModal(null)}
        onOk={deletionModal?.onOk}
        loading={isDeleting}
        insuranceName={deletionModal?.insuranceName || ''}
      />
      <TableHeader
        title="Convênios da Clínica"
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
            }

            setSearchFilters(search)
          }

          const payload = { ...pagination, ...search }

          await fetchInsurancesAsync({
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
