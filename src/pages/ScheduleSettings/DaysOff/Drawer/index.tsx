/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Col, Drawer, notification, Row } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'

import { Button, Form } from './styles'
// import { setFieldErrors } from '../../../../utils/helpers/errors'
import { IScheduleDaysOffFormValues } from '../../../../interfaces/scheduleDaysOff'
import { RootState } from '../../../../store'
import { Input } from '../../../../components/UI/Input'

interface IScheduleDaysOffDrawerProps {
  /** @default false */
  isVisible: boolean
  type: 'create' | 'update'
  onClose: () => void
  // setRecords: React.Dispatch<React.SetStateAction<IScheduleDaysOff[]>>
}

const defaultValues: IScheduleDaysOffFormValues = {
  datetime_start: '',
  datetime_end: '',
}

export const ScheduleDaysOffDrawer = ({
  isVisible = false,
  type,
  onClose,
}: IScheduleDaysOffDrawerProps) => {
  const scheduleDaysOffSchema = Yup.object().shape({
    datetime_start: Yup.string().required(
      'Por favor, insira a data e horário inicial!'
    ),
    datetime_end: Yup.string().required(
      'Por favor, insira a data e horário final!'
    ),
  })
  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IScheduleDaysOffFormValues>({
    resolver: yupResolver(scheduleDaysOffSchema),
    defaultValues,
    shouldUnregister: true,
    mode: 'onBlur',
  })
  const user = useSelector((state: RootState) => state.AuthReducer)
  const doctor = user?.data?.doctor
  const isEditting = type === 'update'
  const isCreating = type === 'create'

  const closeDrawer = () => {
    reset(defaultValues)
    onClose()
  }

  const onSubmit = async (values: IScheduleDaysOffFormValues) => {
    console.log('submitted:', values)
    // Implement method...
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

    return 'Atualizar Data'
  }

  return (
    <Drawer
      visible={isVisible}
      title={isCreating ? 'Incluir Folga/Ausência' : 'Atualizar Folga/Ausência'}
      width={450}
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
