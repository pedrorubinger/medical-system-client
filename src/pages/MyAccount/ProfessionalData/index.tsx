/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Col, notification, Row, Spin } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { PageContent } from '../../../components/UI/PageContent'
import { TableHeader } from '../../../components/UI/TableHeader'
import { Input } from '../../../components/UI/Input'
import { Button, ButtonContainer, Form } from '../styles'
import { IUser } from '../../../interfaces/user'
import { fetchInsurances } from '../../../services/requests/insurance'
import { fetchSpecialties } from '../../../services/requests/specialty'
import { IInsurance } from '../../../interfaces/insurance'
import { ISpecialty } from '../../../interfaces/specialty'
import { IError } from '../../../interfaces/error'

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
  crm_document: string
}

const professionalDataSchema = Yup.object().shape({
  crm_document: Yup.string().required('Por favor, insira o número do CRM!'),
  specialties: Yup.array().nullable(true),
  insurances: Yup.array().nullable(true),
})

const formatOptions = (
  data: IInsurance[] | ISpecialty[] = []
): ISelectOption[] => {
  return data.map((item) => ({ value: item.id, label: item.name }))
}

const formatSelectOption = (
  data?: IInsurance[] | ISpecialty[]
): ISelectOption[] | undefined =>
  data?.length ? [{ value: data?.[0]?.id, label: data?.[0]?.name }] : undefined

export const ProfessionalData = ({ user }: IProfessionalDataProps) => {
  const initialValues: IProfessionalDataFormValues = {
    crm_document: user?.doctor?.crm_document || '',
    insurances: formatSelectOption(user?.doctor?.insurance),
    specialties: formatSelectOption(user?.doctor?.specialty),
  }
  const {
    control,
    handleSubmit,
    // setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IProfessionalDataFormValues>({
    mode: 'onChange',
    resolver: yupResolver(professionalDataSchema),
    shouldUnregister: true,
    defaultValues: initialValues,
  })
  const [specialtiesOptions, setSpecialtiesOptions] = useState<ISelectOption[]>(
    []
  )
  const [insurancesOptions, setInsurancesOptions] = useState<ISelectOption[]>(
    []
  )
  const [fetchingData, setFetchingData] = useState(false)
  const [httpErrors, setHttpErrors] = useState<IError[]>([])

  const onSubmit = async (values: IProfessionalDataFormValues) => {
    console.log('submitted professional data:', values)

    notification.success({
      message: 'Os seus dados profissionais foram atualizados com sucesso!',
    })
  }

  useEffect(() => {
    ;(async () => {
      setFetchingData(true)

      const insurancesResponse = await fetchInsurances()
      const specialtiesResponse = await fetchSpecialties()
      const errorHasOccurred =
        insurancesResponse.error || specialtiesResponse.error

      if (!errorHasOccurred) {
        if (insurancesResponse?.data) {
          setInsurancesOptions(formatOptions(insurancesResponse.data))
        }

        if (specialtiesResponse?.data) {
          setSpecialtiesOptions(formatOptions(specialtiesResponse.data))
        }
      } else {
        if (insurancesResponse.error && specialtiesResponse.error) {
          setHttpErrors([insurancesResponse.error, specialtiesResponse.error])
        }

        if (insurancesResponse.error) {
          setHttpErrors([insurancesResponse.error])
        }

        if (specialtiesResponse.error) {
          setHttpErrors([specialtiesResponse.error])
        }
      }

      setFetchingData(false)
    })()
  }, [])

  const ErrorOnLoadData = (
    <>
      <h2>
        Desculpe, mas não foi possível buscar os dados profissionais neste
        momento. O seguinte erro ocorreu:
      </h2>
      {httpErrors.map((item: IError, i: number) => (
        <h3 key={i}>{item.message}</h3>
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
            name="specialties"
            control={control}
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
            name="insurances"
            control={control}
            render={({ field }) => (
              <Input
                label="Convênios"
                placeholder="Selecionar Convênios"
                error={errors?.insurances?.[0]?.value?.message}
                options={insurancesOptions}
                selectOnChange={(newValue: any) =>
                  setValue('insurances', newValue)
                }
                isSelect
                isMulti
                {...field}
              />
            )}
          />
        </Col>
      </Row>

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

    if (fetchingData) {
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
