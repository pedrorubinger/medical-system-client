import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal, notification, Typography } from 'antd'

import { deleteTenantUser } from '../../../services/requests/tenantUser'
import { RootState } from '../../../store'

interface IDeleteTenantUserModal {
  /** @default false */
  isVisible: boolean
  name: string
  id: number
  onClose: () => void
  refetchData: () => Promise<void>
}

export const DeleteTenantUserModal = ({
  isVisible = false,
  name,
  id,
  onClose,
  refetchData,
}: IDeleteTenantUserModal) => {
  const user = useSelector((state: RootState) => state.AuthReducer)
  const [isLoading, setIsLoading] = useState(false)

  const onDelete = async () => {
    setIsLoading(true)

    const response = await deleteTenantUser(id, {
      ownerTenant: !!user?.data?.is_master,
    })

    if (response.success) {
      notification.success({
        message: 'O administrador(a) foi excluído com sucesso!',
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
      title="Excluir Administrador(a)"
      okText="Sim, excluir"
      confirmLoading={isLoading}
      okButtonProps={{ danger: true }}
      visible={isVisible}
      onOk={onDelete}
      onCancel={onClose}
      destroyOnClose>
      <Typography.Text>
        Você tem certeza que deseja excluir permanentemente o usuário
        administrador(a) <Typography.Text strong>{name}</Typography.Text>?
      </Typography.Text>
    </Modal>
  )
}
