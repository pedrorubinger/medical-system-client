/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Col, Drawer, notification, Row } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { formatCPF } from '../../../utils/helpers/formatters'
import { rolesOptions } from '../../../utils/helpers/roles'
import { storeUser } from '../../../services/requests/user'
import { TRole } from '../../../interfaces/roles'
import { Button, CheckboxRow, Form, InfoMessage } from './styles'
import { Input } from '../../../components/UI/Input'
import { InfoTooltip } from '../../../components/UI/InfoTooltip'
import { setFieldErrors } from '../../../utils/helpers/errors'

interface IUsersDrawerProps {
  isVisible: boolean
  onClose: () => void
  fetchUsers: () => void
}

const userSchema = Yup.object().shape({
  name: Yup.string().required('Por favor, insira o nome completo!'),
  email: Yup.string()
    .email('Você deve fornecer um email válido!')
    .required('Por favor, insira um email!'),
  cpf: Yup.string()
    .required('Por favor, insira um CPF!')
    .test('is-cpf-valid', 'Este CPF é inválido!', (value) => {
      const cpf = value?.replace(/\D/g, '')

      return cpf?.length === 11
    }),
  phone: Yup.string().required('Por favor, insira um número de telefone!'),
  is_admin: Yup.boolean(),
  role: Yup.object().required('Por favor, selecione uma função!'),
  crm_document: Yup.string().when('role.value', {
    is: 'doctor',
    then: Yup.string().required('Por favor, insira o número do CRM!'),
  }),
})

interface ISelectOption {
  label: string
  value: TRole
}

interface IFormValues {
  name: string
  email: string
  cpf: string
  phone: string
  is_admin: boolean
  role: ISelectOption
  crm_document?: string
}

export const UsersDrawer = ({
  isVisible,
  onClose,
  fetchUsers,
}: IUsersDrawerProps) => {
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IFormValues>({
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

  const onSubmit = async (values: IFormValues) => {
    const response = await storeUser({ ...values, role: values.role.value })

    if (response.error) {
      setFieldErrors(setError, response.error)
      return
    }

    notification.success({ message: 'O usuário foi cadastrado com sucesso!' })
    closeDrawer()
    fetchUsers()
  }

  const watchedRole = watch('role')

  return (
    <Drawer
      visible={isVisible}
      title="Cadastrar Usuário"
      width={450}
      onClose={closeDrawer}>
      <InfoMessage>
        Ao cadastrar este usuário, o mesmo receberá um email para que defina uma
        senha de acesso ao sistema.
      </InfoMessage>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col span={24}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  label="Nome"
                  placeholder="Digite o nome completo"
                  error={errors?.name?.message}
                  required
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  label="E-mail"
                  placeholder="Digite o e-mail"
                  error={errors?.email?.message}
                  required
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Controller
              name="cpf"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  label="CPF"
                  placeholder="Digite o CPF"
                  error={errors?.cpf?.message}
                  required
                  {...field}
                  onChange={(e) => setValue('cpf', formatCPF(e.target.value))}
                />
              )}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  label="Telefone"
                  placeholder="Digite o telefone"
                  error={errors?.phone?.message}
                  required
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Controller
              name="role"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <Input
                  label="Função"
                  placeholder="Selecione uma função"
                  error={errors?.role?.value?.message}
                  options={rolesOptions}
                  selectOnChange={(newValue: any) => {
                    setValue('role', { ...newValue })
                  }}
                  isSelect
                  required
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        {watchedRole?.value === 'doctor' && (
          <Row>
            <Col span={24}>
              <Controller
                name="crm_document"
                control={control}
                render={({ field }) => (
                  <Input
                    label="CRM"
                    placeholder="Informe o CRM do médico"
                    error={errors?.crm_document?.message}
                    required
                    {...field}
                  />
                )}
              />
            </Col>
          </Row>
        )}

        <CheckboxRow>
          <Col>
            <Controller
              name="is_admin"
              control={control}
              render={({ field }) => (
                <Checkbox
                  onChange={field.onChange}
                  value={field.value}
                  checked={field.value}>
                  É administrador{' '}
                  <InfoTooltip text="Um usuário administrador não poderá ser excluído, além de ter acesso aos relatórios da empresa, gestão de usuários, convênios e especialidades." />
                </Checkbox>
              )}
            />
          </Col>
        </CheckboxRow>

        <Row>
          <Col span={24}>
            <Button
              disabled={isSubmitting}
              type="submit"
              title="Clique para cadastrar este novo usuário">
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}
