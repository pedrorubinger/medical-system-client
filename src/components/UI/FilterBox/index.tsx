import React from 'react'
import { Checkbox, Input, Radio, RadioChangeEvent, Space } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { FilterConfirmProps } from 'antd/lib/table/interface'
import { SearchOutlined } from '@ant-design/icons'

import { Container, CustomButton } from './styles'

export type TFilters = {
  searchedText: React.Key | string
  searchedColumn: string
}

interface IFilterDropdownParams {
  selectedKeys: React.Key[]
  dataIndex: string
  clearFilters: () => void
  setSelectedKeys: (selectedKeys: React.Key[]) => void
  confirm: (param?: FilterConfirmProps) => void
}

interface IInputOptionsCheckbox {
  value: string
  text: string
}

interface IInputSelection {
  items?: IInputOptionsCheckbox[]
  multi?: boolean
}

export interface IInputOptions {
  placeholder?: string | undefined
  /** @default 'search' */
  filterType?: 'selection' | 'search'
  /** @default 'text' */
  inputType?: 'text' | 'date'
  selectionOptions?: IInputSelection
}

export interface IFilterBoxProps {
  onSearch?: (
    selectedKeys: React.Key[],
    dataIndex: string,
    confirm?: (param?: FilterConfirmProps | undefined) => void
  ) => void
  onReset?: (clearFilters: () => void, dataIndex: string) => void
  inputOptions?: IInputOptions
  filterParams: IFilterDropdownParams
}

const FilterBox = ({
  onSearch,
  onReset,
  inputOptions,
  filterParams,
}: IFilterBoxProps) => {
  const { selectedKeys, dataIndex, confirm, clearFilters, setSelectedKeys } =
    filterParams

  const handleSearch = () =>
    onSearch ? onSearch(selectedKeys, dataIndex.toString(), confirm) : confirm()

  const getInputFields = (): JSX.Element => {
    if (
      inputOptions?.filterType === 'selection' &&
      inputOptions?.selectionOptions?.items?.length
    ) {
      if (inputOptions.selectionOptions.multi) {
        return (
          <>
            {inputOptions.selectionOptions.items.map((checkbox, i) => (
              <Checkbox
                key={checkbox.value || i}
                onChange={(e: CheckboxChangeEvent) =>
                  setSelectedKeys(
                    e.target.checked
                      ? [...selectedKeys, checkbox.value]
                      : [...selectedKeys].filter(
                          (key) => key !== checkbox.value
                        )
                  )
                }
                checked={selectedKeys.includes(checkbox.value)}>
                {checkbox.text}
              </Checkbox>
            ))}
          </>
        )
      }

      return (
        <Space direction="vertical">
          {inputOptions.selectionOptions.items.map((radio, i) => (
            <Radio
              key={radio.value || i}
              onChange={(e: RadioChangeEvent) =>
                setSelectedKeys(e.target.checked ? [radio.value] : [])
              }
              checked={selectedKeys.includes(radio.value)}>
              {radio.text}
            </Radio>
          ))}
        </Space>
      )
    }

    return (
      <Input
        type={inputOptions?.inputType || 'text'}
        placeholder={inputOptions?.placeholder}
        name={dataIndex.toString()}
        value={selectedKeys[0]}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => handleSearch()}
      />
    )
  }

  return (
    <Container>
      <Space
        direction="vertical"
        size={inputOptions?.filterType === 'selection' ? 'middle' : 'small'}>
        {getInputFields()}

        <Space size="small">
          <CustomButton
            type="primary"
            size="small"
            onClick={() => handleSearch()}
            icon={<SearchOutlined />}>
            Buscar
          </CustomButton>

          <CustomButton
            size="small"
            onClick={() => {
              if (onReset) {
                onReset(clearFilters, dataIndex.toString())
              } else {
                clearFilters()
                confirm()
              }
            }}>
            Limpar
          </CustomButton>
        </Space>
      </Space>
    </Container>
  )
}

export { FilterBox }
