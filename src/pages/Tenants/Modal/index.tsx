import { useState } from 'react'
import { Modal, notification, Typography } from 'antd'

import { deleteTenant, updateTenant } from '../../../services/requests/tenant'

interface ITenantModal {
  type: 'delete' | 'toggle'
  /** @default false */
  isVisible: boolean
  name: string
  id: number
  isActive?: boolean
  onClose: () => void
  refetchData: () => Promise<void>
}

export const TenantModal = ({
  isVisible = false,
  isActive,
  name,
  id,
  type,
  onClose,
  refetchData,
}: ITenantModal) => {
  const [isLoading, setIsLoading] = useState(false)

  const onDelete = async () => {
    setIsLoading(true)

    const response = await deleteTenant(id)

    if (response.success) {
      notification.success({ message: 'A clínica foi excluída com sucesso!' })
      setIsLoading(false)
      refetchData()
      onClose()
    } else if (response.error) {
      setIsLoading(false)
    }
  }

  const onToggleStatus = async () => {
    setIsLoading(true)

    const response = await updateTenant({ id, is_active: isActive })

    if (response.tenant) {
      notification.success({
        message: `Feito! A clínica ${name} agora está ${
          isActive ? 'ativa' : 'inativa'
        }!`,
      })
      setIsLoading(false)
      refetchData()
      onClose()
    } else if (response.error) {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      cancelText="Cancelar"
      confirmLoading={isLoading}
      visible={isVisible}
      okButtonProps={{ danger: type === 'delete' }}
      title={type === 'delete' ? 'Excluir Clínica' : 'Alterar Status'}
      okText={type === 'delete' ? 'Sim, excluir' : 'Sim, alterar status'}
      onOk={type === 'delete' ? onDelete : onToggleStatus}
      onCancel={onClose}
      destroyOnClose>
      {type === 'delete' ? (
        <Typography.Text>
          <Typography.Text strong>Atenção</Typography.Text>: essa ação é
          irreversível e afetará todos os usuários e dados relacionados a esta
          clínica. Você tem certeza que deseja excluir permanentemente a clínica{' '}
          <Typography.Text strong>{name}</Typography.Text>?
        </Typography.Text>
      ) : (
        <Typography.Text>
          Você tem certeza que deseja alterar o status da clínica{' '}
          <Typography.Text strong>{name}</Typography.Text> de{' '}
          <Typography.Text strong>
            {isActive ? 'Inativo' : 'Ativo'}
          </Typography.Text>{' '}
          para{' '}
          <Typography.Text strong>
            {isActive ? 'Ativo' : 'Inativo'}
          </Typography.Text>
          ?
        </Typography.Text>
      )}
    </Modal>
  )
}
