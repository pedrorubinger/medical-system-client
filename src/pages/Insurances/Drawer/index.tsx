import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Drawer, notification, Row, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import {
  storeInsurance,
  updateInsurance,
} from '../../../services/requests/insurance'
import { setFieldErrors } from '../../../utils/helpers/errors'
import { Button, Form, InfoMessage } from './styles'
import { Input } from '../../../components/UI/Input'
import { IInsurance, IInsuranceFormValues } from '../../../interfaces/insurance'
import {
  convertBrCurrencyToNumber,
  getDrawerWidth,
} from '../../../utils/helpers/formatters'
import { DoctorAdminCheckbox } from '../../../components/Forms/DoctorAdmin/Checkbox'
import { RootState } from '../../../store'
import { Creators } from '../../../store/ducks/auth/reducer'

interface IInsuranceDrawerProps {
  isVisible: boolean
  type: 'update' | 'create'
  data?: IInsurance | undefined
  onClose: () => void
  fetchInsurances: () => void
}

const insuranceSchema = Yup.object().shape({
  name: Yup.string().required('Por favor, insira o nome do convênio!'),
  include: Yup.boolean(),
  price: Yup.string().when('include', {
    is: (value: boolean | undefined) => !!value,
    then: Yup.string().required(
      'Por favor, insira o preço pago pelo convênio!'
    ),
  }),
})

export const InsuranceDrawer = ({
  data,
  isVisible,
  type,
  onClose,
  fetchInsurances,
}: IInsuranceDrawerProps) => {
  const user = useSelector((state: RootState) => state.AuthReducer)
  const isDoctor = !!user?.data?.doctor
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
  const dispatch = useDispatch()
  const isCreating = type === 'create'
  const isEditing = type === 'update'
  const watchedName = watch('name', data?.name || '')
  const watchedFlag = watch('include', !!isDoctor)
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
    const price = convertBrCurrencyToNumber(values.price || '0') || 0
    const payload = values.include
      ? {
          name: values.name,
          price,
        }
      : { name: values.name }

    const response = isCreating
      ? await storeInsurance(
          payload,
          values.include ? user.data.doctor.id : null
        )
      : await updateInsurance(data?.id || 0, { name: values.name })

    if (response.error) {
      setFieldErrors(setError, response.error)
      return
    }

    notification.success({
      message: isCreating
        ? 'O convênio foi cadastrado com sucesso!'
        : 'Os dados do convênio foram atualizados com sucesso!',
    })

    if (values.include) {
      const updatedInsurances = [
        ...user.data.doctor.insurance,
        { ...response.insurance, price },
      ]

      dispatch(
        Creators.setUser({
          ...user.data,
          doctor: { ...user.data.doctor, insurance: updatedInsurances },
        })
      )
    }

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

  const getInfoMessage = () => {
    if (isEditing) {
      return null
    }

    if (isDoctor) {
      return (
        <InfoMessage>
          Você está cadastrando os convênios da clínica na qual você é
          administrador. Para adicionar um convênio à sua lista de convênios
          atendidos, você precisa acessar a página de{' '}
          <Typography.Text strong>Meus Dados</Typography.Text>. Para incluir
          este convênio à sua lista, basta marcar a caixa de seleção no
          formulário abaixo.
        </InfoMessage>
      )
    }

    return (
      <InfoMessage>
        Você está cadastrando os convênios da clínica na qual você é
        administrador. Eles ficarão disponíveis para que cada médico, ao acesar
        a página{' '}
        <Typography.Text strong>&apos;Meus Dados&apos;</Typography.Text>,
        selecione os convênios em que atenderão em suas consultas.
      </InfoMessage>
    )
  }

  useEffect(() => {
    reset({ name: data?.name || '', include: !!isDoctor })
    setCurrentName(data?.name || '')
  }, [data, isVisible])

  return (
    <Drawer
      visible={isVisible}
      title={isCreating ? 'Cadastrar Convênio' : 'Atualizar Convênio'}
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
                  placeholder="Digite o nome do convênio"
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
            {!!watchedFlag && (
              <Row>
                <Col span={24}>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Preço por Consulta (R$)"
                        error={errors?.price?.message}
                        required
                        isCurrency
                        {...field}
                      />
                    )}
                  />
                </Col>
              </Row>
            )}

            <Row>
              <Col span={24}>
                <Controller
                  name="include"
                  control={control}
                  defaultValue={!!isDoctor}
                  render={({ field }) => (
                    <DoctorAdminCheckbox
                      field={field}
                      label="Atender por este convênio"
                      tooltipText="Este convênio não somente será cadastrado na clínica mas também será incluído à sua lista"
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
              type="submit"
              disabled={isSubmitting || !nameHasChanged()}
              title={getButtonTitle()}>
              {getButtonValue()}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}
