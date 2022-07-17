/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Col, Divider, Row, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import Skeleton from 'react-loading-skeleton'
import * as Yup from 'yup'
import 'react-loading-skeleton/dist/skeleton.css'

import { RootState } from '../../store'
import { IReportEntities, IReportPermission } from '../../interfaces/report'
import { fetchReports } from '../../services/requests/report'
import { fetchUsersDoctors } from '../../services/requests/user'
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

type Range = 'all' | 'dates'
type CardVisibility = IReportPermission | 'all_doctors'

interface IRecord {
  id: string
  title: string
  data: IReportEntities
  text: JSX.Element
  visible: CardVisibility[]
}

interface IRoleOption {
  value: IReportPermission
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

interface IFormatReportCardTextOptions {
  gender: 'f' | 'm' | 'both'
  plural: string
  singular: string
}

const rangeOptions: IRangeOption[] = [
  { value: 'all', label: 'Todo o período' },
  { value: 'dates', label: 'Selecionar datas' },
]
const roleOptions: IRoleOption[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'doctor', label: 'Médico(a)' },
]
const defaultDoctorOptions = [{ value: -1, label: 'Todos' }]

const SkeletonLoaderCards = Array.from(Array(12).keys()).map((_, i) => (
  <SkeletonReportCard key={i}>
    <Skeleton borderRadius={3} width="65%" height={14} />
    <SkeletonReportCardContent>
      <Skeleton borderRadius={3} width="100%" height={12} />
      <Skeleton borderRadius={3} width="100%" height={12} />
    </SkeletonReportCardContent>
  </SkeletonReportCard>
))

export const getFormattedReportCardText = (
  data: IReportEntities = [],
  options: IFormatReportCardTextOptions
): JSX.Element => {
  const length = data?.length
  const { singular, plural, gender } = options
  const femaleSingular = 'cadastrada'
  const femalePlural = 'cadastradas'
  const maleSingular = 'cadastrado'
  const malePlural = 'cadastrados'
  const bothSingular = 'cadastrado(a)'
  const bothPlural = 'cadastrados(as)'

  const getGender = () => {
    if (gender === 'f') {
      return [femaleSingular, femalePlural]
    }

    if (gender === 'm') {
      return [maleSingular, malePlural]
    }

    return [bothSingular, bothPlural]
  }

  if (!length) {
    return (
      <Typography.Text>
        Não haviam {plural} {getGender()[1]} neste período.
      </Typography.Text>
    )
  }

  if (length === 1) {
    return (
      <Typography.Text>
        Havia <Typography.Text strong>1</Typography.Text> {singular}{' '}
        {getGender()[0]} neste período.
      </Typography.Text>
    )
  }

  return (
    <Typography.Text>
      Haviam <Typography.Text strong>{length}</Typography.Text> {plural}{' '}
      {getGender()[1]} neste período.
    </Typography.Text>
  )
}

export const Reports = (): JSX.Element => {
  const user = useSelector((state: RootState) => state.AuthReducer)
  /** TO DO: Validate date intervals... (initial and final) */
  const searchValuesSchema = Yup.object().shape({
    range: Yup.object().required('Selecione um tipo!'),
    role: Yup.object().required('Selecione um papel/função!'),
    doctor: Yup.object().when(['role', 'user'], {
      is: (role: any, user: any) =>
        role?.value === 'doctor' ||
        (user?.data?.is_admin && user?.data?.role !== 'doctor'),
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
  const isAdmin = user?.data?.is_admin
  const isDoctor = user?.data?.role === 'doctor'
  const defaultValues = {
    range: rangeOptions[0] as IRangeOption,
    role: isAdmin ? roleOptions[0] : roleOptions[1],
    doctor: defaultDoctorOptions[0],
    initial_date: '',
    final_date: '',
  }
  const [isMounted, setIsMounted] = useState(false)
  const [searchedPermission, setSearchedPermission] =
    useState<IReportPermission | null>(null)
  const [isFetchingDoctors, setIsFetchingDoctors] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [doctorOptions, setDoctorOptions] =
    useState<IDoctorOption[]>(defaultDoctorOptions)
  const [records, setRecords] = useState<IRecord[]>([])
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ISearchValues>({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(searchValuesSchema),
  })
  const watchedRange = watch('range', defaultValues.range)
  const watchedRole = watch('role', defaultValues.role)
  const watchedDoctor = watch('doctor', defaultValues.doctor)

  const onSearch = async (values: ISearchValues) => {
    setSearchedPermission(null)
    setIsSearching(true)

    const getDoctorId = (): number | undefined => {
      if (
        (isDoctor && !isAdmin) ||
        (isDoctor && isAdmin && values.role.value === 'doctor')
      ) {
        return user?.data?.doctor?.id
      }

      if (values?.doctor?.value === -1) {
        return undefined
      }

      return values?.doctor?.value
    }

    const payload = {
      permission: watchedRole.value,
      initialDate: values?.initial_date,
      finalDate: values?.final_date,
      doctorId: getDoctorId(),
    }
    const response = await fetchReports(payload)

    if (response.data) {
      setRecords([
        {
          id: 'APPOINTMENTS',
          title: 'Consultas',
          visible: ['admin', 'doctor'],
          text: getFormattedReportCardText(response?.data?.appointments, {
            gender: 'f',
            plural: 'consultas',
            singular: 'consulta',
          }),
          data: response.data?.appointments || [],
        },
        {
          id: 'DOCTORS',
          title: 'Médicos',
          visible: ['admin', 'all_doctors'],
          text: getFormattedReportCardText(response.data?.doctors, {
            gender: 'both',
            plural: 'médicos(as)',
            singular: 'médico(a)',
          }),
          data: response.data?.doctors || [],
        },
        {
          id: 'PATIENTS',
          title: 'Pacientes',
          visible: ['admin', 'doctor'],
          text: getFormattedReportCardText(response.data?.patients, {
            gender: 'm',
            plural: 'pacientes',
            singular: 'paciente',
          }),
          data: response.data?.patients || [],
        },
        {
          id: 'INSURANCES',
          title: 'Convênios',
          visible: ['admin', 'doctor'],
          text: getFormattedReportCardText(response.data?.insurances, {
            gender: 'm',
            plural: 'convênios',
            singular: 'convênio',
          }),
          data: response.data?.insurances || [],
        },
        {
          id: 'PAYMENT_METHODS',
          title: 'Métodos de Pagamento',
          visible: ['admin', 'doctor'],
          text: getFormattedReportCardText(response.data?.paymentMethods, {
            gender: 'm',
            plural: 'métodos de pagamento',
            singular: 'método de pagamento',
          }),
          data: response.data?.paymentMethods || [],
        },
        {
          id: 'SPECIALTIES',
          title: 'Especialidades',
          visible: ['admin', 'doctor'],
          text: getFormattedReportCardText(
            response.data?.specialties || undefined,
            {
              gender: 'f',
              plural: 'especialidades médicas',
              singular: 'especialidade médica',
            }
          ),
          data: response.data?.specialties || [],
        },
        {
          id: 'USERS',
          title: 'Usuários',
          visible: ['admin', 'all_doctors'],
          text: getFormattedReportCardText(response.data?.users, {
            gender: 'm',
            plural: 'usuários',
            singular: 'usuário',
          }),
          data: response.data?.users || [],
        },
      ])
    } else {
      setRecords([])
    }

    setIsSearching(false)
    setSearchedPermission(values.role.value)
  }

  const fetchDoctorsAsync = useCallback(async () => {
    setIsFetchingDoctors(true)

    const response = await fetchUsersDoctors()

    if (response.data) {
      const doctors = response.data
      const doctorsList = [...doctors]
        .filter(({ doctor }) => doctor?.id !== user?.data?.doctor?.id)
        .map(({ name, doctor }) => ({
          value: doctor.id,
          label: name,
        }))

      doctorsList.unshift(defaultDoctorOptions[0])
      setDoctorOptions(doctorsList)
    }

    setIsFetchingDoctors(false)
  }, [])

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

        {(watchedRole?.value === 'admin' || (isAdmin && !isDoctor)) && (
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

  const renderContent = () => {
    if (isFetchingDoctors || !isMounted) {
      return (
        <InfoMessage>
          Por favor, aguarde. Estamos buscando as informações...
        </InfoMessage>
      )
    }

    if (isSearching) {
      return (
        <>
          <Divider />
          <CardsContainer>{SkeletonLoaderCards}</CardsContainer>
        </>
      )
    }

    if (searchedPermission) {
      return (
        <>
          <Divider />

          {records?.length ? (
            <CardsContainer>
              {records
                ?.filter(({ visible }) => {
                  if (
                    watchedRole?.value === 'admin' &&
                    watchedDoctor?.value !== -1 &&
                    visible.includes('all_doctors')
                  ) {
                    return false
                  }

                  return visible.includes(searchedPermission)
                })
                ?.map((card) => (
                  <ReportCard key={card.id}>
                    <ReportCardTitle>{card.title}</ReportCardTitle>
                    <ReportCardContent>{card.text}</ReportCardContent>
                  </ReportCard>
                ))}
            </CardsContainer>
          ) : (
            <Typography.Text type="secondary">
              Não encontramos nenhum resultado para sua busca.
            </Typography.Text>
          )}
        </>
      )
    }

    return null
  }

  useEffect(() => {
    setIsMounted(true)

    if (isAdmin) {
      fetchDoctorsAsync()
    }

    return () => {
      setIsMounted(false)
    }
  }, [isAdmin])

  useEffect(() => {
    if (watchedRole && searchedPermission) {
      setRecords([])
      setSearchedPermission(null)
    }
  }, [watchedRole])

  return (
    <PageContent>
      <TableHeader title="Relatórios" />
      {!!isMounted && !isFetchingDoctors && (
        <>
          <InfoMessage>
            Utilize os filtros abaixo para refinar os resultados da sua busca.
          </InfoMessage>
          {FormContent}
        </>
      )}
      {renderContent()}
    </PageContent>
  )
}
