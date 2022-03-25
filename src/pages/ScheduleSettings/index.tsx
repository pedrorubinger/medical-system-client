/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Col, Row, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button, ButtonCol, Card, Form, InfoMessage, TimeBoard } from './styles'
import { PageContent } from '../../components/UI/PageContent'
import { TableHeader } from '../../components/UI/TableHeader'
import { Input } from '../../components/UI/Input'
import { TDayOfWeek } from '../../interfaces/week'
import { week } from '../../utils/constants/week'
import { availableTimes } from '../../utils/constants/availableTimes'

interface ISelectOption {
  label: string
  value: TDayOfWeek
}

interface IScheduleSettingsValues {
  day: ISelectOption
}

const scheduleSettingsSchema = Yup.object().shape({
  day: Yup.object().required('Por favor, selecione um dia da semana!'),
})

const defaultValues = {
  day: week[1],
}

export const ScheduleSettings = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IScheduleSettingsValues>({
    resolver: yupResolver(scheduleSettingsSchema),
    shouldUnregister: true,
    defaultValues,
    mode: 'onBlur',
  })
  const watchedDay = watch('day', defaultValues?.day)
  const [times, setTimes] = useState<string[]>([])

  const onSubmit = async (values: IScheduleSettingsValues) => {
    console.log('submitted:', values)
  }

  console.log('TIMES:', times)

  const onClickCard = (value: string): void => {
    const filteredItems = [...times].filter((time) => time !== value)

    if (filteredItems.length < times.length) {
      setTimes(filteredItems)
    } else {
      setTimes([...times, value])
    }
  }

  useEffect(() => {
    setTimes([])
  }, [watchedDay])

  return (
    <PageContent>
      <TableHeader title="Configurações de Agenda" margin="0 0 5px 0" />
      <InfoMessage>
        Selecione os horários de sua agenda que estarão disponíveis para o
        agendamento de consultas para cada dia da semana. Basta clicar nos
        horários desejados e, ao fim, clicar em{' '}
        <Typography.Text strong>Salvar Dados</Typography.Text> para gravar os
        horários para o dia da semana selecionado. Os horários que estão em
        branco são os que você não atua.
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
                    setValue('day', { ...newValue })
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
              title={`Clique para definir este horário como disponível para sua agenda de ${watchedDay?.label?.toLowerCase()}`}>
              {item.label}
            </Card>
          ))}
        </TimeBoard>

        <Row>
          <ButtonCol span={24}>
            <Button
              disabled={isSubmitting}
              type="submit"
              title={`Clique para salvar as configurações de agenda para a ${watchedDay?.label?.toLowerCase()}`}>
              {isSubmitting ? 'Salvando os dados...' : 'Salvar Dados'}
            </Button>
          </ButtonCol>
        </Row>
      </Form>
    </PageContent>
  )
}
