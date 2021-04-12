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
  BLING_API_KEY_UNDEFINED: 'BLING_API_KEY must be defined. Visit https://github.com/sostenesg7/linkapi-bling-pipedrive#-configura%C3%A7%C3%A3o',
  PIPEDRIVE_API_KEY_UNDEFINED: 'PIPEDRIVE_API_KEY must be defined. Visit https://github.com/sostenesg7/linkapi-bling-pipedrive#-configura%C3%A7%C3%A3o',
}