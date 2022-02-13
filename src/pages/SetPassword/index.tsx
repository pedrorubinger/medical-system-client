import { useEffect, useState } from 'react'
import { Col, notification, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { ProgressBar } from '../../components/UI/ProgressBar'
import { TopBar } from '../../components/UI/TopBar'
import { useQuery } from '../../hooks/useQuery'
import { updateUser, validateResetToken } from '../../services/requests/user'
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

interface IFormValues {
  password: string
  confirmed: string
}

interface IValidateResetTokenUser {
  email: string
  id: number
}

const defaultErrorMessage =
  'Não foi possível gerar uma nova senha neste momento. Tente novamente mais tarde ou contate-nos!'
const setPasswordSchema = Yup.object().shape({
  password: Yup.string().required('Por favor, insira sua senha!'),
  confirmed: Yup.string()
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
    formState: { errors, isSubmitting },
  } = useForm<IFormValues>({
    resolver: yupResolver(setPasswordSchema),
    mode: 'onChange',
  })

  const onSubmit = async (values: IFormValues) => {
    if (!user) {
      notification.error({ message: defaultErrorMessage })
      return
    }

    const response = await updateUser({ id: user.id, ...values })

    if (response.error) {
      /** TO DO: Implement error validation... (status 400) */
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
              <ReadOnly label="E-mail" value={user?.email || ''} />
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
                name="confirmed"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    type="password"
                    label="Confirmar Senha"
                    placeholder="Repita sua senha"
                    error={errors?.confirmed?.message}
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
