import { useState } from 'react'
import { Modal, notification } from 'antd'

import { Strong } from './styles'
import { confirmAppointment } from '../../services/requests/appointment'

interface IConfirmAppointmentModalProps {
  /** @default false */
  isVisible: boolean
  /** @default undefined */
  id?: number | undefined
  /** @default undefined */
  patientName?: string | undefined
  /** @default undefined */
  doctorId?: number | undefined
  datetime: string
  refetchAppointments: () => void
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const ConfirmAppointmentModal = ({
  id,
  isVisible = false,
  doctorId,
  datetime,
  patientName = '',
  onCancel,
  refetchAppointments,
}: IConfirmAppointmentModalProps) => {
  const [isConfirming, setIsConfirming] = useState(false)

  const onConfirm = async () => {
    if (!id) {
      return null
    }

    setIsConfirming(true)

    const response = await confirmAppointment(id, {
      doctor_id: doctorId,
      status: 'confirmed',
    })

    setIsConfirming(false)

    if (response.appointment) {
      notification.success({
        message: 'A consulta foi confirmada com sucesso!',
      })
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
      confirmLoading={isConfirming}
      onOk={onConfirm}
      onCancel={onCancel}
      title="Confirmar Consulta"
      cancelText="Cancelar"
      okText="Sim, confirmar">
      <p>
        Você tem certeza que pretende confirmar a consulta do dia{' '}
        <Strong>{datetime}</Strong> do paciente <Strong>{patientName}</Strong>?
      </p>
    </Modal>
  )
}
