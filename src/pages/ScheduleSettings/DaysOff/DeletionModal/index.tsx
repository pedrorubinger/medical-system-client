import { useState } from 'react'
import { Modal, notification } from 'antd'

import { deleteScheduleDayOff } from '../../../../services/requests/scheduleDaysOff'

interface IDeleteScheduleDayOffModalProps {
  /** @default false */
  isVisible: boolean
  /** @default undefined */
  id?: number | undefined
  refetchData: () => void
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void | undefined
}

export const DeleteScheduleDayOffModal = ({
  isVisible,
  id,
  onCancel,
  refetchData,
}: IDeleteScheduleDayOffModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const onDeleteDayOff = async () => {
    if (!id) {
      return null
    }

    setIsDeleting(true)

    const response = await deleteScheduleDayOff(id)

    if (response.success) {
      notification.success({
        message: 'A folga/ausência foi excluída com sucesso!',
      })
      setIsDeleting(false)
      refetchData()
      onCancel()
    } else if (response.error) {
      setIsDeleting(false)
    }
  }

  return (
    <Modal
      visible={isVisible}
      confirmLoading={isDeleting}
      onOk={onDeleteDayOff}
      onCancel={onCancel}
      title="Excluir Folga"
      cancelText="Cancelar"
      okText="Sim, excluir"
      okButtonProps={{ danger: true }}>
      <p>
        Você tem certeza que pretende excluir essa folga/ausência? Se sim, este
        intervalo de horário passará a estar disponível para agendamento de
        consultas.
      </p>
    </Modal>
  )
}
