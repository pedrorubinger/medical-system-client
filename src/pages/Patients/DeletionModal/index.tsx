import { useState } from 'react'
import { Modal, notification } from 'antd'

import { InsuranceName } from './styles'
import { deletePatient } from '../../../services/requests/patient'

interface IDeletePatientModalProps {
  /** @default false */
  isVisible: boolean
  /** @default undefined */
  id?: number | undefined
  /** @default undefined */
  patientName?: string | undefined
  refetchPatients: () => void
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const DeletePatientModal = ({
  id,
  isVisible = false,
  patientName = '',
  onCancel,
  refetchPatients,
}: IDeletePatientModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const onDelete = async () => {
    if (!id) {
      return null
    }

    setIsDeleting(true)

    const response = await deletePatient(id)

    setIsDeleting(false)

    if (response.success) {
      notification.success({ message: 'O paciente foi excluído com sucesso!' })
      onCancel()
      refetchPatients()
    }
  }

  return (
    <Modal
      visible={isVisible}
      confirmLoading={isDeleting}
      onOk={onDelete}
      onCancel={onCancel}
      title="Excluir Paciente"
      cancelText="Cancelar"
      okText="Sim, excluir"
      okButtonProps={{ danger: true }}>
      <p>
        Você tem certeza que pretende excluir permanentemente o paciente{' '}
        <InsuranceName>{patientName}</InsuranceName>?
      </p>
    </Modal>
  )
}
