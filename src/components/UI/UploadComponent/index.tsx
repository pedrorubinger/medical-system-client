/* eslint-disable @typescript-eslint/no-explicit-any */
import { Upload } from 'antd'
import type { UploadProps } from 'antd'

import { UploadIcon } from './styles'
import { Button, IButtonProps } from '../Button'

type IUploadButtonProps = IButtonProps

interface IUploadComponentProps extends UploadProps {
  /** @default 'Upload' */
  text?: string
  uploadProps: UploadProps
  buttonProps?: IUploadButtonProps
}

export const UploadComponent = ({
  text = 'Upload',
  uploadProps,
  buttonProps,
  ...rest
}: IUploadComponentProps) => {
  const getIcon = () => {
    if (buttonProps?.icon) {
      return buttonProps.icon
    }

    if (buttonProps?.icon === undefined) {
      return <UploadIcon />
    }

    return null
  }

  const PlainUploadButton = (
    <Button {...buttonProps} icon={getIcon()}>
      {text}
    </Button>
  )

  return (
    <Upload {...uploadProps} {...rest}>
      {PlainUploadButton}
    </Upload>
  )
}
