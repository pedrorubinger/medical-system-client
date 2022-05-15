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
  onClose: () => void
  fetchUsers: () => void
}

export const CreateTenantUserDrawer = ({
  tenantId,
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
    shouldUnregister: true,
    defaultValues: {
      cpf: '',
      email: '',
      is_admin: false,
      name: '',
      phone: '',
      role: rolesOptions[0],
      crm_document: '',
    },
    mode: 'onBlur',
  })

  const closeDrawer = () => {
    reset()
    onClose()
  }

  const onSubmit = async (values: IUserFormValues) => {
    const response = await storeTenantUser({
      ...values,
      cpf: values.cpf.replaceAll(/\D/g, ''),
      role: values.role.value,
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
        setValue={setValue}
        onSubmit={handleSubmit(onSubmit)}
        watchedRole={watch('role')}
      />
    </Drawer>
  )
}
