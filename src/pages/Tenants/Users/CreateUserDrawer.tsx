import { Drawer, notification } from 'antd'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { rolesOptions } from '../../../utils/helpers/roles'
import { setFieldErrors } from '../../../utils/helpers/errors'
import {
  IUserFormValues,
  UserForm,
  userSchema,
} from '../../../components/Forms/User'
import { UserFormDescription } from '../../../components/Forms/User/UserFormDescription'
import { storeTenantUser } from '../../../services/requests/tenantUser'
import { getDrawerWidth } from '../../../utils/helpers/formatters'

interface ICreateTenantUserDrawerProps {
  isVisible: boolean
  tenantId: number
  tenantName: string
  onClose: () => void
  fetchUsers: () => void
}

const defaultValues = {
  cpf: '',
  email: '',
  is_admin: false,
  is_clinic_owner: true,
  name: '',
  phone: '',
  role: rolesOptions[0],
  crm_document: '',
}

export const CreateTenantUserDrawer = ({
  tenantId,
  tenantName,
  isVisible,
  onClose,
  fetchUsers,
}: ICreateTenantUserDrawerProps) => {
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IUserFormValues>({
    resolver: yupResolver(userSchema),
    defaultValues,
    mode: 'onBlur',
  })

  const closeDrawer = () => {
    reset()
    onClose()
  }

  const onSubmit = async (values: IUserFormValues) => {
    const response = await storeTenantUser({
      ...values,
      is_admin: values.is_clinic_owner ? true : values.is_admin,
      cpf: values.cpf.replaceAll(/\D/g, ''),
      role: values.role.value,
      tenant_name: tenantName,
      tenant_id: tenantId,
      owner_tenant: false,
    })

    if (response.error) {
      setFieldErrors(setError, response.error)
      return
    }

    notification.success({ message: 'O usuário foi cadastrado com sucesso!' })
    closeDrawer()
    fetchUsers()
  }

  if (!isVisible) {
    return null
  }

  return (
    <Drawer
      visible={isVisible}
      title="Cadastrar Usuário"
      width={getDrawerWidth(450)}
      onClose={closeDrawer}
      destroyOnClose>
      <UserFormDescription />
      <UserForm
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
        rolesOptions={rolesOptions}
        showIsClinicOwner={true}
        watchedIsClinicOwner={watch(
          'is_clinic_owner',
          defaultValues.is_clinic_owner
        )}
        watchedRole={watch('role')}
        setValue={setValue}
        onSubmit={handleSubmit(onSubmit)}
      />
    </Drawer>
  )
}
