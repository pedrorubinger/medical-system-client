import { useCallback, useEffect, useState } from 'react'
import { Table, TablePaginationConfig, Typography } from 'antd'
import { useSelector } from 'react-redux'

import { InfoMessage } from './styles'
import { RootState } from '../../../store'
import { IPagination } from '../../../interfaces/api'
import { IScheduleDaysOff } from '../../../interfaces/scheduleDaysOff'
import { fetchScheduleDaysOffByDoctor } from '../../../services/requests/scheduleDaysOff'
import { PageContent } from '../../../components/UI/PageContent'
import { TableHeader } from '../../../components/UI/TableHeader'
import { ScheduleDaysOffDrawer as Drawer } from './Drawer'
import { DeleteScheduleDayOffModal } from './DeletionModal'
import { TableActions } from '../../../components/UI/TableActions'

interface IDrawerProps {
  isVisible: boolean
  type: 'create' | 'update'
}

const initialPagination = { current: 1, pageSize: 5 }

export const ScheduleDaysOff = () => {
  const user = useSelector((state: RootState) => state.AuthReducer)
  const doctorId = user?.data?.doctor?.id
  const [records, setRecords] = useState<IScheduleDaysOff[]>([])
  const [deletionModal, setDeletionModal] = useState<{
    isVisible: boolean
    id: number
  } | null>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    ...initialPagination,
  })
  const [drawer, setDrawer] = useState<IDrawerProps | null>(null)

  const columns = [
    {
      title: 'Data Inicial',
      dataIndex: 'datetime_start',
      key: 'datetime_start',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Data Final',
      dataIndex: 'datetime_end',
      key: 'datetime_end',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Ações',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: string, { id, datetime_end }: IScheduleDaysOff) => (
        <TableActions
          options={[
            {
              id: 'delete',
              overlay: 'Excluir folga/ausência',
              disabled:
                Date.parse(datetime_end) < Date.parse(new Date().toString()),
              onClick: () => setDeletionModal({ isVisible: true, id }),
            },
          ]}
        />
      ),
    },
  ]

  const fetchScheduleDaysOffAsync = useCallback(async (params: IPagination) => {
    setIsFetching(true)

    const response = await fetchScheduleDaysOffByDoctor({ ...params, doctorId })

    if (response.data) {
      const scheduleDaysOff = response.data

      setRecords(scheduleDaysOff)

      if (response.meta) {
        setPagination((prevPagination) => ({
          ...prevPagination,
          current: response.meta?.current_page,
          total: response.meta?.total,
        }))
      }
    }

    setIsFetching(false)
  }, [])

  useEffect(() => {
    fetchScheduleDaysOffAsync({
      page: initialPagination.current,
      perPage: initialPagination.pageSize,
    })
  }, [])

  return (
    <PageContent margin="30px 0">
      <DeleteScheduleDayOffModal
        isVisible={deletionModal?.isVisible || false}
        id={deletionModal?.id}
        refetchData={() =>
          fetchScheduleDaysOffAsync({
            page: initialPagination.current,
            perPage: initialPagination.pageSize,
          })
        }
        onCancel={() => setDeletionModal(null)}
      />
      <Drawer
        isVisible={drawer?.isVisible || false}
        type={drawer?.type || 'create'}
        refetchData={() =>
          fetchScheduleDaysOffAsync({
            page: initialPagination.current,
            perPage: initialPagination.pageSize,
          })
        }
        onClose={() => setDrawer(null)}
      />
      <TableHeader
        title="Férias, Folgas e Ausências"
        margin="0 0 5px 0"
        newRecordButton={{
          onClick: () => setDrawer({ isVisible: true, type: 'create' }),
          visible: true,
        }}
      />
      <InfoMessage>
        Você pode selecionar os dias específicos de sua agenda em que você não
        atuará. Para isso, você deve selecionar a{' '}
        <Typography.Text strong>data de início</Typography.Text> e a{' '}
        <Typography.Text strong>data de fim</Typography.Text> de sua ausência.
        As consultas só poderão ser agendadas a partir do dia e horário final da
        sua folga ou ausência.
      </InfoMessage>
      <Table
        rowKey="id"
        loading={isFetching}
        columns={columns}
        dataSource={records}
        pagination={pagination}
        onChange={async (pagination) => {
          const payload = { ...pagination }

          await fetchScheduleDaysOffAsync({
            ...payload,
            page: payload.current || initialPagination.current,
            perPage: payload.pageSize || initialPagination.pageSize,
          })
        }}
        scroll={{ x: !records?.length ? undefined : true }}
      />
    </PageContent>
  )
}
