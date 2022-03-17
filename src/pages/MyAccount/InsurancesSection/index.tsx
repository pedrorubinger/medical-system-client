import { useEffect, useState } from 'react'
import { Table } from 'antd'
import { useSelector } from 'react-redux'

import { TableActions } from '../../../components/UI/TableActions'
import { TableHeader } from '../../../components/UI/TableHeader'
import { IDoctorInsurance } from '../../../interfaces/doctor'
import { AttachInsuranceDrawer } from './Drawer'
import { formatBrCurrency } from '../../../utils/helpers/formatters'
import { RootState } from '../../../store'
import { fetchInsurances } from '../../../services/requests/insurance'
import { PageContent } from '../../../components/UI/PageContent'
import { DeleteMyInsuranceModal as DeletionModal } from './DeletionModal'
import { IInsurance } from '../../../interfaces/insurance'

interface ISelectOption {
  label: string
  value: number
}

interface IData {
  id: number
  price: string
}

interface IDrawerProps {
  type: 'create' | 'update'
  isVisible: boolean
  data?: IData
  options: ISelectOption[]
}

interface IDeletionModalProps {
  isVisible: boolean
  name: string
  id: number
  doctorId: number
}

const formatOptions = (arr: IInsurance[]) =>
  arr.map((item) => ({
    value: item.id,
    label: item.name,
  }))

export const InsurancesSection = () => {
  const user = useSelector((state: RootState) => state.AuthReducer)
  const [drawer, setDrawer] = useState<IDrawerProps | null>(null)
  const [insurances, setInsurances] = useState<IInsurance[]>([])
  const [options, setOptions] = useState<ISelectOption[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [errorOnFetchData, setErrorOnFetchData] = useState('')
  const [records, setRecords] = useState<IDoctorInsurance[]>([])
  const [deletionModal, setDeletionModal] =
    useState<IDeletionModalProps | null>(null)

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Preço por Consulta',
      dataIndex: 'price',
      key: 'price',
      render: (value: number) => formatBrCurrency(value),
    },
    // {
    //   title: 'Última Atualização',
    //   dataIndex: 'updated_at',
    //   key: 'updated_at',
    //   render: (date: string) => new Date(date).toLocaleString(),
    // },
    {
      title: 'Ações',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: string, insurance: IDoctorInsurance) => (
        <TableActions
          options={[
            {
              id: 'edit',
              overlay: 'Clique para editar o preço pago por este convênio',
              onClick: () =>
                setDrawer({
                  type: 'update',
                  isVisible: true,
                  data: {
                    id: insurance.id,
                    price: formatBrCurrency(insurance.price),
                  },
                  options,
                }),
            },
            {
              id: 'delete',
              overlay: 'Clique para excluir este convênio',
              onClick: () =>
                setDeletionModal({
                  name: insurance.name,
                  id: insurance.id,
                  isVisible: true,
                  doctorId: user?.data?.doctor?.id,
                }),
            },
          ]}
        />
      ),
    },
  ]

  useEffect(() => {
    ;(async () => {
      setRecords(user?.data?.doctor?.insurance || [])
      setIsFetching(true)

      const response = await fetchInsurances()

      if (response?.data) {
        const userInsurances: number[] =
          user?.data?.doctor?.insurance.map(
            (insurance: IDoctorInsurance) => insurance.id
          ) || []
        const availableOptions = response.data.filter(
          (insurance) => !userInsurances.includes(insurance.id)
        )

        setInsurances(response.data)
        setOptions(formatOptions(availableOptions))
        setRecords(user?.data?.doctor?.insurance)
      }

      if (response.error) {
        setErrorOnFetchData(response.error.message)
        setRecords([])
      }

      setIsFetching(false)
    })()
  }, [])

  useEffect(() => {
    if (records?.length) {
      const doctorInsurances = records?.map((record) => record.id.toString())
      const formatted = formatOptions([...insurances])

      setOptions(
        [...formatted].filter(
          (insurance) => !doctorInsurances.includes(insurance.value.toString())
        )
      )
    }
  }, [records])

  if (errorOnFetchData) {
    return (
      <>
        <h2>
          Desculpe, mas não foi possível buscar os dados profissionais neste
          momento. O seguinte erro ocorreu:
        </h2>
        <strong>{errorOnFetchData}</strong>
      </>
    )
  }

  return (
    <PageContent margin="30px 0">
      <AttachInsuranceDrawer
        isVisible={drawer?.isVisible || false}
        data={drawer?.data}
        type={drawer?.type || 'create'}
        options={options}
        onClose={() => setDrawer(null)}
        setRecords={setRecords}
      />
      <DeletionModal
        doctorId={deletionModal?.doctorId}
        id={deletionModal?.id}
        name={deletionModal?.name}
        isVisible={deletionModal?.isVisible}
        onCancel={() => setDeletionModal(null)}
        setRecords={setRecords}
      />
      <TableHeader
        title="Meus Convênios"
        newRecordButton={{
          visible: true,
          value: 'Incluir Convênio',
          title: options.length
            ? 'Clique para incluir um novo convênio'
            : 'Não há mais convênios disponíveis',
          disabled: !options.length,
          onClick: () =>
            setDrawer({ options, isVisible: true, type: 'create' }),
        }}
      />
      <Table
        rowKey="name"
        scroll={{ x: true }}
        columns={columns}
        dataSource={records}
        loading={isFetching}
      />
    </PageContent>
  )
}
