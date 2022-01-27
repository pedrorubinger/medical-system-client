import { useEffect, useState } from 'react'
import { notification, Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { Creators } from '../../store/ducks/user/reducer'
import { PageContent } from '../../components/UI/PageContent'
import { TableHeader } from '../../components/UI/TableHeader'
import { RootState } from '../../store'
import { IUser } from '../../interfaces/user'
import { getTranslatedRole } from '../../utils/helpers/roles'
import { TRole } from '../../interfaces/roles'

export const Users = (): JSX.Element => {
  const dispatch = useDispatch()
  const [records, setRecords] = useState<IUser[]>([])
  const { loading, users, error } = useSelector(
    (state: RootState) => state.UserReducer
  )

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Função',
      dataIndex: 'role',
      key: 'role',
      render: (role: TRole) => getTranslatedRole(role, true),
    },
    {
      title: 'Telefone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Data de Registro',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ]

  useEffect(() => {
    dispatch(Creators.fetchUsers())
  }, [])

  useEffect(() => {
    if (users) {
      setRecords(users)
      dispatch(Creators.clearUsers())
    }
  }, [users])

  useEffect(() => {
    if (error) {
      notification.error({ message: error.message })
    }
  }, [error])

  return (
    <PageContent>
      <TableHeader
        title="Usuários"
        newRecordButton={{
          visible: true,
          onClick: () => console.log('clicked to add new user'),
        }}
      />
      <Table
        rowKey="id"
        dataSource={records}
        loading={loading}
        scroll={{ x: true }}
        columns={columns}
      />
    </PageContent>
  )
}
