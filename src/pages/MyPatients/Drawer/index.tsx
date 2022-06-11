import { Col, Drawer, notification, Row, Typography } from 'antd'
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { ICompletePatient, IMyPatient } from '../../../interfaces/patient'
import { setFieldErrors } from '../../../utils/helpers/errors'
import { Button, Form, InfoMessage } from './styles'
import {
  formatDecimalSeparator,
  getDrawerWidth,
} from '../../../utils/helpers/formatters'
import { updateMyPatient } from '../../../services/requests/myPatient'
import { Input, SupportedHTMLElement } from '../../../components/UI/Input'
import { useEffect } from 'react'

interface IEditMyPatientDrawerProps {
  isVisible: boolean
  data?: ICompletePatient & { age: number }
  onClose: () => void
  fetchPatients: () => void
}

type TFormValues = Omit<IMyPatient, 'height' | 'weight'> & {
  height?: string
  weight?: string
}

const isValidNumber = (value?: string | number | undefined) => {
  if (!value) {
    return true
  }

  return !!Number(value?.toString()?.replaceAll(',', '.'))
}

const myPatientSchema = Yup.object().shape({
  notes: Yup.string(),
  allergies: Yup.string(),
  illnesses: Yup.string(),
  weight: Yup.string().test(
    'is-valid-weight',
    'Por favor, informe um peso válido!',
    (value) => isValidNumber(value)
  ),
  height: Yup.string().test(
    'is-valid-height',
    'Por favor, informe uma altura válida!',
    (value) => isValidNumber(value)
  ),
})

export const EditMyPatientDrawer = ({
  data,
  isVisible,
  onClose,
  fetchPatients,
}: IEditMyPatientDrawerProps) => {
  const defaultValues = {
    notes: '',
    allergies: '',
    illnesses: '',
    weight: '',
    height: '',
  }
  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TFormValues>({
    defaultValues,
    resolver: yupResolver(myPatientSchema),
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const watchedFields = watch()
  const allFieldsAreEmpty =
    !Object.values(watchedFields)?.filter(Boolean)?.length

  const closeDrawer = () => {
    reset()
    onClose()
  }

  const onSubmit = async (values: TFormValues): Promise<void> => {
    if (!data?.id) {
      return notification.error({
        message:
          'Ocorreu um erro ao atualizar os dados do seu paciente! Por favor, tente novamente mais tarde.',
      })
    }

    const payload: IMyPatient = {
      ...values,
      height: Number(
        formatDecimalSeparator(values.height || 0, {
          currentSeparator: ',',
          newSeparator: '.',
        })
      ),
      weight: Number(
        formatDecimalSeparator(values.weight || 0, {
          currentSeparator: ',',
          newSeparator: '.',
        })
      ),
    }

    const response = await updateMyPatient(data?.id, payload)

    if (response.error) {
      setFieldErrors(setError, response.error)
      return
    }

    notification.success({
      message: 'Os dados do seu paciente foram atualizados com sucesso!',
    })
    closeDrawer()
    fetchPatients()
  }

  const getButtonTitle = () => {
    if (allFieldsAreEmpty) {
      return 'Preencha ao menos um dos campos acima para poder salvar os dados'
    }

    if (isSubmitting) {
      return 'Aguarde. Salvando dados do paciente...'
    }

    return 'Clique para atualizar os dados deste paciente'
  }

  const getButtonValue = () => {
    if (isSubmitting) {
      return 'Salvando...'
    }

    return 'Atualizar Dados'
  }

  const onChangeDecimalFields = (
    e: React.ChangeEvent<SupportedHTMLElement>,
    field:
      | ControllerRenderProps<TFormValues, 'height'>
      | ControllerRenderProps<TFormValues, 'weight'>
  ) => {
    const value = e.target.value

    e.target.value = formatDecimalSeparator(value)
    field.onChange(e)
  }

  useEffect(() => {
    if (data) {
      reset({
        notes: data?.notes || '',
        allergies: data?.allergies || '',
        illnesses: data?.illnesses || '',
        weight: data?.weight ? formatDecimalSeparator(data.weight) : '',
        height: data?.height ? formatDecimalSeparator(data.height) : '',
      })
    }
  }, [data])

  return (
    <Drawer
      title="Atualizar Dados do Paciente"
      visible={isVisible}
      width={getDrawerWidth(650)}
      onClose={closeDrawer}
      destroyOnClose>
      <InfoMessage>
        Preencha os campos abaixo para atualizar os dados do paciente&nbsp;
        <Typography.Text strong>{data?.name}</Typography.Text>{' '}
        {data?.age ? (
          <>
            cuja idade é{' '}
            <Typography.Text strong>
              {data.age} {`${data.age.toString() === '1' ? 'ano' : 'anos'}`}
            </Typography.Text>
            .
          </>
        ) : (
          '.'
        )}
      </InfoMessage>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={12}>
          <Col span={12} sm={12} xs={24}>
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <Input
                  label="Altura (m)"
                  placeholder="Digite a altura em metros"
                  error={errors?.height?.message}
                  {...field}
                  onChange={(e) => onChangeDecimalFields(e, field)}
                />
              )}
            />
          </Col>

          <Col span={12} sm={12} xs={24}>
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <Input
                  label="Peso (kg)"
                  placeholder="Digite o peso em quilos"
                  error={errors?.weight?.message}
                  {...field}
                  onChange={(e) => onChangeDecimalFields(e, field)}
                />
              )}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input
                  type="textarea"
                  label="Anotações Gerais"
                  placeholder="Digite aqui suas anotações..."
                  textAreaCols={8}
                  textAreaRows={8}
                  error={errors?.notes?.message}
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Controller
              name="allergies"
              control={control}
              render={({ field }) => (
                <Input
                  type="textarea"
                  label="Alergias"
                  placeholder="Digite aqui suas anotações referentes à alergias deste paciente..."
                  textAreaCols={8}
                  textAreaRows={8}
                  error={errors?.allergies?.message}
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Controller
              name="illnesses"
              control={control}
              render={({ field }) => (
                <Input
                  type="textarea"
                  label="Doenças"
                  placeholder="Digite aqui suas anotações referentes à doenças ou condições médicas deste paciente..."
                  textAreaCols={8}
                  textAreaRows={8}
                  error={errors?.illnesses?.message}
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Button
              type="submit"
              disabled={isSubmitting || allFieldsAreEmpty}
              title={getButtonTitle()}>
              {getButtonValue()}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}
