/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Col, Row } from 'antd'
import {
  Control,
  Controller,
  FieldError,
  UseFormSetValue,
} from 'react-hook-form'

import { Input } from '../../../components/UI/Input'
import { ReadOnly } from '../../../components/UI/ReadOnly'
import {
  IAppointmentDrawerData,
  ICreateAppointmentFormValues,
} from './CreateAppointmentDrawer'
import { IEditAppointmentFormValues } from './EditAppointmentDrawer'
import { Button, CheckboxRow, LinkButton } from './styles'
import { getAppointmentValue } from './utils'

type SupportedFormValues =
  | ICreateAppointmentFormValues
  | IEditAppointmentFormValues

interface IUpdateAppointmentErrors {
  insurance?:
    | {
        value?: FieldError | undefined
      }
    | undefined
  specialty?:
    | {
        value?: FieldError | undefined
      }
    | undefined
  payment_method?:
    | {
        value?: FieldError | undefined
      }
    | undefined
}

interface ICreateAppointmentErrors extends IUpdateAppointmentErrors {
  is_follow_up?: FieldError | undefined
  patient?:
    | {
        value?: FieldError | undefined
      }
    | undefined
}

type SupportedFormErrors = ICreateAppointmentErrors | IUpdateAppointmentErrors

interface ISelectOption {
  value: number
  label: string
}

interface IAppointmentMainFormProps {
  AppointmentInfoFields: JSX.Element
  control: Control<SupportedFormValues, object>
  errors: SupportedFormErrors
  /** @default false */
  isFetchingLastAppointment: boolean
  lastAppointmentDate: string
  /** @default false */
  isSubmitting: boolean
  /** @default 'create' */
  type: 'create' | 'update'
  /** @default [] */
  paymentMethods: ISelectOption[]
  /** @default [] */
  insurances: ISelectOption[]
  /** @default [] */
  specialties: ISelectOption[]
  data?: IAppointmentDrawerData
  selectedPatient: ISelectOption | undefined
  watchedInsurance: ISelectOption | undefined
  watchedIsFollowUp: boolean
  setValue: UseFormSetValue<SupportedFormValues>
  setCurrentStep?: (value: React.SetStateAction<number>) => void
}

export const AppointmentMainForm = ({
  AppointmentInfoFields,
  control,
  data,
  errors,
  isSubmitting = false,
  isFetchingLastAppointment = false,
  insurances = [],
  lastAppointmentDate,
  paymentMethods = [],
  specialties = [],
  selectedPatient,
  type = 'create',
  watchedInsurance,
  watchedIsFollowUp,
  setCurrentStep,
  setValue,
}: IAppointmentMainFormProps) => {
  const isCreating = type === 'create'
  const isEditing = type === 'update'

  const getButtonValue = () => {
    if (isSubmitting) {
      return 'Processando...'
    }

    if (isEditing) {
      return 'Atualizar Consulta'
    }

    return 'Agendar Consulta'
  }

  return (
    <>
      {!!isCreating && (
        <LinkButton
          type="link"
          title="Deseja selecionar outro paciente?"
          style={{ marginBottom: 5 }}
          onClick={() => {
            setValue('patient', undefined)

            if (setCurrentStep) {
              setCurrentStep(1)
            }
          }}>
          Selecionar outro paciente
        </LinkButton>
      )}

      <Row>
        <Col span={24}>
          <ReadOnly
            label="Paciente"
            value={selectedPatient?.label || 'Não identificado'}
            required
          />
        </Col>
      </Row>

      {AppointmentInfoFields}

      <Row>
        <Col span={24}>
          <Controller
            control={control}
            name="insurance"
            render={({ field }) => (
              <Input
                label="Convênio Médico"
                placeholder="Selecionar Convênios"
                error={errors?.insurance?.value?.message}
                options={insurances}
                selectOnChange={(newValue: any) =>
                  setValue('insurance', newValue)
                }
                isSelect
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      {!!watchedIsFollowUp ||
        !watchedInsurance?.value ||
        (!!watchedInsurance?.value && watchedInsurance?.value === -1 && (
          <Row>
            <Col span={24}>
              <Controller
                control={control}
                name="payment_method"
                render={({ field }) => (
                  <Input
                    label="Método de Pagamento"
                    placeholder="Selecionar Método de Pagamento"
                    error={errors?.payment_method?.value?.message}
                    options={paymentMethods}
                    selectOnChange={(newValue: any) =>
                      setValue('payment_method', newValue)
                    }
                    isSelect
                    {...field}
                  />
                )}
              />
            </Col>
          </Row>
        ))}

      <Row>
        <Col span={24}>
          <Controller
            control={control}
            name="specialty"
            render={({ field }) => (
              <Input
                label="Especialidade"
                placeholder="Selecionar Especialidade"
                error={errors?.specialty?.value?.message}
                options={specialties}
                selectOnChange={(newValue: any) =>
                  setValue('specialty', newValue)
                }
                isSelect
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      {!!data?.appointment_follow_up_limit && (
        <Row>
          <Col span={24}>
            <ReadOnly
              label="Limite de Dias (Consulta de Retorno)"
              value={`${data.appointment_follow_up_limit} dias`}
              required
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col span={24}>
          <ReadOnly
            label="Data da Última Consulta"
            value={
              isFetchingLastAppointment ? 'Verificando...' : lastAppointmentDate
            }
            required
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <ReadOnly
            label="Valor Final (R$)"
            value={getAppointmentValue(
              watchedIsFollowUp,
              watchedInsurance,
              data
            )}
            required
          />
        </Col>
      </Row>

      <CheckboxRow>
        <Col>
          <Controller
            name="is_follow_up"
            control={control}
            render={({ field }) => (
              <Checkbox
                onChange={field.onChange}
                value={field.value}
                checked={field.value}>
                É consulta de retorno
              </Checkbox>
            )}
          />
        </Col>
      </CheckboxRow>

      <Row>
        <Col span={24}>
          <Button
            type="submit"
            disabled={isSubmitting}
            title={
              isSubmitting
                ? 'Clique para salvar os dados desta consulta'
                : 'Processando...'
            }>
            {getButtonValue()}
          </Button>
        </Col>
      </Row>
    </>
  )
}
