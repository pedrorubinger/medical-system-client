/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Col, Drawer, notification, Row } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'

import { Button, Form } from './styles'
import { Input } from '../../../../components/UI/Input'
import { RootState } from '../../../../store'
import {
  manageDoctorInsurance,
  TManageDoctorInsuranceFlag,
} from '../../../../services/requests/doctor'
import { setFieldErrors } from '../../../../utils/helpers/errors'
import { convertBrCurrencyToNumber } from '../../../../utils/helpers/formatters'
import { IDoctorInsurance } from '../../../../interfaces/doctor'

interface ISelectOption {
  label: string
  value: number
}

interface IData {
  price: string
  id: number
}

interface IAttachInsurancesDrawer {
  /** @default false */
  isVisible: boolean
  type: 'create' | 'update'
  data?: IData
  /** @default [] */
  options: ISelectOption[]
  onClose: () => void
  setRecords: React.Dispatch<React.SetStateAction<IDoctorInsurance[]>>
}

interface IAttachInsuranceValues {
  price: string
  insurance: ISelectOption
}

const defaultValues = {
  price: undefined,
  insurance: undefined,
}

export const AttachInsuranceDrawer = ({
  isVisible = false,
  type,
  data,
  options,
  onClose,
  setRecords,
}: IAttachInsurancesDrawer) => {
  const attachInsuranceSchema = Yup.object().shape({
    price: Yup.string().required(
      'Por favor, insira o preço pago pelo convênio!'
    ),
    insurance: Yup.object().when(type, {
      is: (value: 'create' | 'update') => value === 'create',
      then: Yup.object().required('Por favor, escolha um convênio!'),
      otherwise: Yup.object(),
    }),
  })
  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IAttachInsuranceValues>({
    resolver: yupResolver(attachInsuranceSchema),
    defaultValues,
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const watchedName = watch('price', data?.price || '')
  const [currentPrice, setCurrentPrice] = useState<string>(data?.price || '')
  const user = useSelector((state: RootState) => state.AuthReducer)
  const doctor = user?.data?.doctor
  const isEditting = type === 'update'
  const isCreating = type === 'create'

  const priceHasChanged = () => {
    if (isEditting) {
      return currentPrice !== watchedName
    }

    return true
  }

  const closeDrawer = () => {
    reset(defaultValues)
    onClose()
  }

  const onSubmit = async (values: IAttachInsuranceValues) => {
    if (!doctor || (isEditting && !data?.id)) {
      return null
    }

    const price = convertBrCurrencyToNumber(values.price)
    const payload = {
      id: doctor.id,
      flag: 'attach' as TManageDoctorInsuranceFlag,
      insurances: [
        {
          insurance_id: data?.id ? data.id : values?.insurance?.value,
          price,
        },
      ],
    }
    const response = await manageDoctorInsurance(payload)

    if (response.insurances) {
      notification.success({
        message:
          'O valor por consulta deste convênio foi atualizado com sucesso!',
      })

      if (isEditting) {
        setRecords((prev) =>
          [...prev].map((insurance) => {
            if (insurance.id.toString() === data?.id?.toString()) {
              return { ...insurance, price }
            }

            return { ...insurance }
          })
        )
      }

      if (isCreating) {
        const valueId = values.insurance.value
        const newRecord = response.insurances.find(
          (insurance) => insurance.id.toString() === valueId?.toString()
        )

        if (newRecord) {
          setRecords((prev) => [...prev, { ...newRecord, price }])
        } else {
          notification.warn({
            message:
              'O convênio foi incluído na sua lista. No entanto, um erro ocorreu ao buscar os dados do convênio inserido. Por favor, recarregue a página!',
          })
        }
      }

      closeDrawer()
    } else if (response.error) {
      setFieldErrors(setError, response.error)
    }
  }

  const getButtonTitle = () => {
    if (isSubmitting) {
      return 'Aguarde. Salvando dados...'
    }

    if (isCreating) {
      return 'Clique para incluir este convênio à sua lista'
    }

    if (!priceHasChanged()) {
      return 'Faça mudanças no preço pago por este convênio para salvar as informações'
    }

    return 'Clique para atualizar o valor pago por este convênio'
  }

  const getButtonValue = () => {
    if (isSubmitting) {
      return 'Salvando...'
    }

    if (isCreating) {
      return 'Incluir Convênio'
    }

    return 'Atualizar Valor'
  }

  useEffect(() => {
    reset({ price: data?.price || '' })
    setCurrentPrice(data?.price || '')
  }, [data])

  return (
    <Drawer
      visible={isVisible}
      title={isCreating ? 'Incluir Convênio' : 'Atualizar Valor'}
      width={450}
      onClose={closeDrawer}
      destroyOnClose>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {isCreating && (
            <Col span={24}>
              <Controller
                name="insurance"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Convênio"
                    placeholder="Selecionar Convênio"
                    error={errors?.insurance?.value?.message}
                    options={options}
                    selectOnChange={(newValue: any) =>
                      setValue('insurance', newValue)
                    }
                    required
                    isSelect
                    {...field}
                  />
                )}
              />
            </Col>
          )}

          <Col span={24}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  label="Preço por Consulta (R$)"
                  required
                  isCurrency
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Button
              disabled={isSubmitting || !priceHasChanged()}
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
