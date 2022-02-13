import { useEffect, useState } from 'react'
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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ISpecialtyFormValues>({
    resolver: yupResolver(specialtySchema),
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const watchedName = watch('name', data?.name || '')
  const [currentName, setCurrentName] = useState(data?.name || '')

  const closeDrawer = () => {
    reset()
    onClose()
  }

  const nameHasChanged = () => {
    if (type === 'update') {
      return currentName !== watchedName
    }

    return true
  }

  const onSubmit = async (values: ISpecialtyFormValues): Promise<void> => {
    const response =
      type === 'create'
        ? await storeSpecialty({ ...values })
        : await updateSpecialty(data?.id || 0, { ...values })

    if (response.error) {
      /** TO DO: handle errors properly... */
      return
    }

    notification.success({
      message:
        type === 'create'
          ? 'A especialidade foi cadastrada com sucesso!'
          : 'Os dados da especialidade foram atualizadas com sucesso!',
    })
    setCurrentName(values.name)
    closeDrawer()
    fetchSpecialties()
  }

  const getButtonTitle = () => {
    if (isSubmitting) {
      return 'Aguarde. Salvando dados da especialidade...'
    }

    if (type === 'create') {
      return 'Clique para cadastrar esta nova especialidade'
    }

    if (!nameHasChanged()) {
      return 'Faça mudanças no nome da especialidade para salvar as informações'
    }

    return 'Clique para atualizar os dados desta especialidade'
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
    setCurrentName(data?.name || '')
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
