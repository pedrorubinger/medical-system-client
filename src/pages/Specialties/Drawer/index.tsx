import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Col, Drawer, notification, Row, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button, Form, InfoMessage } from './styles'
import { Input } from '../../../components/UI/Input'
import { ISpecialty, ISpecialtyFormValues } from '../../../interfaces/specialty'
import {
  storeSpecialty,
  updateSpecialty,
} from '../../../services/requests/specialty'
import { setFieldErrors } from '../../../utils/helpers/errors'
import { getDrawerWidth } from '../../../utils/helpers/formatters'
import { RootState } from '../../../store'
import { DoctorAdminCheckbox } from '../../../components/Forms/DoctorAdmin/Checkbox'

interface ISpecialtyDrawerProps {
  isVisible: boolean
  type: 'update' | 'create'
  data?: ISpecialty | undefined
  onClose: () => void
  fetchSpecialties: () => void
}

const specialtySchema = Yup.object().shape({
  name: Yup.string().required('Por favor, insira o nome da especialidade!'),
  include: Yup.boolean(),
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
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ISpecialtyFormValues>({
    resolver: yupResolver(specialtySchema),
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const user = useSelector((state: RootState) => state.AuthReducer)
  const isDoctor = !!user?.data?.doctor
  const isCreating = type === 'create'
  const isEditing = type === 'update'
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
        ? await storeSpecialty(
            { name: values.name },
            values.include && user?.data?.doctor?.id
              ? user.data.doctor.id
              : undefined
          )
        : await updateSpecialty(data?.id || 0, { name: values.name })

    if (response.error) {
      setFieldErrors(setError, response.error)
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

  const getInfoMessage = () => {
    if (isEditing) {
      return null
    }

    if (isDoctor) {
      return (
        <InfoMessage>
          Você está cadastrando as especialidades da clínica na qual você é
          administrador. Para adicionar uma especialidade à sua lista de
          especialidades atendidas, você precisa acessar a página de{' '}
          <Typography.Text strong>Meus Dados</Typography.Text>. Para incluir
          esta nova especialidade à sua lista, basta marcar a caixa de seleção
          no formulário abaixo.
        </InfoMessage>
      )
    }

    return (
      <InfoMessage>
        Você está cadastrando as especialidades da clínica na qual você é
        administrador. Elas ficarão disponíveis para que cada médico, ao acesar
        a página{' '}
        <Typography.Text strong>&apos;Meus Dados&apos;</Typography.Text>, possa
        selecionar as especialidades com que trabalham.
      </InfoMessage>
    )
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
    reset({ name: data?.name || '', include: !!isDoctor })
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
                  placeholder="Digite o nome da especialidade"
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
                      tooltipText="Esta especialidade não somente será cadastrada na clínica mas também será incluída à sua lista de especialidades atendidas"
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
