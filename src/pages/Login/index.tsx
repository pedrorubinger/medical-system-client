import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Col, notification, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import {
  ButtonContainer,
  Container,
  LoginExtraInfoContainer,
  LoginTitle,
  StyledLink,
  SignInCard,
} from './styles'
import { Input } from '../../components/UI/Input'
import { TopBar } from '../../components/UI/TopBar'
import { Button } from '../../components/UI/Button'
import { RootState } from '../../store'
import { Creators } from '../../store/ducks/user/reducer'

interface IFormValues {
  email: string
  password: string
}

const signInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Você deve fornecer um email válido!')
    .required('Por favor, insira seu email!'),
  password: Yup.string().required('Por favor, insira sua senha!'),
})

export const Login = (): JSX.Element => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.UserReducer)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>({
    resolver: yupResolver(signInSchema),
    mode: 'onChange',
  })

  const onSubmit = async (values: IFormValues) => {
    dispatch(Creators.signIn(values))
  }

  useEffect(() => {
    if (user.error) {
      console.log('USER ERROR>', user.error)
      notification.error({ message: 'Algo deu errado!' })
    }

    if (user.data) {
      navigate('/')
    }
  }, [user])

  return (
    <Container>
      <TopBar />
      <SignInCard>
        <LoginTitle>Iniciar Sessão</LoginTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col span={24}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    label="E-mail"
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
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    type="password"
                    label="Senha"
                    placeholder="Digite sua senha"
                    error={errors?.password?.message}
                    required
                    {...field}
                  />
                )}
              />
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <LoginExtraInfoContainer>
                <StyledLink
                  title="Clique para solicitar uma conta"
                  to="/get-account">
                  Solicitar uma conta
                </StyledLink>

                <StyledLink
                  title="Clique para recuperar sua senha"
                  to="/recover-password">
                  Esqueci minha senha
                </StyledLink>
              </LoginExtraInfoContainer>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <ButtonContainer>
                <Button
                  // disabled={user?.loading}
                  disabled
                  width="100%"
                  type="submit"
                  title="Clique para iniciar sessão">
                  {user?.loading ? 'Autenticando...' : 'Entrar'}
                </Button>
              </ButtonContainer>
            </Col>
          </Row>
        </form>
      </SignInCard>
    </Container>
  )
}
