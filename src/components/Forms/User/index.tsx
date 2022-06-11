/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Col, Row } from 'antd'
import {
  Control,
  Controller,
  FieldError,
  UseFormSetValue,
} from 'react-hook-form'
import * as Yup from 'yup'

import { Button, CheckboxRow, Form } from './styles'
import { TRole } from '../../../interfaces/roles'
import { InfoTooltip } from '../../UI/InfoTooltip'
import { Input } from '../../UI/Input'
import { formatCPF } from '../../../utils/helpers/formatters'
import { ReadOnly } from '../../UI/ReadOnly'
import { getTranslatedRole } from '../../../utils/helpers/roles'

interface ISelectOption {
  label: string
  value: TRole
}

interface IFormErrors {
  name?: FieldError | undefined
  email?: FieldError | undefined
  cpf?: FieldError | undefined
  phone?: FieldError | undefined
  is_admin?: FieldError | undefined
  role?:
    | {
        value?: FieldError | undefined
      }
    | undefined
  crm_document?: FieldError | undefined
}

export interface IUserFormValues {
  name: string
  email: string
  cpf: string
  phone: string
  is_admin: boolean
  role: ISelectOption
  crm_document?: string
}

interface IUserForm {
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined
  setValue: UseFormSetValue<IUserFormValues>
  /** @default undefined */
  blockedRole?: ISelectOption | undefined
  /** @default true */
  showIsAdmin?: boolean | undefined
  control: Control<IUserFormValues, object>
  errors: IFormErrors
  isSubmitting: boolean
  watchedRole?: ISelectOption | undefined
  /** @default [] */
  rolesOptions?: ISelectOption[] | undefined
  /** @default 'Clique para cadastrar este novo usuário' */
  buttonTitle?: string | undefined
  /** @default 'Cadastrando...' */
  buttonLoadingText?: string | undefined
  /** @default 'Cadastrar' */
  buttonText?: string | undefined
}

export const userSchema = Yup.object().shape({
  name: Yup.string().required('Por favor, insira o nome completo!'),
  email: Yup.string()
    .email('Você deve fornecer um email válido!')
    .required('Por favor, insira um email!'),
  cpf: Yup.string()
    .required('Por favor, insira um CPF!')
    .test('is-cpf-valid', 'Informe um CPF válido!', (value) => {
      const cpf = value?.replace(/\D/g, '')

      return cpf?.length === 11
    }),
  phone: Yup.string().required('Por favor, insira um número de telefone!'),
  is_admin: Yup.boolean(),
  role: Yup.object().required('Por favor, selecione uma função!'),
  crm_document: Yup.string().when('role.value', {
    is: 'doctor',
    then: Yup.string().required('Por favor, insira o número do CRM!'),
  }),
})

export const UserForm = ({
  buttonTitle = 'Clique para cadastrar este novo usuário',
  buttonLoadingText = 'Cadastrando...',
  buttonText = 'Cadastrar',
  showIsAdmin = true,
  blockedRole,
  control,
  errors,
  isSubmitting,
  rolesOptions = [],
  watchedRole,
  onSubmit,
  setValue,
}: IUserForm) => {
  return (
    <Form onSubmit={onSubmit}>
      <Row>
        <Col span={24}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                label="Nome"
                placeholder="Digite o nome completo"
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
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                label="Email"
                placeholder="Digite o e-mail"
                error={errors?.email?.message}
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
            defaultValue=""
            render={({ field }) => (
              <Input
                label="CPF"
                placeholder="Digite o CPF"
                error={errors?.cpf?.message}
                required
                {...field}
                onChange={(e) => setValue('cpf', formatCPF(e.target.value))}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                label="Telefone"
                placeholder="Digite o telefone"
                error={errors?.phone?.message}
                required
                {...field}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          {blockedRole ? (
            <Controller
              name="role"
              control={control}
              defaultValue={blockedRole}
              render={() => (
                <ReadOnly
                  label="Função"
                  value={
                    blockedRole?.value === 'developer'
                      ? 'Administrador do Sistema'
                      : getTranslatedRole(blockedRole?.label as TRole)
                  }
                />
              )}
            />
          ) : (
            <Controller
              name="role"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <Input
                  label="Função"
                  placeholder="Selecione uma função"
                  error={errors?.role?.value?.message}
                  options={rolesOptions}
                  selectOnChange={(newValue: any) => {
                    setValue('role', { ...newValue })
                  }}
                  isSelect
                  required
                  {...field}
                />
              )}
            />
          )}
        </Col>
      </Row>

      {(watchedRole?.value === 'doctor' || blockedRole?.value === 'doctor') && (
        <Row>
          <Col span={24}>
            <Controller
              name="crm_document"
              control={control}
              render={({ field }) => (
                <Input
                  label="CRM"
                  placeholder="Informe o CRM do médico"
                  error={errors?.crm_document?.message}
                  required
                  {...field}
                />
              )}
            />
          </Col>
        </Row>
      )}

      {!!showIsAdmin && (
        <CheckboxRow>
          <Col>
            <Controller
              name="is_admin"
              control={control}
              render={({ field }) => (
                <Checkbox
                  onChange={field.onChange}
                  value={field.value}
                  checked={field.value}>
                  É administrador{' '}
                  <InfoTooltip text="Um usuário administrador não poderá ser excluído. Além disso, este usuário terá acesso aos relatórios da empresa, gestão de usuários, convênios e especialidades." />
                </Checkbox>
              )}
            />
          </Col>
        </CheckboxRow>
      )}

      <Row>
        <Col span={24}>
          <Button disabled={isSubmitting} type="submit" title={buttonTitle}>
            {isSubmitting ? buttonLoadingText : buttonText}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
