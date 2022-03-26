/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Col, notification, Row, Spin, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button, ButtonContainer, Form } from '../styles'
import { fetchSpecialties } from '../../../services/requests/specialty'
import { updateDoctor } from '../../../services/requests/doctor'
import { setFieldErrors } from '../../../utils/helpers/errors'
import { IUser } from '../../../interfaces/user'
import { IInsurance } from '../../../interfaces/insurance'
import { ISpecialty } from '../../../interfaces/specialty'
import { IError } from '../../../interfaces/error'
import { Input } from '../../../components/UI/Input'
import { PageContent } from '../../../components/UI/PageContent'
import { TableHeader } from '../../../components/UI/TableHeader'
import { IPaymentMethod } from '../../../interfaces/paymentMethod'
import { fetchPaymentMethods } from '../../../services/requests/paymentMethod'
import { convertBrCurrencyToNumber } from '../../../utils/helpers/formatters'

interface ISelectOption {
  label: string
  value: number
}

interface IProfessionalDataProps {
  user: IUser
}

interface IProfessionalDataFormValues {
  insurances?: ISelectOption[] | undefined
  specialties?: ISelectOption[] | undefined
  payment_methods?: ISelectOption[] | undefined
  private_appointment_price?: number | undefined
  appointment_follow_up_limit?: number | undefined
  crm_document: string
}

const professionalDataSchema = Yup.object().shape({
  crm_document: Yup.string().required('Por favor, insira o número do CRM!'),
  private_appointment_price: Yup.string()
    .required('Por favor, insira o valor da consulta particular!')
    .typeError('Por favor, insira o valor da consulta particular!'),
  appointment_follow_up_limit: Yup.number()
    .required('Por favor, insira o limite da consulta de retorno!')
    .typeError('Por favor, insira o limite da consulta de retorno!'),
  specialties: Yup.array().nullable(true),
  insurances: Yup.array().nullable(true),
  payment_methods: Yup.array().nullable(true),
})

const formatOptions = (
  data: IInsurance[] | ISpecialty[] = []
): ISelectOption[] => {
  return data.map((item) => ({ value: item.id, label: item.name }))
}

const formatSelectOption = (
  arr?: IInsurance[] | ISpecialty[] | IPaymentMethod[]
): ISelectOption[] | undefined =>
  arr?.length
    ? [...arr].map((item) => ({ value: item.id, label: item.name }))
    : undefined

export const ProfessionalData = ({ user }: IProfessionalDataProps) => {
  const initialValues: IProfessionalDataFormValues = {
    crm_document: user?.doctor?.crm_document || '',
    insurances: formatSelectOption(user?.doctor?.insurance),
    specialties: formatSelectOption(user?.doctor?.specialty),
    payment_methods: formatSelectOption(user?.doctor?.payment_method),
    private_appointment_price: user?.doctor?.private_appointment_price,
    appointment_follow_up_limit: user?.doctor?.appointment_follow_up_limit,
  }
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IProfessionalDataFormValues>({
    mode: 'onChange',
    shouldUnregister: true,
    defaultValues: initialValues,
    resolver: yupResolver(professionalDataSchema),
  })
  const [specialtiesOptions, setSpecialtiesOptions] = useState<ISelectOption[]>(
    []
  )
  const [paymentMethodsOptions, setPaymentMethodsOptions] = useState<
    ISelectOption[]
  >([])
  const [isFetching, setIsFetching] = useState(false)
  const [httpErrors, setHttpErrors] = useState<IError[]>([])

  const onSubmit = async (values: IProfessionalDataFormValues) => {
    if (!user?.doctor) {
      return null
    }

    const price = convertBrCurrencyToNumber(
      values?.private_appointment_price?.toString() || 'R$ 0,00'
    )
    const response = await updateDoctor({
      id: user.doctor.id,
      appointment_follow_up_limit: values?.appointment_follow_up_limit,
      private_appointment_price: price,
      crm:
        user.doctor.crm_document === values.crm_document
          ? undefined
          : values.crm_document,
      specialties: values?.specialties?.length
        ? values?.specialties?.map((specialty) => specialty.value)
        : undefined,
      payment_methods: values?.payment_methods?.length
        ? values?.payment_methods?.map((method) => method.value)
        : undefined,
    })

    if (response.doctor) {
      notification.success({
        message: 'Os seus dados profissionais foram atualizados com sucesso!',
      })
    } else if (response.error) {
      setFieldErrors(setError, response.error)
    }
  }

  useEffect(() => {
    ;(async () => {
      setIsFetching(true)

      const specialtiesResponse = await fetchSpecialties()
      const paymentMethodsResponse = await fetchPaymentMethods()

      if (specialtiesResponse?.data) {
        setSpecialtiesOptions(formatOptions(specialtiesResponse.data))
      }

      if (paymentMethodsResponse?.data) {
        setPaymentMethodsOptions(formatOptions(paymentMethodsResponse.data))
      }

      if (specialtiesResponse.error) {
        setHttpErrors([specialtiesResponse.error])
      }

      if (paymentMethodsResponse.error) {
        setHttpErrors([paymentMethodsResponse.error])
      }

      setIsFetching(false)
    })()
  }, [])

  const ErrorOnLoadData = (
    <>
      <h2>
        Desculpe, mas não foi possível buscar os dados profissionais neste
        momento. O seguinte erro ocorreu:
      </h2>
      {httpErrors.map((item: IError, i: number) => (
        <h3 key={i}>
          <Typography.Text strong>{item.message}</Typography.Text>
        </h3>
      ))}
    </>
  )

  const FetchingData = (
    <h3>
      Por favor, aguarde... Estamos carregando as informações. <Spin />
    </h3>
  )

  const FormContent = (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={16}>
        <Col sm={12} xs={24}>
          <Controller
            name="crm_document"
            control={control}
            render={({ field }) => (
              <Input
                label="CRM"
                placeholder="Informe o CRM do médico"
                error={errors?.crm_document?.message}
                required
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col sm={12} xs={24}>
          <Controller
            name="private_appointment_price"
            control={control}
            render={({ field }) => (
              <Input
                label="Preço da Consulta Particular (R$)"
                placeholder="R$"
                error={errors?.private_appointment_price?.message}
                required
                isCurrency
                {...field}
              />
            )}
          />
        </Col>

        <Col sm={12} xs={24}>
          <Controller
            name="appointment_follow_up_limit"
            control={control}
            render={({ field }) => (
              <Input
                label="Limite para Retorno (em dias)"
                placeholder="Dias"
                error={errors?.appointment_follow_up_limit?.message}
                required
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col sm={12} xs={24}>
          <Controller
            control={control}
            name="specialties"
            render={({ field }) => (
              <Input
                label="Especialidades Médicas"
                placeholder="Selecionar Especialidades"
                error={errors?.specialties?.[0]?.value?.message}
                options={specialtiesOptions}
                selectOnChange={(newValue: any) =>
                  setValue('specialties', newValue)
                }
                isSelect
                isMulti
                {...field}
              />
            )}
          />
        </Col>

        <Col sm={12} xs={24}>
          <Controller
            control={control}
            name="payment_methods"
            render={({ field }) => (
              <Input
                label="Métodos de Pagamento"
                placeholder="Selecionar Métodos"
                error={errors?.payment_methods?.[0]?.value?.message}
                options={paymentMethodsOptions}
                selectOnChange={(newValue: any) =>
                  setValue('payment_methods', newValue)
                }
                isSelect
                isMulti
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ButtonContainer>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Salvando...' : 'Salvar Dados'}
            </Button>
          </ButtonContainer>
        </Col>
      </Row>
    </Form>
  )

  const renderContent = () => {
    if (httpErrors?.length) {
      return ErrorOnLoadData
    }

    if (isFetching) {
      return FetchingData
    }

    return FormContent
  }

  return (
    <PageContent margin="30px 0">
      <TableHeader title="Dados Profissionais - Médico" margin="0 0 20px 0" />
      {renderContent()}
    </PageContent>
  )
}
