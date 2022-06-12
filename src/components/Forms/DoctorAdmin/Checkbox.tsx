/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Col } from 'antd'
import { ControllerRenderProps } from 'react-hook-form'

import { CheckboxRow } from './styles'
import { InfoTooltip } from '../../UI/InfoTooltip'

interface IDoctorAdminCheckboxProps {
  field: ControllerRenderProps<any, 'include'>
  /** @default 'Incluir à minha lista' */
  label?: string
  /** @default 'Você incluirá este item à sua lista' */
  tooltipText?: string
}

export const DoctorAdminCheckbox = ({
  field,
  label = 'Incluir à minha lista',
  tooltipText = 'Você incluirá este item à sua lista',
}: IDoctorAdminCheckboxProps) => {
  return (
    <>
      <CheckboxRow>
        <Col>
          <Checkbox
            onChange={field.onChange}
            value={field.value}
            checked={field.value}>
            {label} <InfoTooltip text={tooltipText} />
          </Checkbox>
        </Col>
      </CheckboxRow>
    </>
  )
}
