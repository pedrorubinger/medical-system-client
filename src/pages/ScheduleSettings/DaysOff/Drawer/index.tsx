import { Col, Drawer, notification, Row } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSelector } from 'react-redux'
import { AnyObject } from 'yup/lib/types'
import * as Yup from 'yup'

import { Button, Form } from './styles'
import { IScheduleDaysOffFormValues } from '../../../../interfaces/scheduleDaysOff'
import { storeScheduleDayOff } from '../../../../services/requests/scheduleDaysOff'
import { RootState } from '../../../../store'
import { setFieldErrors } from '../../../../utils/helpers/errors'
import { Input } from '../../../../components/UI/Input'
import { getDrawerWidth } from '../../../../utils/helpers/formatters'

interface IScheduleDaysOffDrawerProps {
  /** @default false */
  isVisible: boolean
  type: 'create' | 'update'
  onClose: () => void
  refetchData: () => void
  // setRecords: React.Dispatch<React.SetStateAction<IScheduleDaysOff[]>>
}

const defaultValues: IScheduleDaysOffFormValues = {
  datetime_start: '',
  datetime_end: '',
}

export const ScheduleDaysOffDrawer = ({
  isVisible = false,
  type,
  refetchData,
  onClose,
}: IScheduleDaysOffDrawerProps) => {
  const scheduleDaysOffSchema = Yup.object().shape({
    datetime_start: Yup.string()
      .required('Por favor, insira a data e horário inicial!')
      .test(
        'datetime-start-is-less-than-current-datetime',
        'A data deve ser maior ou igual à data de hoje!',
        (datetimeStart?: string) => {
          if (!datetimeStart) {
            return true
          }

          return Date.parse(datetimeStart) > Date.parse(new Date().toString())
        }
      ),
    datetime_end: Yup.string()
      .required('Por favor, insira a data e horário final!')
      .test(
        'datetime-end-is-less-than-datetime-start',
        'A data deve ser maior que a data inicial!',
        (datetimeEnd?: string, ctx?: Yup.TestContext<AnyObject>) => {
          const datetimeStart = ctx?.parent?.datetime_start

          if (!datetimeEnd || !datetimeStart) {
            return true
          }

          return Date.parse(datetimeEnd) > Date.parse(datetimeStart)
        }
      ),
  })
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IScheduleDaysOffFormValues>({
    resolver: yupResolver(scheduleDaysOffSchema),
    defaultValues,
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const user = useSelector((state: RootState) => state.AuthReducer)
  const doctor = user?.data?.doctor
  const isEditing = type === 'update'
  const isCreating = type === 'create'

  const closeDrawer = () => {
    reset(defaultValues)
    onClose()
  }

  const onSubmit = async (values: IScheduleDaysOffFormValues) => {
    const payload = {
      datetime_start: values.datetime_start.split('T').join(' '),
      datetime_end: values.datetime_end.split('T').join(' '),
      doctor_id: doctor.id,
    }
    const response = await storeScheduleDayOff(payload)

    if (response.schedule_days_off) {
      notification.success({
        message: 'Seu intervalo de folga foi registrado com sucesso!',
      })
      refetchData()
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
      return 'Clique para incluir esse intervalo de datas de folga/ausência'
    }

    return 'Clique para atualizar esse intervalo de datas de folga/ausência'
  }

  const getButtonValue = () => {
    if (isSubmitting) {
      return 'Salvando...'
    }

    if (isCreating) {
      return 'Incluir Data'
    }

    if (isEditing) {
      return 'Atualizar Data'
    }
  }

  return (
    <Drawer
      visible={isVisible}
      title={isCreating ? 'Incluir Folga/Ausência' : 'Atualizar Folga/Ausência'}
      width={getDrawerWidth(450)}
      onClose={closeDrawer}
      destroyOnClose>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col span={24}>
            <Controller
              name="datetime_start"
              control={control}
              render={({ field }) => (
                <Input
                  label="Data Inicial"
                  type="datetime-local"
                  placeholder="Escolher data inicial"
                  error={errors?.datetime_start?.message}
                  required
                  {...field}
                />
              )}
            />
          </Col>

          <Col span={24}>
            <Controller
              name="datetime_end"
              control={control}
              render={({ field }) => (
                <Input
                  label="Data Final"
                  type="datetime-local"
                  placeholder="Escolher data final"
                  error={errors?.datetime_end?.message}
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
              type="submit"
              disabled={isSubmitting}
              title={getButtonTitle()}>
              {getButtonValue()}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}
