import { useEffect, useState } from 'react'
import { Col, Drawer, notification, Row } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import {
  storeInsurance,
  updateInsurance,
} from '../../../services/requests/insurance'
import { setFieldErrors } from '../../../utils/helpers/errors'
import { Button, Form } from './styles'
import { Input } from '../../../components/UI/Input'
import { IInsurance, IInsuranceFormValues } from '../../../interfaces/insurance'
import { getDrawerWidth } from '../../../utils/helpers/formatters'

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
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IInsuranceFormValues>({
    resolver: yupResolver(insuranceSchema),
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

  const onSubmit = async (values: IInsuranceFormValues): Promise<void> => {
    const response =
      type === 'create'
        ? await storeInsurance({ ...values })
        : await updateInsurance(data?.id || 0, { ...values })

    if (response.error) {
      setFieldErrors(setError, response.error)
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

  const getButtonTitle = () => {
    if (isSubmitting) {
      return 'Aguarde. Salvando dados do convênio...'
    }

    if (type === 'create') {
      return 'Clique para cadastrar este novo convênio'
    }

    if (!nameHasChanged()) {
      return 'Faça mudanças no nome do convênio para salvar as informações'
    }

    return 'Clique para atualizar os dados deste convênio'
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
    setCurrentName(data?.name || '')
  }, [data])

  return (
    <Drawer
      visible={isVisible}
      title={type === 'create' ? 'Cadastrar Convênio' : 'Atualizar Convênio'}
      width={getDrawerWidth(450)}
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
