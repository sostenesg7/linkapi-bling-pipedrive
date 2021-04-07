const requiredMessage = (field: string) => `O campo ${field} é requerido.`;

export const integration = {
  blingApiKey: requiredMessage('blingApiKey'),
  pipedriveApiKey: requiredMessage('blingApiKey.'),
};

export const ErrorCodes = {
  'ORDER_ALREADY_EXISTS': 30,
}

export const ErrorMessages = {
  MONGO_URI_UNDEFINED: 'MONGO_URI must be defined.',
  LOGGER_LEVEL_UNDEFINED: 'LOGGER_LEVEL must be defined.',
  BLING_REDIS_ERROR: 'Bling redis queue error.',
  PIPEDRIVE_REDIS_ERROR: 'Pipedrive redis queue error.',
}