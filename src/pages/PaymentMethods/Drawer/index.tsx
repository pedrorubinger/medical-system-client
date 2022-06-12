import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Col, Drawer, notification, Row, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { RootState } from '../../../store'
import {
  storePaymentMethod,
  updatePaymentMethod,
} from '../../../services/requests/paymentMethod'
import { setFieldErrors } from '../../../utils/helpers/errors'
import { Button, Form, InfoMessage } from './styles'
import { Input } from '../../../components/UI/Input'
import {
  IPaymentMethod,
  IPaymentMethodFormValues,
} from '../../../interfaces/paymentMethod'
import { getDrawerWidth } from '../../../utils/helpers/formatters'
import { DoctorAdminCheckbox } from '../../../components/Forms/DoctorAdmin/Checkbox'

interface IPaymentMethodDrawerProps {
  isVisible: boolean
  type: 'update' | 'create'
  data?: IPaymentMethod | undefined
  onClose: () => void
  fetchPaymentMethods: () => void
}

const paymentMethodSchema = Yup.object().shape({
  name: Yup.string().required(
    'Por favor, insira o nome do método de pagamento!'
  ),
})

export const PaymentMethodDrawer = ({
  data,
  isVisible,
  type,
  onClose,
  fetchPaymentMethods,
}: IPaymentMethodDrawerProps) => {
  const user = useSelector((state: RootState) => state.AuthReducer)
  const isDoctor = !!user?.data?.doctor
  const isCreating = type === 'create'
  const isEditing = type === 'update'
  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IPaymentMethodFormValues>({
    resolver: yupResolver(paymentMethodSchema),
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const watchedName = watch('name', data?.name || '')
  const [currentName, setCurrentName] = useState(data?.name || '')

  const nameHasChanged = () => {
    if (type === 'update') {
      return currentName !== watchedName
    }

    return true
  }

  const closeDrawer = () => {
    reset()
    onClose()
  }

  const onSubmit = async ({
    name,
    include,
  }: IPaymentMethodFormValues): Promise<void> => {
    const response =
      type === 'create'
        ? await storePaymentMethod(
            { name },
            include && user?.data?.doctor?.id ? user.data.doctor.id : undefined
          )
        : await updatePaymentMethod(data?.id || 0, { name })

    if (response.error) {
      setFieldErrors(setError, response.error)
      return
    }

    notification.success({
      message:
        type === 'create'
          ? 'O método de pagamento foi cadastrado com sucesso!'
          : 'Os dados do método de pagamento foram atualizados com sucesso!',
    })
    closeDrawer()
    fetchPaymentMethods()
  }

  const getButtonTitle = () => {
    if (isSubmitting) {
      return 'Aguarde. Salvando dados do método de pagamento...'
    }

    if (type === 'create') {
      return 'Clique para cadastrar este novo método de pagamento'
    }

    if (!nameHasChanged()) {
      return 'Faça mudanças no nome do método de pagamento para salvar as informações'
    }

    return 'Clique para atualizar os dados deste método de pagamento'
  }

  const getButtonValue = () => {
    if (isSubmitting) {
      return 'Salvando...'
    }

    if (type === 'create') {
      return 'Cadastrar Método'
    }

    return 'Atualizar Método'
  }

  const getInfoMessage = () => {
    if (isEditing) {
      return null
    }

    if (isDoctor) {
      return (
        <InfoMessage>
          Você está cadastrando os métodos de pagamento aceitos em consultas da
          clínica na qual você é administrador. Para adicionar um método de
          pagamento à sua lista de métodos de pagamento, você precisa acessar a
          página de <Typography.Text strong>Meus Dados</Typography.Text>. Para
          incluir este novo método de pagamento à sua lista, basta marcar a
          caixa de seleção no formulário abaixo.
        </InfoMessage>
      )
    }

    return (
      <InfoMessage>
        Você está cadastrando os métodos de pagamento aceitos em consultas da
        clínica na qual você é administrador. Eles ficarão disponíveis para que
        cada médico, ao acesar a página{' '}
        <Typography.Text strong>&apos;Meus Dados&apos;</Typography.Text>, possa
        selecionar os métodos de pagamento aceitos.
      </InfoMessage>
    )
  }

  useEffect(() => {
    reset({ name: data?.name || '', include: !!isDoctor })
    setCurrentName(data?.name || '')
  }, [data])

  return (
    <Drawer
      visible={isVisible}
      title={
        type === 'create'
          ? 'Cadastrar Método de Pagamento'
          : 'Atualizar Método de Pagamento'
      }
      width={getDrawerWidth(450)}
      onClose={closeDrawer}>
      {getInfoMessage()}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col span={24}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  label="Nome"
                  placeholder="Digite o nome do método de pagamento"
                  error={errors?.name?.message}
                  required
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        {!!isCreating && !!isDoctor && (
          <>
            <Row>
              <Col span={24}>
                <Controller
                  name="include"
                  control={control}
                  defaultValue={!!isDoctor}
                  render={({ field }) => (
                    <DoctorAdminCheckbox
                      field={field}
                      tooltipText="Este método de pagamento não somente será cadastrado na clínica mas também será incluído à sua lista de métodos pagamento aceitos nas consultas"
                    />
                  )}
                />
              </Col>
            </Row>
          </>
        )}

        <Row>
          <Col span={24}>
            <Button
              disabled={isSubmitting || !nameHasChanged()}
              type="submit"
              title={getButtonTitle()}>
              {getButtonValue()}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}
