import { useEffect } from 'react'
import { Checkbox, Col, Row } from 'antd'
import Axios from 'axios'
import {
  Control,
  Controller,
  FieldError,
  UseFormGetValues,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form'

import { Input } from '../../UI/Input'
import { ReadOnly } from '../../UI/ReadOnly'
import { IPatient, TPatientData } from '../../../interfaces/patient'
import { IAddress } from '../../../interfaces/address'
import { formatCEP, formatCPF } from '../../../utils/helpers/formatters'
import { CheckboxRow } from './styles'

interface IPatientAndAddressFormErrors {
  name?: FieldError | undefined
  cpf?: FieldError | undefined
  birthdate?: FieldError | undefined
  mother_name?: FieldError | undefined
  primary_phone?: FieldError | undefined
  address_id?: FieldError | undefined
  father_name?: FieldError | undefined | undefined
  secondary_phone?: FieldError | undefined | undefined
  email?: FieldError | undefined
  street?: FieldError | undefined
  number?: FieldError | undefined
  neighborhood?: FieldError | undefined
  postal_code?: FieldError | undefined
  location?: FieldError | undefined
  complement?: FieldError | undefined
}

interface IPatientFormValues extends TPatientData, IAddress {
  include_address: boolean
  location?: string | undefined
}

interface IPatientFormFieldsProps {
  control: Control<IPatientFormValues, object>
  isCreating: boolean
  data?: IPatient | undefined
  errors: IPatientAndAddressFormErrors
  watchedAddressCheckbox: boolean
  watchedPostalCode: string
  watchedLocation?: string | undefined
  isFetchingPostalCode: boolean
  setError: UseFormSetError<IPatientFormValues>
  getValues: UseFormGetValues<IPatientFormValues>
  setValue: UseFormSetValue<IPatientFormValues>
  setIsFetchingPostalCode: React.Dispatch<React.SetStateAction<boolean>>
  resetDefaultValues: () => void
}

export const PatientFormFields = ({
  control,
  isCreating,
  data,
  errors,
  isFetchingPostalCode,
  watchedAddressCheckbox,
  watchedPostalCode,
  watchedLocation,
  resetDefaultValues,
  getValues,
  setValue,
  setError,
  setIsFetchingPostalCode,
}: IPatientFormFieldsProps) => {
  const PatientForm = (
    <>
      <Row>
        <Col span={24}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                label="Nome Completo"
                placeholder="Nome do paciente"
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
          <Controller
            name="birthdate"
            control={control}
            render={({ field }) => (
              <Input
                type="date"
                label="Data de Nascimento"
                error={errors?.birthdate?.message}
                required
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <Input
                label="CPF"
                placeholder="CPF do paciente"
                error={errors?.cpf?.message}
                {...field}
                onChange={(e) => setValue('cpf', formatCPF(e.target.value))}
                required
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Controller
            name="primary_phone"
            control={control}
            render={({ field }) => (
              <Input
                label="Telefone Principal"
                placeholder="Telefone principal do paciente"
                error={errors?.primary_phone?.message}
                required
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Controller
            name="secondary_phone"
            control={control}
            render={({ field }) => (
              <Input
                label="Telefone Alternativo"
                placeholder="Telefone secundário do paciente"
                error={errors?.secondary_phone?.message}
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                label="Email"
                placeholder="Email do paciente"
                error={errors?.email?.message}
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Controller
            name="mother_name"
            control={control}
            render={({ field }) => (
              <Input
                label="Nome da Mãe"
                placeholder="Nome da mãe do paciente"
                error={errors?.mother_name?.message}
                required
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Controller
            name="father_name"
            control={control}
            render={({ field }) => (
              <Input
                label="Nome do Pai"
                placeholder="Nome do pai do paciente"
                error={errors?.father_name?.message}
                {...field}
              />
            )}
          />
        </Col>
      </Row>
    </>
  )

  const AddressForm = (
    <>
      <Row>
        <Col span={24}>
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <Input
                label="Rua"
                placeholder="Nome da rua"
                error={errors?.street?.message}
                required
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <Input
                label="Número"
                placeholder="Nome da residência"
                error={errors?.number?.message}
                required
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Controller
            name="neighborhood"
            control={control}
            render={({ field }) => (
              <Input
                label="Bairro"
                placeholder="Bairro da residência"
                error={errors?.neighborhood?.message}
                required
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Controller
            name="postal_code"
            control={control}
            render={({ field }) =>
              isFetchingPostalCode ? (
                <ReadOnly label="CEP" value="Validando CEP..." />
              ) : (
                <Input
                  label="CEP"
                  labelWithLoader={isFetchingPostalCode}
                  placeholder="35970-000"
                  error={errors?.postal_code?.message}
                  required
                  {...field}
                  onChange={async (e) => {
                    const value = e.target.value
                    const digits = value?.replace(/\D/g, '')
                    const isCompleted = digits?.length === 8

                    setValue('location', '')

                    if (value?.length !== 10) {
                      setValue('postal_code', formatCEP(value))
                    }

                    if (isCompleted) {
                      const response = await fetchPostalCode(digits)
                      const formValues = getValues()

                      setValue(
                        'street',
                        response?.street || formValues?.street || ''
                      )
                      setValue(
                        'location',
                        response?.location || formValues?.location || ''
                      )
                      setValue(
                        'neighborhood',
                        response?.neighborhood || formValues?.neighborhood || ''
                      )
                      setValue(
                        'complement',
                        response?.complement || formValues?.complement || ''
                      )
                    }
                  }}
                />
              )
            }
          />
        </Col>
      </Row>

      {!!watchedLocation && !!watchedPostalCode && (
        <Row>
          <Col span={24}>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <ReadOnly label="Local" value={field?.value || ''} />
              )}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col span={24}>
          <Controller
            name="complement"
            control={control}
            render={({ field }) => (
              <Input
                label="Complemento"
                placeholder="Complemento do endereço"
                error={errors?.complement?.message}
                {...field}
              />
            )}
          />
        </Col>
      </Row>
    </>
  )

  const fetchPostalCode = async (value: string) => {
    setIsFetchingPostalCode(true)

    try {
      const url = `https://viacep.com.br/ws/${value}/json/`
      const response = await Axios.get(url)

      if (response?.data?.erro) {
        setError('postal_code', {
          type: 'manual',
          message: 'Este código postal (CEP) é inválido!',
        })
      }

      return {
        postal_code: response?.data?.erro ? '' : value,
        location:
          response?.data?.localidade && response?.data?.uf
            ? `${response.data.localidade}, ${response.data.uf}`
            : '',
        street: response?.data?.logradouro || '',
        neighborhood: response?.data?.bairro || '',
        complement: response?.data?.complemento || '',
      }
    } catch (err) {
      setError('postal_code', {
        type: 'manual',
        message:
          'Desculpe, um erro ocorreu ao buscar o CEP. Por favor, tente novamente mais tarde!',
      })
    } finally {
      setIsFetchingPostalCode(false)
    }
  }

  const getIncludeAddressLabel = () => {
    if (isCreating || !data?.address) {
      return 'Cadastrar Endereço'
    }

    return 'Manter Endereço'
  }

  useEffect(() => {
    ;(async () => {
      const postal_code = data?.address?.postal_code

      if (postal_code) {
        const response = await fetchPostalCode(postal_code)

        setValue('location', response?.location || '')
      }
    })()

    if (data) {
      resetDefaultValues()
    }
  }, [data?.address?.postal_code])

  return (
    <>
      {PatientForm}
      {!!watchedAddressCheckbox && AddressForm}
      <CheckboxRow>
        <Col>
          <Controller
            name="include_address"
            control={control}
            render={({ field }) => (
              <Checkbox
                onChange={field.onChange}
                value={field.value}
                checked={field.value}>
                {getIncludeAddressLabel()}
              </Checkbox>
            )}
          />
        </Col>
      </CheckboxRow>
    </>
  )
}
