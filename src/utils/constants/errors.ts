export const ERROR_MESSAGES: { [key: string]: string } = {
  INTERNAL_ERROR_MSG:
    'Desculpe, um erro interno ocorreu. Por favor, tente novamente mais tarde ou contate-nos.',
  INVALID_CREDENTIALS: 'Email ou senha inválidos!',
  MUST_PROVIDE_VALID_CREDENTIALS: 'Você deve fornecer credenciais válidas!',
  DOCTOR_NOT_FOUND: 'Esse médico não foi encontrado!',
  INSURANCE_NOT_FOUND: 'Esse convênio não foi encontrado!',
  SPECIALTY_NOT_FOUND: 'Essa especialidade não foi encontrada!',
  TOKEN_DOES_NOT_EXIST: 'O token não existe!',
  TOKEN_INVALID_OR_HAS_EXPIRED: 'O token é inválido ou já expirou!',
  NOT_AUTHORIZED_TO_RESET_PASSWORD:
    'Você não está autorizado a resetar sua senha!',
  USER_HAS_NO_PERMISSION_TO_ACCESS_RESOURCE:
    'Você não tem permissão para acessar este recurso!',
  TENANT_NOT_FOUND: 'Essa clínica não foi encontrada!',
  CANNOT_DELETE_MASTER_USER:
    'Você não tem permissão para excluir esse usuário!',
  MISSING_TENANT_ID:
    'A requisição falhou pois não foi possível identificar a clínica!',
  ACCESS_DENIED_TENANT_IS_INACTIVE:
    'Você não está autorizado a realizar essa operação! Por favor, entre em contato conosco.',
  PAYMENT_METHOD_NOT_FOUND: 'Esse método de pagamento não foi encontrado!',
  SCHEDULE_SETTINGS_NOT_FOUND:
    'As configurações de agenda especificadas não foram encontradas!',
}

export const BAD_REQUEST_MESSAGES: { [key: string]: string } = {
  DEFAULT: 'Dados inválidos!',
  INVALID_PASSWORD: 'Senha inválida!',
  USER_ID_IS_REQUIRED: 'Você precisa informar o ID do usuário!',
  CRM_DOCUMENT_IS_REQUIRED: 'Você precisa informar o CRM!',
  CRM_DOCUMENT_ALREADY_REGISTERED: 'Este CRM já está associado a um usuário!',
  CRM_DOCUMENT_MAX_LENGTH_20: 'O CRM não pode ultrapassar 20 caracteres!',
  INSURANCE_NAME_IS_REQUIRED: 'Você deve informar o nome do convênio!',
  INSURANCE_ALREADY_REGISTERED: 'Este convênio já está cadastrado!',
  INSURANCE_NAME_MAX_LENGTH_80:
    'O nome do convênio não pode ultrapassar 80 caracteres!',
  SPECIALTY_NAME_IS_REQUIRED: 'Você deve informar o nome da especialidade!',
  SPECIALTY_ALREADY_REGISTERED: 'Esta especialidade já está cadastrada!',
  SPECIALTY_NAME_MAX_LENGTH_80:
    'O nome da especialidade não pode ultrapassar 80 caracteres!',
  USER_NAME_IS_REQUIRED: 'Você deve informar o nome do usuário!',
  USER_NAME_MAX_LENGTH_100:
    'O nome do usuário não pode ultrapassar que 100 caracteres!',
  PHONE_IS_REQUIRED: 'Você deve informar o telefone!',
  PHONE_MAX_LENGTH_40:
    'O número de telefone não pode ultrapassar 40 caracteres!',
  EMAIL_IS_REQUIRED: 'Você deve informar o e-mail!',
  EMAIL_MAX_LENGTH_80: 'O e-mail não pode ultrapassar 80 caracteres!',
  EMAIL_ALREADY_REGISTERED: 'Este email já está cadastrado!',
  CPF_IS_REQUIRED: 'Você deve informar o CPF!',
  CPF_MAX_LENGTH_20: 'O CPF não pode ultrapassar 20 caracteres!',
  CPF_ALREADY_REGISTERED: 'Este CPF já está cadastrado!',
  IS_ADMIN_IS_REQUIRED:
    'Você deve informar se o usuário é administrador ou não!',
  PASSWORD_MAX_LENGTH_255: 'A senha não pode ultrapassar 255 caracteres!',
  PASSWORDS_DO_NOT_MATCH: 'As senhas precisam ser iguais!',
  ROLE_IS_REQUIRED: 'Você deve informar uma função/papel!',
  PASSWORD_IS_REQUIRED: 'Você deve informar a senha!',
  RESET_PASSWORD_TOKEN_IS_REQUIRED: 'Você deve fornecer o token!',
  NEW_PASSWORD_MAX_LENGTH_255:
    'A nova senha não pode ultrapassar 255 caracteres!',
  MANAGE_DOCTOR_INSURANCE_IS_REQUIRED: 'Você deve informar o convênio!',
  MANAGE_DOCTOR_INSURANCE_FLAG_IS_REQUIRED:
    'Você deve informar se deseja remover ou adicionar um convênio à sua lista!',
  TENANT_NAME_IS_REQUIRED: 'Você deve informar o nome da clínica!',
  TENANT_NAME_MAX_LENGTH_100:
    'O nome da clínica não pode ultrapassar 100 caracteres!',
  TENANT_IS_ACTIVE_IS_REQUIRED:
    'Você deve informar se a clínica está ativa no sistema!',
  PAYMENT_METHOD_NAME_IS_REQUIRED:
    'Você deve informar o nome do método de pagamento!',
  PAYMENT_METHOD_ALREADY_REGISTERED:
    'Esse método de pagamento já está registrado!',
  PAYMENT_METHOD_NAME_MAX_LENGTH_50:
    'O nome do método não pode ultrapassar 50 caracteres!',
  DOCTOR_ID_IS_REQUIRED: 'Você deve informar o médico!',
}
