import { useEffect, useState } from 'react'
import { Col, Row, Typography } from 'antd'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as Yup from 'yup'

import { Input } from '../../components/UI/Input'
import { TopBar } from '../../components/UI/TopBar'
import { recoverPassword } from '../../services/requests/passwordRecovery'
import {
  Button,
  ButtonContainer,
  Container,
  Form,
  GetBackLinkContainer,
  PassowrdRecoveryCard,
  PasswordRecoveryTitle,
  StyledLink,
} from './styles'

interface IFormValues {
  email: string
}

type Status = 'success' | 'error' | 'form'

const passwordRecoverySchema = Yup.object().shape({
  email: Yup.string()
    .email('Você deve fornecer um email válido!')
    .required('Por favor, insira seu email!'),
})

export const RecoverPassword = (): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<Status>('form')
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormValues>({
    resolver: yupResolver(passwordRecoverySchema),
    mode: 'onChange',
  })
  const watchedEmail = watch('email', '')

  useEffect(() => {
    return () => {
      setStatus('form')
    }
  }, [])

  const onSubmit = async (values: IFormValues): Promise<void> => {
    setIsSubmitting(true)

    const response = await recoverPassword(values)

    if (response.success) {
      setStatus('success')
    }

    setIsSubmitting(false)
  }

  const FormContent = (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col span={24}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                label="Email"
                placeholder="Digite seu e-mail"
                error={errors?.email?.message}
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
          <StyledLink
            title="Clique para voltar para a tela de Login"
            to="/login">
            Voltar para Login
          </StyledLink>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ButtonContainer>
            <Button
              disabled={isSubmitting}
              width="100%"
              type="submit"
              title="Clique para recuperar sua senha">
              {isSubmitting ? 'Processando...' : 'Enviar'}
            </Button>
          </ButtonContainer>
        </Col>
      </Row>
    </Form>
  )

  const SuccessContent = (
    <>
      <Row>
        <Col span={24}>
          <Typography.Text type="secondary">
            Feito! Se o email{' '}
            <Typography.Text strong>{watchedEmail}</Typography.Text> está
            cadastrado no sistema, ele receberá instruções para proceder com a
            recuperação de senha. Por favor, verifique sua caixa de entrada,
            spam e lixeira.
          </Typography.Text>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <GetBackLinkContainer>
            <StyledLink
              fontSize={14}
              title="Clique para voltar para a tela de Login"
              to="/login">
              Voltar para Login
            </StyledLink>
          </GetBackLinkContainer>
        </Col>
      </Row>
    </>
  )

  const renderContent = () => {
    if (status === 'success') {
      return SuccessContent
    }

    return FormContent
  }

  return (
    <Container>
      <TopBar />
      <PassowrdRecoveryCard>
        <PasswordRecoveryTitle>Recuperação de Senha</PasswordRecoveryTitle>
        {renderContent()}
      </PassowrdRecoveryCard>
    </Container>
  )
}
