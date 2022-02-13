import { Col, Drawer, notification, Row } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button, Form } from './styles'
import { Input } from '../../../components/UI/Input'
import { IInsurance, IInsuranceFormValues } from '../../../interfaces/insurance'
import {
  storeInsurance,
  updateInsurance,
} from '../../../services/requests/insurance'
import { useEffect } from 'react'

interface IInsuranceDrawerProps {
  isVisible: boolean
  type: 'update' | 'create'
  data?: IInsurance | undefined
  onClose: () => void
  fetchInsurances: () => void
}

const insuranceSchema = Yup.object().shape({
  name: Yup.string().required('Por favor, insira o nome do convênio!'),
})

export const InsuranceDrawer = ({
  data,
  isVisible,
  type,
  onClose,
  fetchInsurances,
}: IInsuranceDrawerProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IInsuranceFormValues>({
    resolver: yupResolver(insuranceSchema),
    shouldUnregister: true,
    mode: 'onBlur',
  })

  const closeDrawer = () => {
    reset()
    onClose()
  }

  const onSubmit = async (values: IInsuranceFormValues): Promise<void> => {
    const response =
      type === 'create'
        ? await storeInsurance({ ...values })
        : await updateInsurance(data?.id || 0, { ...values })

    if (response.error) {
      /** TO DO: handle errors properly... */
      notification.error({ message: response.error.message })
      return
    }

    notification.success({
      message:
        type === 'create'
          ? 'O convênio foi cadastrado com sucesso!'
          : 'Os dados do convênio foram atualizados com sucesso!',
    })
    closeDrawer()
    fetchInsurances()
  }

  const getButtonValue = () => {
    if (isSubmitting) {
      return 'Salvando...'
    }

    if (type === 'create') {
      return 'Cadastrar Convênio'
    }

    return 'Atualizar Convênio'
  }

  useEffect(() => {
    reset({ name: data?.name || '' })
  }, [data])

  return (
    <Drawer
      visible={isVisible}
      title={type === 'create' ? 'Cadastrar Convênio' : 'Atualizar Convênio'}
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
                  placeholder="Digite o nome do convênio"
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
              disabled={isSubmitting}
              type="submit"
              title={
                type === 'create'
                  ? 'Clique para cadastrar este novo convênio'
                  : 'Clique para atualizar os dados deste convênio'
              }>
              {getButtonValue()}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}
