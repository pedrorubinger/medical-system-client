import { Drawer, notification } from 'antd'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { setFieldErrors } from '../../../utils/helpers/errors'
import {
  IUserFormValues,
  UserForm,
  userSchema,
} from '../../../components/Forms/User'
import { UserFormDescription } from '../../../components/Forms/User/UserFormDescription'
import { storeTenantUser } from '../../../services/requests/tenantUser'
import { TRole } from '../../../interfaces/roles'

interface IAdminsDrawerProps {
  isVisible: boolean
  onClose: () => void
  fetchAdmins: () => void
}

const defaultValues = {
  is_admin: false,
  cpf: '',
  email: '',
  name: '',
  phone: '',
  crm_document: '',
  role: { value: 'developer' as TRole, label: 'Desenvolvedor' },
}

export const AdminsDrawer = ({
  isVisible,
  onClose,
  fetchAdmins,
}: IAdminsDrawerProps) => {
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IUserFormValues>({
    resolver: yupResolver(userSchema),
    shouldUnregister: true,
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
      cpf: values.cpf.replaceAll(/\D/g, ''),
      role: 'developer',
      is_admin: false,
      owner_tenant: true,
    })

    if (response.error) {
      setFieldErrors(setError, response.error)
      return
    }

    notification.success({
      message: 'O administrador foi cadastrado com sucesso!',
    })
    closeDrawer()
    fetchAdmins()
  }

  return (
    <Drawer
      visible={isVisible}
      title="Cadastrar Administrador/Desenvolvedor"
      width={450}
      onClose={closeDrawer}
      destroyOnClose>
      <UserFormDescription />
      <UserForm
        buttonTitle="Clique para cadastrar este administrador"
        blockedRole={defaultValues.role}
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
        showIsAdmin={false}
        setValue={setValue}
        onSubmit={handleSubmit(onSubmit)}
      />
    </Drawer>
  )
}
