import { useState } from 'react'
import { Modal, notification } from 'antd'

import { Strong } from './styles'
import { deleteAppointment } from '../../../services/requests/appointment'

interface IDeleteAppointmentModalProps {
  /** @default false */
  isVisible: boolean
  /** @default undefined */
  id?: number | undefined
  /** @default undefined */
  patientName?: string | undefined
  datetime: string
  refetchAppointments: () => void
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const DeleteAppointmentModal = ({
  id,
  isVisible = false,
  datetime,
  patientName = '',
  onCancel,
  refetchAppointments,
}: IDeleteAppointmentModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const onDelete = async () => {
    if (!id) {
      return null
    }

    setIsDeleting(true)

    const response = await deleteAppointment(id)

    setIsDeleting(false)

    if (response.success) {
      notification.success({ message: 'A consulta foi excluída com sucesso!' })
      onCancel()
      refetchAppointments()
    }
  }

  if (!id) {
    return null
  }

  return (
    <Modal
      visible={isVisible}
      confirmLoading={isDeleting}
      onOk={onDelete}
      onCancel={onCancel}
      title="Excluir Consulta"
      cancelText="Cancelar"
      okText="Sim, excluir"
      okButtonProps={{ danger: true }}>
      <p>
        Você tem certeza que pretende excluir permanentemente a consulta do dia{' '}
        <Strong>{datetime}</Strong> do paciente <Strong>{patientName}</Strong>?
      </p>
    </Modal>
  )
}
