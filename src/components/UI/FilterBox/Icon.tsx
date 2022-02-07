import React from 'react'
import { FilterOutlined, SearchOutlined } from '@ant-design/icons'

export interface FilterBoxIconProps {
  children?: React.ReactNode
  /** @default 'search' */
  type?: 'search' | 'selection'
}

const FilterBoxIcon: React.FC<FilterBoxIconProps> = ({
  type = 'search',
}): JSX.Element | null => {
  if (type === 'search') {
    return <SearchOutlined />
  }

  if (type === 'selection') {
    return <FilterOutlined />
  }

  return null
}

export default FilterBoxIcon
