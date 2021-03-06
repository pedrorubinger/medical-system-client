import { useEffect } from 'react'
import { Checkbox, Col, notification, Row } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Creators } from '../../store/ducks/auth/reducer'
import { PageContent } from '../../components/UI/PageContent'
import { TableHeader } from '../../components/UI/TableHeader'
import { Button, ButtonContainer, CheckboxRow, Form } from './styles'
import { Input } from '../../components/UI/Input'
import { RootState } from '../../store'
import { formatCPF } from '../../utils/helpers/formatters'
import { updateUser } from '../../services/requests/user'
import { setFieldErrors } from '../../utils/helpers/errors'
import { ProfessionalData } from './ProfessionalData'
import { InsurancesSection } from './InsurancesSection'

interface IMyAccountFormValues {
  name: string
  email: string
  cpf: string
  phone: string
  password: string
  new_password: string
  change_password: boolean
}

const accountSchema = Yup.object().shape({
  name: Yup.string().required('Por favor, insira o nome completo!'),
  email: Yup.string()
    .email('Você deve fornecer um email válido!')
    .required('Por favor, insira um email!'),
  cpf: Yup.string()
    .required('Insira um CPF!')
    .test('is-cpf-valid', 'Informe um CPF válido!', (value) => {
      const cpf = value?.replace(/\D/g, '')

      return cpf?.length === 11
    }),
  phone: Yup.string().required('Por favor, insira um número de telefone!'),
  password: Yup.string().required('Por favor, insira sua senha atual!'),
  change_password: Yup.boolean(),
  new_password: Yup.string().when('change_password', {
    is: true,
    then: Yup.string().required('Por favor, insira sua nova senha!'),
  }),
})

export const MyAccount = (): JSX.Element => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.AuthReducer)
  const initialValues = {
    name: user.data.name,
    email: user.data.email,
    cpf: formatCPF(user.data.cpf),
    phone: user.data.phone,
    change_password: false,
    password: '',
    new_password: '',
  }
  const {
    control,
    watch,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IMyAccountFormValues>({
    mode: 'onChange',
    resolver: yupResolver(accountSchema),
    shouldUnregister: true,
    defaultValues: initialValues,
  })
  const watchedChangePassword = watch('change_password')

  const onSubmit = async (values: IMyAccountFormValues) => {
    const cpfHasChanged =
      values.cpf?.replace(/\D/g, '') !== user.data.cpf?.replace(/\D/g, '')
    const response = await updateUser({
      id: user.data.id,
      cpf: cpfHasChanged ? values.cpf?.replace(/\D/g, '') : undefined,
      email: values.email !== user.data.email ? values.email : undefined,
      name: values.name,
      password: values.password,
      phone: values.phone,
      new_password: values.change_password ? values.new_password : undefined,
    })

    if (response.user) {
      dispatch(Creators.setUser(response.user))
      notification.success({
        message: 'Seus dados pessoais foram atualizados com sucesso!',
      })
    } else if (response.error) {
      setFieldErrors(setError, response.error)
    }

    setValue('password', '')
    setValue('new_password', '')
    setValue('change_password', false)
  }

  useEffect(() => {
    dispatch(Creators.getUserData({ id: user?.data?.id }))
  }, [])

  return (
    <>
      <PageContent>
        <TableHeader title="Dados Pessoais" margin="0 0 20px 0" />
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={16}>
            <Col sm={12} xs={24}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Nome"
                    placeholder="Digite o seu nome completo"
                    error={errors?.name?.message}
                    required
                    autoFocus
                    {...field}
                  />
                )}
              />
            </Col>

            <Col sm={12} xs={24}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Email"
                    placeholder="Digite o seu e-mail"
                    error={errors?.email?.message}
                    required
                    {...field}
                  />
                )}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col sm={12} xs={24}>
              <Controller
                name="cpf"
                control={control}
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

            <Col sm={12} xs={24}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Telefone"
                    placeholder="Digite o seu telefone"
                    error={errors?.phone?.message}
                    required
                    {...field}
                  />
                )}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col sm={12} xs={24}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    type="password"
                    label="Senha Atual"
                    placeholder="Digite sua senha atual"
                    error={errors?.password?.message}
                    required
                    {...field}
                  />
                )}
              />
            </Col>

            {!!watchedChangePassword && (
              <Col sm={12} xs={24}>
                <Controller
                  name="new_password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="password"
                      label="Nova Senha"
                      placeholder="Digite sua nova senha"
                      error={errors?.new_password?.message}
                      required
                      {...field}
                    />
                  )}
                />
              </Col>
            )}
          </Row>

          <CheckboxRow>
            <Col>
              <Controller
                name="change_password"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    onChange={field.onChange}
                    value={field.value}
                    checked={field.value}>
                    Alterar senha
                  </Checkbox>
                )}
              />
            </Col>
          </CheckboxRow>

          <Row>
            <Col span={24}>
              <ButtonContainer>
                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? 'Salvando...' : 'Salvar Dados'}
                </Button>
              </ButtonContainer>
            </Col>
          </Row>
        </Form>
      </PageContent>

      {user.data.role === 'doctor' && (
        <>
          <ProfessionalData />
          <InsurancesSection />
        </>
      )}
    </>
  )
}
