import { Table } from 'antd'
import { PageContent } from '../../components/UI/PageContent'
import { TableHeader } from '../../components/UI/TableHeader'

export const Users = (): JSX.Element => {
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
    },
    {
      title: 'Data de Registro',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ]

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
        dataSource={[]}
        scroll={{ x: true }}
        columns={columns}
      />
    </PageContent>
  )
}
