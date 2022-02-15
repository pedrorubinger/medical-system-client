import { useCallback, useEffect, useState } from 'react'
import { notification, Table, TablePaginationConfig } from 'antd'
import { FilterValue } from 'antd/lib/table/interface'

import { getFilterProps } from '../../components/UI/FilterBox/Filter'
import { ISpecialty } from '../../interfaces/specialty'
import { PageContent } from '../../components/UI/PageContent'
import { TableActions } from '../../components/UI/TableActions'
import { TableHeader } from '../../components/UI/TableHeader'
import {
  deleteSpecialty,
  fetchSpecialties,
  IFetchSpecialtiesParams,
} from '../../services/requests/specialty'
import { SpecialtyDrawer } from './Drawer'
import { DeletionModal } from './DeletionModal'

interface IFilter {
  name: string | null
}

interface ISpecialtyDrawer {
  isVisible: boolean
  type: 'create' | 'update'
  data?: ISpecialty
}

interface IDeletionModalProps {
  isVisible: boolean
  specialtyName: string
  onOk: () => void
}

const initialPagination = { current: 1, pageSize: 5 }
const initialFetchParams = {
  page: initialPagination.current,
  perPage: initialPagination.pageSize,
}
const initialFilters: IFilter = { name: null }

export const Specialties = (): JSX.Element => {
  const [records, setRecords] = useState<ISpecialty[]>([])
  const [fetching, setFetching] = useState(false)
  const [searchFilters, setSearchFilters] = useState<IFilter>(initialFilters)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletionModal, setDeletionModal] =
    useState<IDeletionModalProps | null>(null)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    ...initialPagination,
  })
  const [drawer, setDrawer] = useState<ISpecialtyDrawer | null>(null)

  const fetchSpecialtiesAsync = useCallback(
    async (params: IFetchSpecialtiesParams) => {
      setFetching(true)

      const response = await fetchSpecialties(params)

      if (response.data) {
        const specialties = response.data.data

        setRecords(specialties)

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
    []
  )

  const onDeleteSpecialty = async (id: number) => {
    setIsDeleting(true)

    const response = await deleteSpecialty(id)

    if (response.success) {
      notification.success({
        message: 'A especialidade foi excluída com sucesso!',
      })
      setDeletionModal(null)
      fetchSpecialtiesAsync(initialFetchParams)
    }

    setIsDeleting(false)
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ISpecialty, b: ISpecialty) => a.name.localeCompare(b.name),
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
      render: (_: string, specialty: ISpecialty) => (
        <TableActions
          options={[
            {
              id: 'edit',
              overlay: 'Clique para editar esta especialidade',
              onClick: () =>
                setDrawer({ isVisible: true, type: 'update', data: specialty }),
            },
            {
              id: 'delete',
              overlay: 'Clique para excluir esta especialidade',
              onClick: () =>
                setDeletionModal({
                  isVisible: true,
                  specialtyName: specialty.name,
                  onOk: () => onDeleteSpecialty(specialty.id),
                }),
            },
          ]}
        />
      ),
    },
  ]

  useEffect(() => {
    fetchSpecialtiesAsync(initialFetchParams)
  }, [])

  return (
    <PageContent>
      <SpecialtyDrawer
        type={drawer?.type || 'create'}
        isVisible={drawer?.isVisible || false}
        data={drawer?.data}
        onClose={() => setDrawer(null)}
        fetchSpecialties={() => fetchSpecialtiesAsync(initialFetchParams)}
      />
      <DeletionModal
        isVisible={deletionModal?.isVisible || false}
        onCancel={() => setDeletionModal(null)}
        onOk={deletionModal?.onOk}
        loading={isDeleting}
        specialtyName={deletionModal?.specialtyName || ''}
      />
      <TableHeader
        title="Especialidades"
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

          await fetchSpecialtiesAsync({
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
