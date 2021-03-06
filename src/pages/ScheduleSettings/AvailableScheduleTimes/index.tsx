/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, notification, Row, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button, ButtonRow, Card, Form, InfoMessage, TimeBoard } from './styles'
import { Creators } from '../../../store/ducks/auth/reducer'
import { RootState } from '../../../store'
import { TDayOfWeek } from '../../../interfaces/week'
import { availableTimes } from '../../../utils/constants/availableTimes'
import { week } from '../../../utils/constants/week'
import { updateScheduleSettings } from '../../../services/requests/scheduleSettings'
import { PageContent } from '../../../components/UI/PageContent'
import { TableHeader } from '../../../components/UI/TableHeader'
import { Input } from '../../../components/UI/Input'

interface ISelectOption {
  label: string
  value: TDayOfWeek
}

interface IScheduleAvailableTimesValues {
  day: ISelectOption
}

const scheduleSettingsSchema = Yup.object().shape({
  day: Yup.object().required('Por favor, selecione um dia da semana!'),
})

const defaultValues = {
  day: week[1],
}

export const ScheduleAvailableTimes = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IScheduleAvailableTimesValues>({
    resolver: yupResolver(scheduleSettingsSchema),
    shouldUnregister: true,
    defaultValues,
    mode: 'onBlur',
  })
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.AuthReducer)
  const userScheduleAvailableTimes = user?.data?.doctor?.schedule_settings
  const userDefaultTimes = userScheduleAvailableTimes?.[defaultValues.day.value]
  const initialTimes = userDefaultTimes
    ? JSON.parse(userDefaultTimes)?.times
    : []
  const watchedDay = watch('day', defaultValues?.day)
  const [times, setTimes] = useState<string[]>(initialTimes)

  const onClear = (): void => {
    if (times?.length) {
      setTimes([])
    }
  }

  const onSubmit = async (
    values: IScheduleAvailableTimesValues
  ): Promise<void> => {
    if (!userScheduleAvailableTimes?.id) {
      return
    }

    const response = await updateScheduleSettings(
      userScheduleAvailableTimes.id,
      { [values.day.value]: { times } }
    )

    if (response.schedule_settings) {
      dispatch(
        Creators.setUser({
          ...user.data,
          doctor: {
            ...user.data.doctor,
            schedule_settings: {
              ...userScheduleAvailableTimes,
              [values.day.value]: JSON.stringify({ times }),
            },
          },
        })
      )
      notification.success({
        message: `As configura????es de hor??rios de ${values?.day?.label?.toLowerCase()} foram salvas com sucesso!`,
      })
    } else if (
      response.error?.status &&
      [400, 422].includes(response.error?.status)
    ) {
      notification.error({ message: response.error.message })
    }
  }

  const onClickCard = (value: string): void => {
    const filteredItems = [...times].filter((time) => time !== value)

    if (filteredItems.length < times.length) {
      setTimes(filteredItems)
    } else {
      setTimes([...times, value])
    }
  }

  return (
    <PageContent>
      <TableHeader title="Hor??rios Dispon??veis" />
      <InfoMessage>
        Selecione os hor??rios de sua agenda que estar??o dispon??veis para o
        agendamento de consultas para cada dia da semana. Basta clicar nos
        hor??rios desejados e, ao fim, clicar em{' '}
        <Typography.Text strong>Salvar Dados</Typography.Text> para gravar os
        hor??rios para o dia da semana selecionado. Os hor??rios que est??o em
        branco s??o os que voc?? n??o atua.
      </InfoMessage>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col span={12} sm={12} md={6} xs={24}>
            <Controller
              name="day"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <Input
                  label="Dia da Semana"
                  placeholder="Selecione um dia da semana"
                  error={errors?.day?.value?.message}
                  options={week}
                  selectOnChange={(newValue: any) => {
                    const selectedDayTimes =
                      userScheduleAvailableTimes?.[newValue?.value]

                    setValue('day', { ...newValue })
                    setTimes(
                      selectedDayTimes
                        ? JSON.parse(selectedDayTimes)?.times
                        : []
                    )
                  }}
                  isSelect
                  {...field}
                />
              )}
            />
          </Col>
        </Row>

        <TimeBoard>
          {availableTimes?.map((item) => (
            <Card
              key={item.value}
              isSelected={times.includes(item.value)}
              onClick={() => onClickCard(item.value)}
              title={`Clique para definir este hor??rio como dispon??vel para sua agenda de ${watchedDay?.label?.toLowerCase()}`}>
              {item.label}
            </Card>
          ))}
        </TimeBoard>

        <ButtonRow>
          <Col>
            <Button
              disabled={isSubmitting}
              onClick={onClear}
              color="white"
              type="reset"
              title={`Clique para desmarcar todos os hor??rios selecionados da ${watchedDay?.label?.toLowerCase()}`}>
              Desmarcar Todos
            </Button>
          </Col>

          <Col>
            <Button
              disabled={isSubmitting}
              type="submit"
              title={`Clique para salvar as configura????es de agenda para a ${watchedDay?.label?.toLowerCase()}`}>
              {isSubmitting ? 'Salvando os dados...' : 'Salvar Dados'}
            </Button>
          </Col>
        </ButtonRow>
      </Form>
    </PageContent>
  )
}
