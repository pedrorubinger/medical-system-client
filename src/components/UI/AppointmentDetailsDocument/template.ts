/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMyAppointment } from '../../../interfaces/appointment'
import { IPatient } from '../../../interfaces/patient'

export interface IAppointmentDetailsTemplateData
  extends Partial<Omit<IMyAppointment, 'is_follow_up'>>,
    Partial<IPatient> {
  doctor_name: string
  doctor_crm: string
  signature_field: boolean
  age?: number
  is_follow_up?: string
  primary_phone?: string
  payment_method_name?: string
}

export const getAppointmentDetailsDocumentTemplate = (
  data: IAppointmentDetailsTemplateData
) => {
  if (!data) {
    return null
  }

  const content: any = [
    {
      stack: [
        `${data.doctor_name}`,
        {
          text: `CRM ${data.doctor_crm.toUpperCase().replaceAll('CRM', '')}`,
          style: 'subheader',
        },
      ],
      style: 'header',
    },
    {
      text: '_______________________________________________________________________________________________',
      bold: false,
    },
  ]

  if (data.patient_name) {
    content.push({
      text: [
        { text: 'Nome do Paciente: ', bold: true },
        { text: `${data.patient_name}`, bold: false },
      ],
      margin: [0, 20, 0, 5],
    })
  }

  if (data.birthdate) {
    content.push({
      text: [
        { text: 'Data de Nascimento: ', bold: true },
        {
          text: data.birthdate,
          bold: false,
        },
      ],
      margin: [0, 0, 0, 5],
    })
  }

  if (data.age) {
    content.push({
      text: [
        { text: 'Idade: ', bold: true },
        { text: '23 anos', bold: false },
      ],
      margin: [0, 0, 0, 5],
    })
  }

  if (data.email) {
    content.push({
      text: [
        { text: 'Email: ', bold: true },
        {
          text: data.email,
          bold: false,
        },
      ],
      margin: [0, 0, 0, 5],
    })
  }

  if (data.primary_phone) {
    content.push({
      text: [
        { text: 'Telefone: ', bold: true },
        {
          text: data.primary_phone,
          bold: false,
        },
      ],
      margin: [0, 0, 0, 5],
    })
  }

  if (data.datetime) {
    content.push({
      text: [
        { text: 'Data da Consulta: ', bold: true },
        {
          text: data.datetime,
          bold: false,
        },
      ],
      margin: [0, 0, 0, 5],
    })
  }

  if (data.updated_at) {
    content.push({
      text: [
        { text: 'Data da Última Atualização: ', bold: true },
        { text: data.updated_at, bold: false },
      ],
      margin: [0, 0, 0, 5],
    })
  }

  if (data.last_appointment_datetime) {
    content.push({
      text: [
        { text: 'Data da Última Consulta: ', bold: true },
        {
          text: data.last_appointment_datetime || 'Nenhum registro',
          bold: false,
        },
      ],
      margin: [0, 0, 0, 5],
    })
  }

  if (data.is_follow_up) {
    content.push({
      text: [
        { text: 'É Retorno: ', bold: true },
        { text: 'Não', bold: false },
      ],
      margin: [0, 0, 0, 5],
    })
  }

  if (data.insurance_name) {
    content.push({
      text: [
        { text: 'Convênio: ', bold: true },
        { text: data.insurance_name, bold: false },
      ],
      margin: [0, 0, 0, 5],
    })
  }

  if (data.payment_method_name) {
    content.push({
      text: [
        { text: 'Método de Pagamento: ', bold: true },
        { text: data.payment_method_name, bold: false },
      ],
      margin: [0, 0, 0, 5],
    })
  }

  if (data.exam_request) {
    content.push({
      text: [
        { text: 'Exames Solicitados: ', bold: true },
        {
          text: data.exam_request || 'Não informado',
          bold: false,
        },
      ],
      margin: [0, 0, 0, 5],
    })
  }

  if (data.notes) {
    content.push({
      text: [
        { text: 'Anotações: ', bold: true },
        {
          // text: 'Lorem ipsum dolor sit amet, consectetur 69mg adipiscing elit. Donec congue elit ac urna blandit rutrum. Ut sit amet ligula et tellus feugiat tempus id a massa. Donec mauris justo, vulputate nec lacus vitae, gravida imperdiet ipsum. Donec ullamcorper metus augue, at pellentesque enim hendrerit id. In eget arcu non nisl varius luctus. Cras commodo dictum tellus et fringilla. Aenean turpis orci, elementum eu tincidunt eget, pellentesque eu sem. Nulla sagittis sed turpis a feugiat. Aliquam quis ipsum porttitor, tincidunt lectus at, fermentum dui. Nullam dictum lobortis nulla. Phasellus pulvinar commodo porta. Maecenas consequat ante erat, sed sollicitudin ex eleifend quis. Donec a mollis nunc, ac feugiat ipsum. Suspendisse potenti. Donec et nisl sit amet leo cursus aliquam. Nam sit amet congue erat. Nullam auctor porta augue, vitae elementum eros tincidunt ac. Vestibulum ornare varius neque nec condimentum. Fusce fringilla accumsan justo nec volutpat. Maecenas dignissim posuere pulvinar. Suspendisse potenti. Suspendisse tristique eget diam non porta. Cras lacus turpis, luctus a tortor sed, pulvinar interdum augue. Vestibulum vel purus mattis, blandit risus at, sagittis urna. Donec risus nulla, sodales sed feugiat vel, gravida et nunc. Duis aliquet eleifend sollicitudin. Nunc scelerisque scelerisque rutrum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam vehicula ultrices mi. Proin facilisis velit dui, sit amet pellentesque tortor aliquam et Lorem ipsum dolor sit amet, consectetur 69mg adipiscing elit. Donec congue elit ac urna blandit rutrum. Ut sit amet ligula et tellus feugiat tempus id a massa. Donec mauris justo, vulputate nec lacus vitae, gravida imperdiet ipsum. Donec ullamcorper metus augue, at pellentesque enim hendrerit id. In eget arcu non nisl varius luctus. Cras commodo dictum tellus et fringilla. Aenean turpis orci, elementum eu tincidunt eget, pellentesque eu sem. Nulla sagittis sed turpis a feugiat. Aliquam quis ipsum porttitor, tincidunt lectus at, fermentum dui. Nullam dictum lobortis nulla. Phasellus pulvinar commodo porta. Maecenas consequat ante erat, sed sollicitudin ex eleifend quis. Donec a mollis nunc, ac feugiat ipsum. Suspendisse potenti. Donec et nisl sit amet leo cursus aliquam. Nam sit amet congue erat. Nullam auctor porta augue, vitae elementum eros tincidunt ac. Vestibulum ornare varius neque nec condimentum. Fusce fringilla accumsan justo nec volutpat. Maecenas dignissim posuere pulvinar. Suspendisse potenti. Suspendisse tristique eget diam non porta. Cras lacus turpis, luctus a tortor sed, pulvinar interdum augue. Vestibulum vel purus mattis, blandit risus at, sagittis urna. Donec risus nulla, sodales sed feugiat vel, gravida et nunc. Duis aliquet eleifend sollicitudin. Nunc scelerisque scelerisque rutrum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam vehicula ultrices mi. Proin facilisis velit dui, sit amet pelle. Donec congue elit ac urna blandit rutrum. Ut sit amet ligula et tellus feugiat tempus id a massa. Donec mauris justo, vulputate nec lacus vitae, gravida imperdiet ipsum. Donec ullamcorper metus augue, at pellentesque enim hendrerit id. In eget arcu non nisl varius luctus. Cras commodo dictum tellus et fringilla. Aenean turpis orci, elementum eu tincidunt eget, pellentesque eu sem. Nulla sagittis sed turpis a feugiat. Aliquam quis ipsum porttitor, tincidunt lectus at, fermentum dui. Nullam dictum lobortis nulla. Phasellus pulvinar commodo porta. Maecenas consequat ante erat, sed sollicitudin ex eleifend quis. Donec a mollis nunc, ac feugiat ipsum. Suspendisse potenti. Donec et nisl sit amet leo cursus aliquam. Nam sit amet congue erat. Nullam auctor porta augue, vitae elementum eros tincidunt ac. Vestibulum ornare varius neque nec condimentum. Fusce fringilla accumsan justo nec volutpat. Maecenas dignissim posuere pulvinar. Suspendisse potenti. Suspendisse tristique eget diam non porta. Cras lacus turpis, luctus a tortor sed, pulvinar interdum augue. Vestibulum vel purus mattis, blandit risus at, sagittis urna. Donec risus nulla, sodales sed feugiat vel, gravida et nunc. Duis aliquet eleifend sollicitudin. Nunc scelerisque scelerisque rutrum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam vehicula ultrices mi. Proin facilisis velit dui, sit amet pellentesque tortor aliquam et Lorem ipsum dolor sit amet, consectetur 69mg adipiscing elit. Donec congue elit ac urna blandit rutrum. Ut sit amet ligula et tellus feugiat tempus id a massa. Donec mauris justo, vulputate nec lacus vitae, gravida imperdiet ipsum. Donec ullamcorper metus augue, at pellentesque enim hendrerit id. In eget arcu non nisl varius luctus. Cras commodo dictum tellus et fringilla. Aenean turpis orci, elementum eu tincidunt eget, pellentesque eu sem. Nulla sagittis sed turpis a feugiat. Aliquam quis ipsum porttitor, tincidunt lectus at, fermentum dui. Nullam dictum lobortis nulla.',
          text: data.notes || 'Não informado',
          bold: false,
        },
      ],
      margin: [0, 0, 0, 5],
    })
  }

  if (data.signature_field) {
    content.push({
      stack: [
        { text: '____________________________________', bold: false },
        { text: data.doctor_name, bold: true, fontSize: 10, marginTop: 5 },
        {
          text: `CRM ${data.doctor_crm.toUpperCase().replaceAll('CRM', '')}`,
          fontSize: 9,
        },
      ],
      margin: [0, 60, 0, 5],
      style: 'fixed',
    })
  }

  return {
    content,
    styles: {
      header: {
        fontSize: 22,
        bold: true,
      },
      subheader: {
        fontSize: 11,
        bold: false,
        marginTop: 4,
      },
      bigger: {
        fontSize: 15,
        italics: true,
      },
      fixed: {
        position: 'fixed',
        top: '30px',
      },
    },
  }
}
