import { Modal } from 'antd'

import { SpecialtyName } from './styles'

interface IDeletionModalProps {
  isVisible: boolean
  specialtyName: string
  /** @default false */
  loading?: boolean
  onOk?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onCancel?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const DeletionModal = ({
  isVisible,
  specialtyName,
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
      title="Excluir Especialidade"
      cancelText="Cancelar"
      okText="Sim, excluir"
      okButtonProps={{ danger: true }}>
      <p>
        Você tem certeza que pretende excluir permanentemente a especialidade{' '}
        <SpecialtyName>{specialtyName}</SpecialtyName>?
      </p>
    </Modal>
  )
}
