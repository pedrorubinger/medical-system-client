import { Col, Drawer, Row } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button, Form } from './styles'
import { Input } from '../../../components/UI/Input'
import { rolesOptions } from '../../../utils/helpers/roles'
import { IUserFormValues } from '../../../interfaces/user'

interface IUsersDrawerProps {
  type: 'create' | 'update'
  isVisible: boolean
  onClose: () => void
}

const userSchema = Yup.object().shape({
  name: Yup.string().required('Por favor, insira o nome completo!'),
  email: Yup.string()
    .email('Você deve fornecer um email válido!')
    .required('Por favor, insira um email!'),
  /** TO DO: Validate CPF format... */
  cpf: Yup.string().required('Insira um CPF!'),
  /** TO DO: Validate phone format... */
  phone: Yup.string().required('Por favor, insira um número de telefone!'),
  is_admin: Yup.boolean(),
  role: Yup.string().required('Por favor, selecione uma função!'),
})

export const UsersDrawer = ({
  isVisible,
  type,
  onClose,
}: IUsersDrawerProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUserFormValues>({
    resolver: yupResolver(userSchema),
    shouldUnregister: true,
    mode: 'onChange',
  })

  const closeDrawer = () => {
    reset()
    onClose()
  }

  const onSubmit = (values: IUserFormValues) => {
    console.log('submitted:', values)
    /** TO DO: Call storeUser() and handleErrors... */
  }

  return (
    <Drawer
      visible={isVisible}
      title={type === 'create' ? 'Cadastrar Usuário' : 'Atualizar Usuário'}
      onClose={closeDrawer}>
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
                  autoFocus
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
                  error={errors?.role?.message}
                  options={rolesOptions}
                  isSelect
                  required
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Button
              type="submit"
              title={
                type === 'create'
                  ? 'Clique para cadastrar este novo usuário'
                  : 'Clique para atualizar os dados deste usuário'
              }>
              {type === 'create' ? 'Cadastrar' : 'Atualizar'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}
