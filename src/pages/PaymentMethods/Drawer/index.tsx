import { useEffect, useState } from 'react'
import { Col, Drawer, notification, Row } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import {
  storePaymentMethod,
  updatePaymentMethod,
} from '../../../services/requests/paymentMethod'
import { setFieldErrors } from '../../../utils/helpers/errors'
import { Button, Form } from './styles'
import { Input } from '../../../components/UI/Input'
import {
  IPaymentMethod,
  IPaymentMethodFormValues,
} from '../../../interfaces/paymentMethod'

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

  const onSubmit = async (values: IPaymentMethodFormValues): Promise<void> => {
    const response =
      type === 'create'
        ? await storePaymentMethod({ ...values })
        : await updatePaymentMethod(data?.id || 0, { ...values })

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

  useEffect(() => {
    reset({ name: data?.name || '' })
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
      width={450}
      onClose={closeDrawer}>
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
