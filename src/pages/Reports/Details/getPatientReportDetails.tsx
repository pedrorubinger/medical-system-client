/* eslint-disable no-unsafe-optional-chaining */
import { Typography } from 'antd'

import { IPatient } from '../../../interfaces/patient'
import { getTimePassed } from '../../../utils/helpers/formatters'

export const getPatientReportDetails = (records: IPatient[] = []) => {
  const total = records?.length
  const femalePatients = records?.filter(({ sex }) => sex === 'female')?.length
  const malePatients = records?.filter(({ sex }) => sex === 'male')?.length
  const patientsWithAddress = records?.filter(({ address }) => address)?.length
  const oldestPatient = records?.sort(
    (a, b) =>
      (getTimePassed(a?.birthdate) || 0) - (getTimePassed(b?.birthdate) || 0)
  )?.[records?.length - 1]
  const youngestPatient = records?.sort(
    (a, b) =>
      (getTimePassed(a?.birthdate) || 0) - (getTimePassed(b?.birthdate) || 0)
  )?.[0]
  const ages = records
    ?.map(({ birthdate }) => getTimePassed(birthdate))
    ?.filter(Boolean)
  const ageAvg = ages?.length
    ? (ages?.reduce((acc, curr) => (acc as number) + (curr as number)) || 0) /
      ages?.length
    : 0

  const source = [
    <Typography.Text key="total">
      <strong>{total}</strong> paciente(s) no total.
    </Typography.Text>,
    <Typography.Text key="female">
      <strong>{femalePatients}</strong> paciente(s) do sexo feminino.
    </Typography.Text>,
    <Typography.Text key="male">
      <strong>{malePatients}</strong> paciente(s) do sexo masculino.
    </Typography.Text>,
    <Typography.Text key="with_address">
      <strong>{patientsWithAddress}</strong> paciente(s) com endereço
      cadastrado.
    </Typography.Text>,
    <Typography.Text key="youngest">
      O(a) paciente mais jovem possui{' '}
      <strong>{getTimePassed(youngestPatient?.birthdate)}</strong> anos.
    </Typography.Text>,
    <Typography.Text key="oldest">
      O(a) paciente mais velho possui{' '}
      <strong>{getTimePassed(oldestPatient?.birthdate)}</strong> anos.
    </Typography.Text>,
    <Typography.Text key="age_avg">
      A média de idade dos pacientes é de aproximadamente{' '}
      <strong>
        {Number(parseFloat(ageAvg?.toString() || '0')?.toFixed(2))}
      </strong>{' '}
      anos.
    </Typography.Text>,
  ]

  return source
}
