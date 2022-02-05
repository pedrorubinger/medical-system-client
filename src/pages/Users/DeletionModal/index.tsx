import { Modal } from 'antd'

import { UserName } from './styles'

interface IDeletionModalProps {
  isVisible: boolean
  userName: string
  /** @default false */
  loading?: boolean
  onOk?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onCancel?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const DeletionModal = ({
  isVisible,
  userName,
  loading = true,
  onOk,
  onCancel,
}: IDeletionModalProps) => {
  return (
    <Modal
      visible={isVisible}
      confirmLoading={loading}
      onOk={onOk}
      onCancel={onCancel}
      title="Excluir Usuário"
      cancelText="Cancelar"
      okText="Sim, excluir"
      okButtonProps={{ danger: true }}>
      <p>
        Você tem certeza que pretende excluir permanentemente o usuário{' '}
        <UserName>{userName}</UserName>?
      </p>
    </Modal>
  )
}
