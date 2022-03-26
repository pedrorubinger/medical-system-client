import { Modal } from 'antd'

import { PaymentMethodName } from './styles'

interface IDeletionModalProps {
  isVisible: boolean
  paymentMethodName: string
  /** @default false */
  loading?: boolean
  onOk?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onCancel?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const DeletionModal = ({
  isVisible,
  paymentMethodName,
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
      title="Excluir Método de Pagamento"
      cancelText="Cancelar"
      okText="Sim, excluir"
      okButtonProps={{ danger: true }}>
      <p>
        Você tem certeza que pretende excluir permanentemente o método de
        pagamento <PaymentMethodName>{paymentMethodName}</PaymentMethodName>?
      </p>
    </Modal>
  )
}
