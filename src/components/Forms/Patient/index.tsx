import { useEffect, useState } from 'react'
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
import * as Yup from 'yup'

import { Button, CheckboxRow, Form } from './styles'
import { IAddress } from '../../../interfaces/address'
import { IPatient, TPatientData } from '../../../interfaces/patient'
import { formatCEP, formatCPF } from '../../../utils/helpers/formatters'
import { Input } from '../../UI/Input'
import { ReadOnly } from '../../UI/ReadOnly'

interface IFormErrors {
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

interface IPatientFormProps {
  control: Control<IPatientFormValues, object>
  data?: IPatient | undefined
  errors: IFormErrors
  /** @default undefined */
  watchedLocation?: string | undefined
  isSubmitting: boolean
  watchedAddressCheckbox: boolean
  type: 'create' | 'update'
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined
  getValues: UseFormGetValues<IPatientFormValues>
  setError: UseFormSetError<IPatientFormValues>
  setValue: UseFormSetValue<IPatientFormValues>
  resetDefaultValues: () => void
}

export const patientAndAddressSchema = Yup.object().shape({
  include_address: Yup.boolean(),
  // PATIENT SCHEMA
  name: Yup.string()
    .required('Por favor, insira o nome do paciente!')
    .max(150, 'O nome do paciente não pode ultrapassar 150 caracteres!'),
  cpf: Yup.string()
    .required('Por favor, insira o CPF do paciente!')
    .max(20, 'O CPF do paciente não pode ultrapassar 20 caracteres!')
    .test('is-cpf-valid', 'Informe um CPF válido!', (value) => {
      const cpf = value?.replace(/\D/g, '')

      return cpf?.length === 11
    }),
  birthdate: Yup.string()
    .required('Por favor, insira a data de nascimento do paciente!')
    .test(
      'birthdate-must-be-valid',
      'Por favor, insira uma data de nascimento válida!',
      (birthdate?: string) => {
        if (!birthdate) {
          return true
        }

        return Date.parse(birthdate) < Date.parse(new Date().toString())
      }
    ),
  primary_phone: Yup.string()
    .required('Por favor, insira o telefone principal do paciente!')
    .max(
      30,
      'O telefone principal do paciente não pode ultrapassar 30 caracteres!'
    ),
  mother_name: Yup.string()
    .required('Por favor, insira o nome da mãe do paciente!')
    .max(150, 'O nome da mãe do paciente não pode ultrapassar 150 caracteres!'),
  father_name: Yup.string().max(
    150,
    'O nome do pai do paciente não pode ultrapassar 150 caracteres!'
  ),
  secondary_phone: Yup.string().max(
    30,
    'O telefone secundário do paciente não pode ultrapassar 30 caracteres!'
  ),
  email: Yup.string().max(
    80,
    'O email do paciente não pode ultrapassar 80 caracteres!'
  ),
  // ADDRESS SCHEMA
  street: Yup.string().when('include_address', {
    is: (value: boolean | undefined) => !!value,
    then: Yup.string()
      .required('Por favor, insira o nome da rua!')
      .max(80, 'O nome do paciente não pode ultrapassar 80 caracteres!'),
  }),
  number: Yup.string().when('include_address', {
    is: (value: boolean | undefined) => !!value,
    then: Yup.string()
      .required('Por favor, insira o número da residência!')
      .max(
        10,
        'O número da residência do paciente não pode ultrapassar 10 caracteres!'
      ),
  }),
  neighborhood: Yup.string().when('include_address', {
    is: (value: boolean | undefined) => !!value,
    then: Yup.string()
      .required('Por favor, insira o bairro do paciente!')
      .max(50, 'O bairro do paciente não pode ultrapassar 50 caracteres!'),
  }),
  postal_code: Yup.string().when('include_address', {
    is: (value: boolean | undefined) => !!value,
    then: Yup.string()
      .required('Por favor, insira o CEP do paciente!')
      .max(15, 'O CEP do paciente não pode ultrapassar 15 caracteres!'),
  }),
  complement: Yup.string().when('include_addres', {
    is: (value: boolean | undefined) => !!value,
    then: Yup.string().max(
      50,
      'O complemento do endereço do paciente não pode ultrapassar 50 caracteres!'
    ),
  }),
})

export const PatientForm = ({
  control,
  data,
  errors,
  isSubmitting,
  watchedAddressCheckbox,
  watchedLocation,
  type,
  onSubmit,
  getValues,
  resetDefaultValues,
  setError,
  setValue,
}: IPatientFormProps) => {
  const isCreating = type === 'create'
  const [isFetchingPostalCode, setIsFetchingPostalCode] = useState(false)

  const getButtonTitle = () => {
    if (isSubmitting) {
      return 'Aguarde. Salvando dados do paciente...'
    }

    if (isCreating) {
      return 'Clique para cadastrar este novo paciente'
    }

    return 'Clique para atualizar os dados deste paciente'
  }

  const getButtonValue = () => {
    if (isSubmitting) {
      return 'Salvando...'
    }

    if (isCreating) {
      return 'Cadastrar Paciente'
    }

    return 'Atualizar Dados'
  }

  const getIncludeAddressLabel = () => {
    if (isCreating || !data?.address) {
      return 'Cadastrar Endereço'
    }

    return 'Manter Endereço'
  }

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

      {!!watchedLocation && !!getValues()?.postal_code && (
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

  useEffect(() => {
    ;(async () => {
      const postal_code = data?.address?.postal_code

      if (postal_code) {
        const response = await fetchPostalCode(postal_code)

        setValue('location', response?.location || '')
      }
    })()

    resetDefaultValues()
  }, [data])

  return (
    <Form onSubmit={onSubmit}>
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

      <Row>
        <Col span={24}>
          <Button
            type="submit"
            disabled={isSubmitting || isFetchingPostalCode}
            title={getButtonTitle()}>
            {getButtonValue()}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
