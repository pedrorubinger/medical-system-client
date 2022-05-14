import { useState } from 'react'
import { Col, Drawer, notification, Row } from 'antd'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { storePatient, updatePatient } from '../../../services/requests/patient'
import { IPatient, TPatientData } from '../../../interfaces/patient'
import { IAddress } from '../../../interfaces/address'
import { setFieldErrors } from '../../../utils/helpers/errors'
import { Button, Form } from './styles'
import { PatientFormFields } from '../../../components/Forms/Patient/PatientFormFields'

interface IPatientDrawerProps {
  isVisible: boolean
  type: 'update' | 'create'
  data?: IPatient | undefined
  onClose: () => void
  fetchPatients: () => void
}

interface IPatientFormValues extends TPatientData, IAddress {
  include_address: boolean
  location?: string | undefined
}

const patientAndAddressSchema = Yup.object().shape({
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

export const PatientDrawer = ({
  data,
  isVisible,
  type,
  onClose,
  fetchPatients,
}: IPatientDrawerProps) => {
  const defaultValues = {
    include_address: !!data?.address,
    name: data?.name || '',
    cpf: data?.cpf || '',
    birthdate: data?.birthdate?.split('T')?.[0] || '',
    primary_phone: data?.primary_phone || '',
    mother_name: data?.mother_name || '',
    father_name: data?.father_name || '',
    secondary_phone: data?.secondary_phone || '',
    email: data?.email || '',
    street: data?.address?.street || '',
    number: data?.address?.number || '',
    neighborhood: data?.address?.neighborhood || '',
    postal_code: data?.address?.postal_code || '',
    complement: data?.address?.complement || '',
  }
  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IPatientFormValues>({
    defaultValues,
    resolver: yupResolver(patientAndAddressSchema),
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const watchedAddressCheckbox = watch('include_address', !!data?.address)
  const watchedLocation = watch('location', '')
  const watchedPostalCode = watch('postal_code', '')
  const isEditing = type === 'update'
  const isCreating = type === 'create'
  const [isFetchingPostalCode, setIsFetchingPostalCode] = useState(false)

  const closeDrawer = () => {
    reset()
    onClose()
  }

  const onSubmit = async (values: IPatientFormValues): Promise<void> => {
    if (isEditing && !data?.id) {
      return
    }

    const payload: TPatientData = {
      name: values.name,
      birthdate: values.birthdate,
      cpf: values.cpf,
      primary_phone: values.primary_phone,
      secondary_phone: values.secondary_phone || undefined,
      email:
        isEditing && values.email === data?.email
          ? undefined
          : values.email || undefined,
      mother_name: values.mother_name,
      father_name: values.father_name || undefined,
      address: undefined,
    }

    if (values.include_address) {
      payload.address = {
        street: values.street,
        number: values.number,
        neighborhood: values.neighborhood,
        postal_code: values.postal_code?.replace(/\D/g, ''),
        complement: values.complement,
      }

      if (isEditing && data?.address?.id) {
        payload.address.id = data.address.id
      }
    }

    const response = isEditing
      ? await updatePatient(data?.id || 0, {
          ...payload,
          cpf: values.cpf === data?.cpf ? undefined : values.cpf,
        })
      : await storePatient(payload)

    if (response.error) {
      setFieldErrors(setError, response.error)
      return
    }

    notification.success({
      message: isCreating
        ? 'O paciente foi cadastrado com sucesso!'
        : 'Os dados do paciente foram atualizados com sucesso!',
    })
    closeDrawer()
    fetchPatients()
  }

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

  const resetDefaultValues = () => reset(defaultValues)

  return (
    <Drawer
      visible={isVisible}
      title={isCreating ? 'Cadastrar Paciente' : 'Atualizar Dados'}
      width={450}
      onClose={closeDrawer}
      destroyOnClose>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <PatientFormFields
          data={data}
          isCreating={isCreating}
          errors={errors}
          control={control}
          watchedAddressCheckbox={watchedAddressCheckbox}
          watchedLocation={watchedLocation}
          isFetchingPostalCode={isFetchingPostalCode}
          watchedPostalCode={watchedPostalCode}
          resetDefaultValues={resetDefaultValues}
          getValues={getValues}
          setIsFetchingPostalCode={setIsFetchingPostalCode}
          setValue={setValue}
          setError={setError}
        />

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
    </Drawer>
  )
}
