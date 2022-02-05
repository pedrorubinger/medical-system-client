import { useCallback, useEffect, useState } from 'react'
import { notification, Table } from 'antd'
import { useSelector } from 'react-redux'

import { PageContent } from '../../components/UI/PageContent'
import { TableHeader } from '../../components/UI/TableHeader'
import { IUser } from '../../interfaces/user'
import { getTranslatedRole } from '../../utils/helpers/roles'
import { TRole } from '../../interfaces/roles'
import { UsersDrawer } from './Drawer'
import { TableActions } from '../../components/UI/TableActions'
import { deleteUser, fetchUsers } from '../../services/requests/user'
import { DeletionModal } from './DeletionModal'
import { RootState } from '../../store'

interface IDrawerProps {
  data?: IUser
  type: 'create' | 'update'
}

interface IDeletionModalProps {
  isVisible: boolean
  userName: string
  onOk: () => void
}

export const Users = (): JSX.Element => {
  const [records, setRecords] = useState<IUser[]>([])
  const [fetching, setFetching] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletionModal, setDeletionModal] =
    useState<IDeletionModalProps | null>(null)
  const [drawer, setDrawer] = useState<IDrawerProps | null>(null)
  const user = useSelector((state: RootState) => state.AuthReducer)
  const ownId = user.data.id

  const onDeleteUser = async (id: number) => {
    setIsDeleting(true)

    const response = await deleteUser(id)

    if (response.success) {
      notification.success({ message: 'O usuário foi excluído com sucesso!' })
      /** TO DO: Refetch records when pagination is implemented... */
      setRecords(
        [...records].filter((record) => record.id.toString() !== id.toString())
      )
      setDeletionModal(null)
    } else if (response.error) {
      notification.error({ message: response.error.message })
    }

    setIsDeleting(false)
  }

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
      render: (_: string, user: IUser) => (
        <TableActions
          options={[
            {
              id: 'delete',
              overlay: 'Clique para excluir este usuário',
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

  const fetchUsersAsync = useCallback(async () => {
    setFetching(true)

    const users = await fetchUsers()

    if (users) {
      setRecords(
        users.filter((user) => user.id.toString() !== ownId.toString())
      )
    }

    setFetching(false)
  }, [ownId])

  useEffect(() => {
    fetchUsersAsync()
  }, [])

  return (
    <PageContent>
      <UsersDrawer
        isVisible={!!drawer}
        onClose={() => setDrawer(null)}
        type={drawer?.type || 'create'}
        fetchUsers={fetchUsersAsync}
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
          onClick: () => setDrawer({ type: 'create' }),
        }}
      />
      <Table
        rowKey="id"
        dataSource={records}
        loading={fetching}
        scroll={{ x: true }}
        columns={columns}
      />
    </PageContent>
  )
}
