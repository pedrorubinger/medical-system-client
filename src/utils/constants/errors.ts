export const ERROR_MESSAGES: { [key: string]: string } = {
  INTERNAL_ERROR_MSG:
    'Desculpe, um erro interno ocorreu. Por favor, tente novamente mais tarde ou contate-nos.',
  INVALID_CREDENTIALS: 'Email ou senha inválidos!',
  MUST_PROVIDE_VALID_CREDENTIALS: 'Você deve fornecer credenciais válidas!',
  DOCTOR_NOT_FOUND: 'Este médico não foi encontrado!',
  INSURANCE_NOT_FOUND: 'Este convênio não foi encontrado!',
  SPECIALTY_NOT_FOUND: 'Esta especialidade não foi encontrada!',
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
  MISSING_PATIENT_AND_DOCTOR_ID:
    'Não foi possível identificar o paciente ou o médico! Por favor, tente novamente depois.',
  ACCESS_DENIED_TENANT_IS_INACTIVE:
    'Você não está autorizado a realizar essa operação! Por favor, entre em contato conosco.',
  PAYMENT_METHOD_NOT_FOUND: 'Esse método de pagamento não foi encontrado!',
  SCHEDULE_SETTINGS_NOT_FOUND:
    'As configurações de agenda especificadas não foram encontradas!',
  SCHEDULE_DAYS_OFF_NOT_FOUND:
    'As lista de férias e ausências especificada não foi encontrada!',
  ADDRESS_NOT_FOUND: 'Este endereço não foi encontrado!',
  PATIENT_NOT_FOUND: 'Este paciente não foi encontrado!',
  APPOINTMENT_NOT_FOUND: 'Esta consulta não foi encontrada!',
  APPOINTMENT_FILE_NOT_FOUND: 'O arquivo não existe ou foi excluído!',
  STORE_APPOINTMENT_FILE_FAILED:
    'Ocorreu um erro ao salvar o(s) arquivo(s) da consulta! Por favor, tente novamente mais tarde!',
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
  SCHEDULE_DAYS_OFF_DATETIME_START_IS_REQUIRED:
    'Você deve informar a data e horário de início!',
  SCHEDULE_DAYS_OFF_DATETIME_END_IS_REQUIRED:
    'Você deve informar a data e horário finais!',
  SCHEDULE_DAYS_OFF_DATETIME_START_MUST_BE_UNIQUE:
    'Uma folga já foi cadastrada neste dia e horário!',
  SCHEDULE_DAYS_OFF_DATETIME_END_MUST_BE_UNIQUE:
    'Uma folga já foi cadastrada neste dia e horário!',
  SCHEDULE_DAYS_OFF_INVALID_RANGE:
    'Este intervalo de datas já está sendo utilizado!',
  SCHEDULE_DAYS_OFF_DATETIME_START_LESS_THAN_END:
    'A data inicial deve ser inferior à data final!',
  SCHEDULE_DAYS_OFF_DATETIME_END_GREATER_THAN_START:
    'A data final deve ser superior à data inicial!',
  SCHEDULE_DAYS_OFF_DATETIME_START_BEFORE_NOW:
    'A data inicial deve ser maior que a data atual!',
  STREET_IS_REQUIRED: 'Você deve informar o nome da rua!',
  STREET_MAX_LENGTH_80: 'O nome da rua não pode ultrapassar 80 caracteres!',
  ADDRESS_NUMBER_IS_REQUIRED: 'Você deve informar o número da residência!',
  ADDRESS_NUMBER_MAX_LENGTH_10:
    'O número da residência não pode ultrapassar 10 caracteres!',
  NEIGHBORHOOD_IS_REQUIRED: 'Você deve o nome do bairro!',
  NEIGHBORHOOD_MAX_LENGTH_50:
    'O nome do bairro não pode ultrapassar 50 caracteres!',
  POSTAL_CODE_IS_REQUIRED: 'Você deve informar o CEP!',
  POSTAL_CODE_MAX_LENGTH_15: 'O CEP não pode ultrapassar 15 caracteres!',
  ADDRESS_COMPLEMENT_MAX_LENGTH_50:
    'O complemento não pode ultrapassar 50 caracteres!',
  PATIENT_NAME_IS_REQUIRED: 'Você deve informar o nome do paciente!',
  PATIENT_NAME_MAX_LENGTH_150:
    'O nome do paciente não pode ultrapassar 150 caracteres!',
  PATIENT_CPF_IS_REQUIRED: 'Você deve informar o CPF do paciente!',
  PATIENT_CPF_MAX_LENGTH_20:
    'O CPF do paciente não pode ultrapassar 20 caracteres!',
  PATIENT_CPF_MUST_BE_UNIQUE: 'Um paciente com este CPF já está cadastrado!',
  PATIENT_BIRTHDATE_IS_REQUIRED:
    'Você deve informar a data de nascimento do paciente!',
  PATIENT_PRIMARY_PHONE_IS_REQUIRED:
    'Você deve informar um número de telefone!',
  PATIENT_PRIMARY_PHONE_MAX_LENGTH_30:
    'O número de telefone não pode ultrapassar 30 caracteres!',
  PATIENT_MOTHER_NAME_IS_REQUIRED:
    'Você deve informar o nome da mãe do paciente!',
  PATIENT_MOTHER_NAME_MAX_LENGTH_150:
    'O nome da mãe do paciente não pode ultrapassar 150 caracteres!',
  PATIENT_FATHER_NAME_MAX_LENGTH_150:
    'O nome do pai do paciecnte não pode ultrapassar 150 caracteres!',
  PATIENT_SECONDARY_PHONE_MAX_LENGTH_30:
    'O número de telefone não pode ultrapassar 30 caracteres!',
  PATIENT_EMAIL_MAX_LENGTH_80:
    'O email do paciente não pode ultrapassar 80 caracteres!',
  PATIENT_EMAIL_MUST_BE_UNIQUE:
    'Já existe um paciente com este email cadastrado!',
  PATIENT_IS_IS_REQUIRED: 'Você deve informar o id do paciente!',
  APPOINTMENT_DATETIME_IS_REQUIRED:
    'Você deve informar o dia e horário da consulta!',
  APPOINTMENT_DATETIME_MUST_BE_UNIQUE:
    'Já existe uma consulta agendada para este horário!',
  APPOINTMENT_DATETIME_FORMAT: 'Verifique o formato de dia e horário enviados!',
  APPOINTMENT_IS_FOLLOW_UP_IS_REQUIRED:
    'Você deve informar se a consulta é retorno!',
  APPOINTMENT_IS_PRIVATE_IS_REQUIRED:
    'Você deve informar se a consulta é particular!',
  APPOINTMENT_FILE_IS_REQUIRED: 'Você deve inserir um arquivo!',
  APPOINTMENT_FILE_MAXIMUM_SIZE_12MB: 'O arquivo não pode ser maior que 12mb!',
  APPOINTMENT_FILE_EXTNAME: 'O formato de arquivo não é aceito!',
  MISSING_OR_INVALID_FILE:
    'O arquivo é inválido ou não foi enviado corretamente!',
  APPOINTMENT_IS_REQUIRED: 'Você deve informar uma consulta!',
  PATIENT_SEX_IS_REQUIRED: 'Você deve informar o sexo do paciente!',
}
