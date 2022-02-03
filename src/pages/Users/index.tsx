import { useEffect, useState } from 'react'
import { Table } from 'antd'

import { PageContent } from '../../components/UI/PageContent'
import { TableHeader } from '../../components/UI/TableHeader'
import { IUser } from '../../interfaces/user'
import { getTranslatedRole } from '../../utils/helpers/roles'
import { TRole } from '../../interfaces/roles'
import { UsersDrawer } from './Drawer'
import { TableActions } from '../../components/UI/TableActions'
import { fetchUsers } from '../../services/requests/user'

interface IDrawerProps {
  data?: IUser
  type: 'create' | 'update'
}

export const Users = (): JSX.Element => {
  const [records, setRecords] = useState<IUser[]>([])
  const [loading, setLoading] = useState(false)
  const [drawer, setDrawer] = useState<IDrawerProps | null>(null)

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
    {
      title: 'Ações',
      dataIndex: 'actions',
      key: 'actions',
      render: () => <TableActions />,
    },
  ]

  useEffect(() => {
    ;(async () => {
      setLoading(true)

      const users = await fetchUsers()

      if (users) {
        setRecords(users)
      }

      setLoading(false)
    })()
  }, [])

  return (
    <PageContent>
      <UsersDrawer
        isVisible={!!drawer}
        onClose={() => setDrawer(null)}
        type={drawer?.type || 'create'}
      />
      <TableHeader
        title="Usuários"
        newRecordButton={{
          visible: true,
          onClick: () => setDrawer({ type: 'create' }),
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
