import { Col, Drawer, notification, Row } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button, Form } from './styles'
import { Input } from '../../../components/UI/Input'
import { ISpecialty, ISpecialtyFormValues } from '../../../interfaces/specialty'
import {
  storeSpecialty,
  updateSpecialty,
} from '../../../services/requests/specialty'
import { useEffect } from 'react'

interface ISpecialtyDrawerProps {
  isVisible: boolean
  type: 'update' | 'create'
  data?: ISpecialty | undefined
  onClose: () => void
  fetchSpecialties: () => void
}

const specialtySchema = Yup.object().shape({
  name: Yup.string().required('Por favor, insira o nome da especialidade!'),
})

export const SpecialtyDrawer = ({
  data,
  isVisible,
  type,
  onClose,
  fetchSpecialties,
}: ISpecialtyDrawerProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ISpecialtyFormValues>({
    resolver: yupResolver(specialtySchema),
    shouldUnregister: true,
    mode: 'onBlur',
  })

  const closeDrawer = () => {
    reset()
    onClose()
  }

  const onSubmit = async (values: ISpecialtyFormValues): Promise<void> => {
    const response =
      type === 'create'
        ? await storeSpecialty({ ...values })
        : await updateSpecialty(data?.id || 0, { ...values })

    if (response.error) {
      /** TO DO: handle errors properly... */
      notification.error({ message: response.error.message })
      return
    }

    notification.success({
      message:
        type === 'create'
          ? 'A especialidade foi cadastrada com sucesso!'
          : 'Os dados da especialidade foram atualizadas com sucesso!',
    })
    closeDrawer()
    fetchSpecialties()
  }

  const getButtonValue = () => {
    if (isSubmitting) {
      return 'Salvando...'
    }

    if (type === 'create') {
      return 'Cadastrar Especialidade'
    }

    return 'Atualizar Especialidade'
  }

  useEffect(() => {
    reset({ name: data?.name || '' })
  }, [data])

  return (
    <Drawer
      visible={isVisible}
      title={
        type === 'create'
          ? 'Cadastrar Especialidade'
          : 'Atualizar Especialidade'
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
                  placeholder="Digite o nome da especialidade"
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
                  ? 'Clique para cadastrar esta nova especialidade'
                  : 'Clique para atualizar os dados desta especialidade'
              }>
              {getButtonValue()}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}
