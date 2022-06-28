import { useState } from 'react'
import { Modal, notification, Typography } from 'antd'

import { deleteAppointmentFile } from '../../../../services/requests/appointmentFile'
import { getDrawerWidth } from '../../../../utils/helpers/formatters'

interface IModalData {
  name: string
  id: number
}

interface IDeleteAppointmentFileModalProps {
  /** @default false */
  isVisible?: boolean
  data?: IModalData
  onCancel: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void
  removeFileFromList?: () => void
}

export const DeleteAppointmentFileModal = ({
  isVisible = false,
  data,
  onCancel,
  removeFileFromList,
}: IDeleteAppointmentFileModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isVisible || !data) {
    return null
  }

  const onConfirm = async () => {
    setIsDeleting(true)

    const response = await deleteAppointmentFile(data.id, false)

    setIsDeleting(false)

    if (response.data) {
      if (removeFileFromList) {
        removeFileFromList()
      }

      notification.success({ message: 'O arquivo foi excluído com sucesso!' })
      onCancel()
    }
  }

  return (
    <Modal
      visible={isVisible}
      width={getDrawerWidth(450)}
      onCancel={onCancel}
      onOk={onConfirm}
      cancelButtonProps={{
        disabled: isDeleting,
      }}
      okButtonProps={{
        danger: true,
        disabled: isDeleting,
        loading: isDeleting,
      }}
      cancelText="Cancelar"
      okText="Sim, excluir"
      title="Excluir Arquivo"
      destroyOnClose>
      <Typography.Text>
        Você tem certeza que pretende excluir permanentemente o arquivo{' '}
        <Typography.Text strong>{data?.name}</Typography.Text>?
      </Typography.Text>
    </Modal>
  )
}
