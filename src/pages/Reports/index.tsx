/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Col, Divider, Row, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import Skeleton from 'react-loading-skeleton'
import * as Yup from 'yup'
import 'react-loading-skeleton/dist/skeleton.css'

import { RootState } from '../../store'
import { PageContent } from '../../components/UI/PageContent'
import { TableHeader } from '../../components/UI/TableHeader'
import {
  CardsContainer,
  CustomButton,
  CustomInput,
  Form,
  InfoMessage,
  ReportCard,
  ReportCardContent,
  ReportCardTitle,
  SearchValuesRow,
  SkeletonReportCard,
  SkeletonReportCardContent,
} from './styles'

type Role = 'admin' | 'doctor'
type Range = 'all' | 'dates'

interface IRoleOption {
  value: Role
  label: string
}

interface IRangeOption {
  value: Range
  label: string
}

interface IDoctorOption {
  value: number
  label: string
}

interface ISearchValues {
  role: IRoleOption
  range: IRangeOption
  doctor?: IDoctorOption
  initial_date?: string
  final_date?: string
}

/** TO DO: Validate date intervals... (initial and final) */
const searchValuesSchema = Yup.object().shape({
  range: Yup.object().required('Selecione um tipo!'),
  role: Yup.object().required('Selecione um papel/função!'),
  doctor: Yup.object().when('role', {
    is: ({ value }: IRoleOption) => value === 'doctor',
    then: Yup.object().required('Selecione um médico!'),
  }),
  initial_date: Yup.string().when('range', {
    is: ({ value }: IRangeOption) => value === 'dates',
    then: Yup.string().required('Insira a data inicial!'),
  }),
  final_date: Yup.string().when('range', {
    is: ({ value }: IRangeOption) => value === 'dates',
    then: Yup.string().required('Insira a data final!'),
  }),
})
const rangeOptions: IRangeOption[] = [
  { value: 'all', label: 'Todo o período' },
  { value: 'dates', label: 'Selecionar datas' },
]
const roleOptions: IRoleOption[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'doctor', label: 'Médico(a)' },
]
const defaultDoctorOptions = [{ value: -1, label: 'Todos' }]
const mockedCardData = [
  {
    id: 1,
    title: 'Consultas atendidas',
    content: 'Neste mês você atendeu um total de 9 consultas',
  },
  {
    id: 2,
    title: 'Pacientes atendidos',
    content: 'Neste mês você atendeu um total de 6 pacientes',
  },
  {
    id: 3,
    title: 'Novos convênios',
    content: 'Neste mês você não cadastrou nenhum novo convênio',
  },
  {
    id: 4,
    title: 'Novos pacientes',
    content: 'Neste mês você teve 3 novos pacientes',
  },
  {
    id: 5,
    title: 'Consultas atendidas',
    content: 'Neste mês você atendeu um total de 9 consultas',
  },
  {
    id: 6,
    title: 'Pacientes atendidos',
    content: 'Neste mês você atendeu um total de 6 pacientes',
  },
  {
    id: 7,
    title: 'Novos convênios',
    content: 'Neste mês você não cadastrou nenhum novo convênio',
  },
  {
    id: 8,
    title: 'Novos pacientes',
    content: 'Neste mês você teve 3 novos pacientes',
  },
  {
    id: 9,
    title: 'Consultas atendidas',
    content: 'Neste mês você atendeu um total de 9 consultas',
  },
  {
    id: 10,
    title: 'Pacientes atendidos',
    content: 'Neste mês você atendeu um total de 6 pacientes',
  },
  {
    id: 11,
    title: 'Novos convênios',
    content: 'Neste mês você não cadastrou nenhum novo convênio',
  },
  {
    id: 12,
    title: 'Novos pacientes',
    content: 'Neste mês você teve 3 novos pacientes',
  },
]

const SkeletonLoaderStructure = Array.from(Array(12).keys()).map((_, i) => (
  <SkeletonReportCard key={i}>
    <Skeleton borderRadius={3} width="65%" height={14} />
    <SkeletonReportCardContent>
      <Skeleton borderRadius={3} width="100%" height={12} />
      <Skeleton borderRadius={3} width="100%" height={12} />
    </SkeletonReportCardContent>
  </SkeletonReportCard>
))

export const Reports = (): JSX.Element => {
  const user = useSelector((state: RootState) => state.AuthReducer)
  const isAdmin = user?.data?.is_admin
  const isDoctor = user?.data?.role === 'doctor'
  const defaultValues = {
    range: rangeOptions[0] as IRangeOption,
    role: isAdmin ? roleOptions[0] : roleOptions[1],
    doctor: defaultDoctorOptions[0],
    initial_date: '',
    final_date: '',
  }
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [doctorOptions, setDoctorOptions] =
    useState<IDoctorOption[]>(defaultDoctorOptions)
  const [records, setRecords] = useState<any>([])
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ISearchValues>({
    defaultValues,
    mode: 'onBlur',
    shouldUnregister: true,
    resolver: yupResolver(searchValuesSchema),
  })
  const watchedRange = watch('range', defaultValues.range)
  const watchedRole = watch('role', defaultValues.role)

  const onSearch = async (values: ISearchValues) => {
    setIsSearching(true)
    console.log('submitted values:', values)

    setTimeout(() => {
      setRecords(mockedCardData)
      setIsSearching(false)
      setHasSearched(true)
    }, 3500)
  }

  const FormContent = (
    <Form onSubmit={handleSubmit(onSearch)}>
      <SearchValuesRow gutter={12}>
        {!!isAdmin && !!isDoctor && (
          <Col span={4} lg={4} sm={12} xs={24}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Função"
                  placeholder="Selecionar"
                  error={errors?.role?.value?.message}
                  options={roleOptions}
                  showError={false}
                  disabled={isSearching}
                  selectOnChange={(newValue: any) => setValue('role', newValue)}
                  required
                  isSelect
                  {...field}
                />
              )}
            />
          </Col>
        )}

        {watchedRole?.value === 'admin' && (
          <Col span={5} lg={5} sm={12} xs={24}>
            <Controller
              name="doctor"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Médico(a)"
                  placeholder="Selecionar"
                  error={errors?.doctor?.value?.message}
                  options={doctorOptions}
                  showError={false}
                  disabled={isSearching}
                  selectOnChange={(newValue: any) =>
                    setValue('doctor', newValue)
                  }
                  required
                  isSelect
                  {...field}
                />
              )}
            />
          </Col>
        )}

        <Col span={4} lg={4} sm={12} xs={24}>
          <Controller
            name="range"
            control={control}
            render={({ field }) => (
              <CustomInput
                label="Período"
                placeholder="Selecionar"
                error={errors?.range?.value?.message}
                options={rangeOptions}
                showError={false}
                disabled={isSearching}
                selectOnChange={(newValue: any) => setValue('range', newValue)}
                required
                isSelect
                {...field}
              />
            )}
          />
        </Col>

        {watchedRange?.value === 'dates' && (
          <>
            <Col span={4} lg={4} sm={12} xs={24}>
              <Controller
                name="initial_date"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    type="date"
                    label="Data Inicial"
                    error={errors?.initial_date?.message}
                    disabled={isSearching}
                    required
                    {...field}
                  />
                )}
              />
            </Col>

            <Col span={4} lg={4} sm={12} xs={24}>
              <Controller
                name="final_date"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    type="date"
                    label="Data Final"
                    error={errors?.final_date?.message}
                    disabled={isSearching}
                    required
                    {...field}
                  />
                )}
              />
            </Col>
          </>
        )}
      </SearchValuesRow>

      <Row>
        <Col>
          <CustomButton
            disabled={isSearching}
            type="submit"
            title="Clique para buscar relatórios baseados nos filtros que você definiu">
            {isSearching ? 'Buscando...' : 'Buscar'}
          </CustomButton>
        </Col>
      </Row>
    </Form>
  )

  useEffect(() => {
    //
  }, [])

  return (
    <PageContent>
      <TableHeader title="Relatórios" />
      <InfoMessage>
        Utilize os filtros abaixo para refinar os resultados da sua busca.
      </InfoMessage>

      {FormContent}

      {!!isSearching && (
        <>
          <Divider />
          <CardsContainer>{SkeletonLoaderStructure}</CardsContainer>
        </>
      )}

      {!isSearching && !!hasSearched && (
        <>
          <Divider />

          {records?.length ? (
            <CardsContainer>
              {mockedCardData?.map((card) => (
                <ReportCard key={card.id}>
                  <ReportCardTitle>{card.title}</ReportCardTitle>
                  <ReportCardContent>{card.content}</ReportCardContent>
                </ReportCard>
              ))}
            </CardsContainer>
          ) : (
            <Typography.Text type="secondary">
              Não encontramos nenhum resultado para sua busca.
            </Typography.Text>
          )}
        </>
      )}
    </PageContent>
  )
}
