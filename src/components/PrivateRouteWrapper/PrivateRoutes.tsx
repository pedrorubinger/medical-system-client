import { Route } from 'react-router-dom'
import {
  FiBriefcase,
  FiCalendar,
  FiClipboard,
  FiHome,
  FiMonitor,
  FiScissors,
  FiUser,
  FiUsers,
  FiSettings,
  FiCreditCard,
} from 'react-icons/fi'

import { PrivateRouteWrapper } from './'
import { TRole } from '../../interfaces/roles'
import { Pages } from '../../pages'

export type TPermission = TRole | '*'

export interface IPrivateRoute {
  permissions: TPermission[]
  path: string
  /** route will be shown in side menu as a menu item */
  show: boolean
  route: React.ReactElement | null
  icon?: JSX.Element
  title?: string
  name: string
}

export const PrivateRoutes: IPrivateRoute[] = [
  {
    name: 'Home',
    permissions: ['*'],
    path: '/',
    show: true,
    icon: <FiHome />,
    route: (
      <Route
        key="root"
        path="/"
        element={
          <PrivateRouteWrapper>
            <Pages.Home />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Ajuda',
    permissions: ['*'],
    path: '/help',
    show: false,
    route: (
      <Route
        key="help"
        path="/help"
        element={
          <PrivateRouteWrapper>
            <Pages.Help />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Minha Conta',
    permissions: ['*'],
    path: '/my-account',
    show: false,
    route: (
      <Route
        key="my-account"
        path="/my-account"
        element={
          <PrivateRouteWrapper>
            <Pages.MyAccount />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Agenda',
    permissions: ['manager'],
    path: '/schedule',
    title: 'Clique para gerenciar as agendas dos médicos',
    show: true,
    icon: <FiCalendar />,
    route: (
      <Route
        key="schedule"
        path="/schedule"
        element={
          <PrivateRouteWrapper>
            <Pages.Schedule />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Minha Agenda',
    permissions: ['doctor'],
    path: '/my-schedule',
    title: 'Clique para acessar sua agenda e visualizar suas consultas',
    show: true,
    icon: <FiCalendar />,
    route: (
      <Route
        key="my-schedule"
        path="/my-schedule"
        element={
          <PrivateRouteWrapper>
            <Pages.Schedule />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Configurar Agenda',
    permissions: ['doctor'],
    path: '/schedule-settings',
    title: 'Clique para configurar sua agenda como horários e dias disponíveis',
    show: true,
    icon: <FiSettings />,
    route: (
      <Route
        key="schedule-settings"
        path="/schedule-settings"
        element={
          <PrivateRouteWrapper>
            <Pages.ScheduleSettings />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Pacientes',
    permissions: ['manager'],
    path: '/patients',
    title: 'Clique para gerenciar os pacientes da clínica',
    show: true,
    icon: <FiUsers />,
    route: (
      <Route
        key="patients"
        path="/patients"
        element={
          <PrivateRouteWrapper>
            <Pages.Patients />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Meus Pacientes',
    permissions: ['doctor'],
    path: '/my-patients',
    title: 'Clique para ver informações de seus pacientes',
    show: true,
    icon: <FiUsers />,
    route: (
      <Route
        key="/my-patients"
        path="/my-patients"
        element={
          <PrivateRouteWrapper>
            <Pages.MyPatients />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Usuários',
    permissions: ['admin'],
    path: '/users',
    title: 'Clique para gerenciar os usuários',
    show: true,
    icon: <FiUser />,
    route: (
      <Route
        key="users"
        path="/users"
        element={
          <PrivateRouteWrapper>
            <Pages.Users />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Clínicas',
    permissions: ['developer'],
    path: '/tenants',
    title: 'Clique para gerenciar as clínicas',
    show: true,
    icon: <FiMonitor />,
    route: (
      <Route
        key="tenants"
        path="/tenants"
        element={
          <PrivateRouteWrapper>
            <Pages.Tenants />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Administradores',
    permissions: ['master'],
    path: '/admins',
    title:
      'Clique para gerenciar os administradores e desenvolvedores do sistema',
    show: true,
    icon: <FiUser />,
    route: (
      <Route
        key="admins"
        path="/admins"
        element={
          <PrivateRouteWrapper>
            <Pages.Admins />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Convênios',
    permissions: ['admin'],
    path: '/insurances',
    title: 'Clique para gerenciar os convênios',
    show: true,
    icon: <FiBriefcase />,
    route: (
      <Route
        key="insurances"
        path="/insurances"
        element={
          <PrivateRouteWrapper>
            <Pages.Insurances />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Especialidades',
    permissions: ['admin'],
    path: '/specialties',
    title: 'Clique para gerenciar as especialidades',
    show: true,
    icon: <FiScissors />,
    route: (
      <Route
        key="specialties"
        path="/specialties"
        element={
          <PrivateRouteWrapper>
            <Pages.Specialties />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Métodos de Pagamento',
    permissions: ['admin'],
    path: '/payment-methods',
    title: 'Clique para gerenciar os métodos de pagamento de consultas',
    show: true,
    icon: <FiCreditCard />,
    route: (
      <Route
        key="payment-methods"
        path="/payment-methods"
        element={
          <PrivateRouteWrapper>
            <Pages.PaymentMethods />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
  {
    name: 'Relatórios',
    permissions: ['admin', 'doctor'],
    path: '/reports',
    title: 'Clique para gerenciar os relatórios',
    show: true,
    icon: <FiClipboard />,
    route: (
      <Route
        key="reports"
        path="/reports"
        element={
          <PrivateRouteWrapper>
            <Pages.Reports />
          </PrivateRouteWrapper>
        }
      />
    ),
  },
]
