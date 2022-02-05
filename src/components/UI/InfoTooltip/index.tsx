import { Tooltip } from 'antd'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

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
      <AiOutlineQuestionCircle
        size={iconSize}
        style={{ marginBottom: -2.5, marginLeft: 3 }}
      />
    </Tooltip>
  )
}
