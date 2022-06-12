import { FilterConfirmProps, SortOrder } from 'antd/lib/table/interface'

import { FilterBox, IInputOptions } from '.'
import FilterBoxIcon from './Icon'

interface IGetFilterProps {
  dataIndex: string
  placeholder?: string | undefined
  /** @default 'search' */
  iconType?: 'search' | 'selection' | undefined
  inputOptions?: IInputOptions
  onSearch?: (
    selectedKeys: React.Key[],
    dataIndex: string,
    confirm?: (param?: FilterConfirmProps | undefined) => void
  ) => void
  onReset?: (clearFilters: () => void, dataIndex: string) => void
}

export interface IFilterDropdownProps {
  prefixCls: string
  selectedKeys: React.Key[]
  visible: boolean
  filters?: IColumnFilterItem[] | undefined
  setSelectedKeys: (selectedKeys: React.Key[]) => void
  confirm: (param?: FilterConfirmProps | undefined) => void
  clearFilters: () => void
}

export interface IColumnFilterItem {
  text: React.ReactNode
  value: string | number | boolean
  children?: IColumnFilterItem[] | undefined
}

export const getFilterProps = ({
  dataIndex,
  iconType,
  inputOptions,
  onReset,
  onSearch,
}: IGetFilterProps) => ({
  sortDirections: [
    'ascend' as SortOrder,
    'descend' as SortOrder,
    'ascend' as SortOrder,
  ],
  filterDropdown: ({
    clearFilters,
    confirm,
    setSelectedKeys,
    selectedKeys,
  }: IFilterDropdownProps) => (
    <FilterBox
      filterParams={{
        selectedKeys,
        dataIndex,
        clearFilters,
        setSelectedKeys,
        confirm,
      }}
      inputOptions={inputOptions}
      onSearch={onSearch}
      onReset={onReset}
    />
  ),
  filterIcon: () => <FilterBoxIcon type={iconType} />,
})
