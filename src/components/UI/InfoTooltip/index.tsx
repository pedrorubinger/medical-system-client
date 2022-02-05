import { Tooltip } from 'antd'

import { QuestionIcon } from './styles'

interface IInfoTooltipProps {
  text: string
  /** @default 17 */
  iconSize?: number
  /** @default 'top' */
  placement?: 'bottom' | 'top' | 'left' | 'right'
}

export const InfoTooltip = ({
  iconSize = 17,
  text,
  placement = 'top',
}: IInfoTooltipProps) => {
  return (
    <Tooltip title={text} placement={placement}>
      <QuestionIcon size={iconSize} />
    </Tooltip>
  )
}
