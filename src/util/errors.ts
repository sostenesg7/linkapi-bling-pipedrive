const requiredMessage = (field: string) => `O campo ${field} é requerido.`;

export const integration = {
  blingApiKey: requiredMessage('blingApiKey'),
  pipedriveApiKey: requiredMessage('blingApiKey.'),
};


export const ErrorCodes = {
  'ORDER_ALREADY_EXISTS': 30,
}
