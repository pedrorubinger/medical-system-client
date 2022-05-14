import { Drawer, notification } from 'antd'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { storePatient, updatePatient } from '../../../services/requests/patient'
import { IPatient, TPatientData } from '../../../interfaces/patient'
import { IAddress } from '../../../interfaces/address'
import { setFieldErrors } from '../../../utils/helpers/errors'
import {
  patientAndAddressSchema,
  PatientForm,
} from '../../../components/Forms/Patient'

interface IPatientDrawerProps {
  isVisible: boolean
  type: 'update' | 'create'
  data?: IPatient | undefined
  onClose: () => void
  fetchPatients: () => void
}

interface IPatientFormValues extends TPatientData, IAddress {
  include_address: boolean
  location?: string | undefined
}

export const PatientDrawer = ({
  data,
  isVisible,
  type,
  onClose,
  fetchPatients,
}: IPatientDrawerProps) => {
  const defaultValues = {
    include_address: !!data?.address,
    name: data?.name || '',
    cpf: data?.cpf || '',
    birthdate: data?.birthdate?.split('T')?.[0] || '',
    primary_phone: data?.primary_phone || '',
    mother_name: data?.mother_name || '',
    father_name: data?.father_name || '',
    secondary_phone: data?.secondary_phone || '',
    email: data?.email || '',
    street: data?.address?.street || '',
    number: data?.address?.number || '',
    neighborhood: data?.address?.neighborhood || '',
    postal_code: data?.address?.postal_code || '',
    complement: data?.address?.complement || '',
  }
  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IPatientFormValues>({
    defaultValues,
    resolver: yupResolver(patientAndAddressSchema),
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const watchedAddressCheckbox = watch('include_address', !!data?.address_id)
  const watchedLocation = watch('location', '')
  const isEditing = type === 'update'
  const isCreating = type === 'create'

  const closeDrawer = () => {
    reset()
    onClose()
  }

  const onSubmit = async (values: IPatientFormValues): Promise<void> => {
    if (isEditing && !data?.id) {
      return
    }

    const payload: TPatientData = {
      name: values.name,
      birthdate: values.birthdate,
      cpf: values.cpf,
      primary_phone: values.primary_phone,
      secondary_phone: values.secondary_phone || undefined,
      email:
        isEditing && values.email === data?.email
          ? undefined
          : values.email || undefined,
      mother_name: values.mother_name,
      father_name: values.father_name || undefined,
      address: undefined,
    }

    if (values.include_address) {
      payload.address = {
        street: values.street,
        number: values.number,
        neighborhood: values.neighborhood,
        postal_code: values.postal_code?.replace(/\D/g, ''),
        complement: values.complement,
      }

      if (isEditing && data?.address?.id) {
        payload.address.id = data.address.id
      }
    }

    const response = isEditing
      ? await updatePatient(data?.id || 0, {
          ...payload,
          cpf: values.cpf === data?.cpf ? undefined : values.cpf,
        })
      : await storePatient(payload)

    if (response.error) {
      setFieldErrors(setError, response.error)
      return
    }

    notification.success({
      message: isCreating
        ? 'O paciente foi cadastrado com sucesso!'
        : 'Os dados do paciente foram atualizados com sucesso!',
    })
    closeDrawer()
    fetchPatients()
  }

  const resetDefaultValues = () => reset(defaultValues)

  return (
    <Drawer
      visible={isVisible}
      title={isCreating ? 'Cadastrar Paciente' : 'Atualizar Dados'}
      width={450}
      onClose={closeDrawer}>
      <PatientForm
        type={type}
        data={data}
        control={control}
        errors={errors}
        watchedAddressCheckbox={watchedAddressCheckbox}
        watchedLocation={watchedLocation}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
        getValues={getValues}
        setError={setError}
        setValue={setValue}
        resetDefaultValues={resetDefaultValues}
      />
    </Drawer>
  )
}
