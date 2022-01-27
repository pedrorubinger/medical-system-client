import { TRole } from '../../interfaces/roles'

export const getTranslatedRole = (
  role: TRole,
  capitalizeFirstLetter = false
) => {
  let translatedRole: string = role

  switch (role) {
    case 'manager':
      translatedRole = 'secretário(a)'
      break
    case 'doctor':
      translatedRole = 'médico(a)'
      break
    case 'admin':
      translatedRole = ''
      break
    default:
      translatedRole = ''
  }

  return capitalizeFirstLetter
    ? translatedRole.charAt(0).toUpperCase() + translatedRole.slice(1)
    : translatedRole
}
