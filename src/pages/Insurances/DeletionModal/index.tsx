import { Modal } from 'antd'

import { InsuranceName } from './styles'

interface IDeletionModalProps {
  isVisible: boolean
  insuranceName: string
  /** @default false */
  loading?: boolean
  onOk?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onCancel?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const DeletionModal = ({
  isVisible,
  insuranceName,
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
      title="Excluir Convênio"
      cancelText="Cancelar"
      okText="Sim, excluir"
      okButtonProps={{ danger: true }}>
      <p>
        Você tem certeza que pretende excluir permanentemente o convênio{' '}
        <InsuranceName>{insuranceName}</InsuranceName>?
      </p>
    </Modal>
  )
}
