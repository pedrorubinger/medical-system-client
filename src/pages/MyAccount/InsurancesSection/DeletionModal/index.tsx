import { useState } from 'react'
import { Modal, notification, Typography } from 'antd'
import {
  manageDoctorInsurance,
  TManageDoctorInsuranceFlag,
} from '../../../../services/requests/doctor'
import { IDoctorInsurance } from '../../../../interfaces/doctor'

interface IDeleteMyInsuranceModal {
  /** @default false */
  isVisible?: boolean | undefined
  id?: number | undefined
  name?: string | undefined
  doctorId?: number | undefined
  onCancel: () => void
  setRecords: React.Dispatch<React.SetStateAction<IDoctorInsurance[]>>
}

export const DeleteMyInsuranceModal = ({
  id,
  isVisible = false,
  name,
  doctorId,
  setRecords,
  onCancel,
}: IDeleteMyInsuranceModal) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const onDelete = async () => {
    if (!id || !doctorId) {
      return null
    }

    setIsDeleting(true)

    const payload = {
      id: doctorId,
      flag: 'dettach' as TManageDoctorInsuranceFlag,
      insurances: [{ insurance_id: id, price: 0 }],
    }
    const response = await manageDoctorInsurance(payload)

    if (response.error) {
      setIsDeleting(false)
    } else {
      notification.success({
        message: 'O convênio foi excluído com sucesso!',
      })
      setIsDeleting(false)
      setRecords((prev) =>
        [...prev].filter(
          (insurance) => insurance.id.toString() !== id.toString()
        )
      )
      onCancel()
    }
  }

  return (
    <Modal
      title="Remover Convênio"
      cancelText="Cancelar"
      okText="Sim, remover"
      visible={isVisible}
      confirmLoading={isDeleting}
      onOk={onDelete}
      onCancel={onCancel}
      destroyOnClose>
      Você tem certeza que pretende remover o convênio{' '}
      <Typography.Text strong>{name}</Typography.Text>?
    </Modal>
  )
}
