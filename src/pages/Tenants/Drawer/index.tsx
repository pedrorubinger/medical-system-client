import { Checkbox, Col, Drawer, notification, Row } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button, CheckboxRow, Form, InfoMessage } from './styles'
import { Input } from '../../../components/UI/Input'
import { InfoTooltip } from '../../../components/UI/InfoTooltip'
import { setFieldErrors } from '../../../utils/helpers/errors'
import { storeTenant } from '../../../services/requests/tenant'

interface ICreateTenantDrawerProps {
  isVisible: boolean
  onClose: () => void
  refetchData: () => void
}

const tenantSchema = Yup.object().shape({
  name: Yup.string().required('Por favor, insira o nome da clínica!'),
  is_active: Yup.boolean(),
})

interface IFormValues {
  name: string
  is_active: boolean
}

export const CreateTenantDrawer = ({
  isVisible,
  onClose,
  refetchData,
}: ICreateTenantDrawerProps) => {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormValues>({
    resolver: yupResolver(tenantSchema),
    shouldUnregister: true,
    defaultValues: {
      is_active: false,
      name: '',
    },
    mode: 'onBlur',
  })

  const closeDrawer = () => {
    reset()
    onClose()
  }

  const onSubmit = async (values: IFormValues) => {
    const response = await storeTenant(values)

    if (response.error) {
      setFieldErrors(setError, response.error)
      return
    }

    notification.success({ message: 'A clínica foi cadastrada com sucesso!' })
    closeDrawer()
    refetchData()
  }

  return (
    <Drawer
      visible={isVisible}
      title="Cadastrar Clínica"
      width={450}
      onClose={closeDrawer}
      destroyOnClose>
      <InfoMessage>
        Preencha os campos abaixo para cadastrar uma clínica no sistema.
        Posteriormente você poderá gerenciar os seus usuários.
      </InfoMessage>

      <Form onSubmit={handleSubmit(onSubmit)}>
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

        <CheckboxRow>
          <Col>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Checkbox
                  onChange={field.onChange}
                  value={field.value}
                  checked={field.value}>
                  Está Ativa&nbsp;
                  <InfoTooltip
                    iconSize={15}
                    text="Quando uma clínica está ativa, seus usuários têm acesso ao sistema normalmente. Caso contrário, o acesso dos usuários é bloqueado enquanto a clínica estiver inativa."
                  />
                </Checkbox>
              )}
            />
          </Col>
        </CheckboxRow>

        <Row>
          <Col span={24}>
            <Button
              disabled={isSubmitting}
              type="submit"
              title="Clique para cadastrar essa nova clínica">
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}
