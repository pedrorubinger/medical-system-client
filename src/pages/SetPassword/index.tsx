import { useEffect, useState } from 'react'
import { Col, notification, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { ProgressBar } from '../../components/UI/ProgressBar'
import { TopBar } from '../../components/UI/TopBar'
import { useQuery } from '../../hooks/useQuery'
import { setPassword, validateResetToken } from '../../services/requests/user'
import {
  Button,
  ButtonContainer,
  Container,
  Form,
  SetPasswordCard,
  Title,
} from './styles'
import { Input } from '../../components/UI/Input'
import { ReadOnly } from '../../components/UI/ReadOnly'
import { setFieldErrors } from '../../utils/helpers/errors'

interface IFormValues {
  password: string
  password_confirmation: string
}

interface IValidateResetTokenUser {
  email: string
  id: number
}

const defaultErrorMessage =
  'Não foi possível gerar uma nova senha neste momento. Tente novamente mais tarde ou contate-nos!'
const setPasswordSchema = Yup.object().shape({
  password: Yup.string().required('Por favor, insira sua senha!'),
  password_confirmation: Yup.string()
    .required('Por favor, confirme sua senha!')
    .oneOf([Yup.ref('password'), null], 'As senhas estão diferentes!'),
})

export const SetPassword = (): JSX.Element => {
  const navigate = useNavigate()
  const resetToken = useQuery().get('token')
  const [isMounted, setIsMounted] = useState(false)
  const [validatingToken, setValidatingToken] = useState(false)
  const [user, setUser] = useState<IValidateResetTokenUser | null>(null)
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IFormValues>({
    resolver: yupResolver(setPasswordSchema),
    mode: 'onChange',
  })

  const onSubmit = async (values: IFormValues) => {
    if (!user || !resetToken) {
      notification.error({ message: defaultErrorMessage })
      return
    }

    const response = await setPassword(user.id, {
      ...values,
      reset_password_token: resetToken,
    })

    if (response.error) {
      setFieldErrors(setError, response.error)
      return
    }

    notification.success({
      message: 'A sua senha foi redefinida com sucesso!',
      duration: 8,
    })
    navigate('/login')
  }

  useEffect(() => {
    if (!resetToken) {
      navigate('/login')
    } else {
      setIsMounted(true)
      setValidatingToken(true)
      ;(async () => {
        const response = await validateResetToken(resetToken)

        if (response.error) {
          notification.error({ message: defaultErrorMessage })
          navigate('/login')
        }

        if (response.user) {
          setUser(response.user)
        }

        setValidatingToken(false)
      })()
    }
  }, [])

  if (!isMounted || validatingToken) {
    return <ProgressBar />
  }

  return (
    <Container>
      <TopBar />
      <SetPasswordCard>
        <Title>Definição de Senha</Title>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col span={24}>
              <ReadOnly label="Email" value={user?.email || ''} />
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    type="password"
                    label="Nova Senha"
                    placeholder="Digite sua nova senha"
                    error={errors?.password?.message}
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
                name="password_confirmation"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    type="password"
                    label="Confirmar Senha"
                    placeholder="Repita sua senha"
                    error={errors?.password_confirmation?.message}
                    required
                    {...field}
                  />
                )}
              />
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <ButtonContainer>
                <Button
                  disabled={isSubmitting}
                  width="100%"
                  type="submit"
                  title="Clique para iniciar sessão">
                  {isSubmitting ? 'Carregando...' : 'Redefinir Senha'}
                </Button>
              </ButtonContainer>
            </Col>
          </Row>
        </Form>
      </SetPasswordCard>
    </Container>
  )
}
