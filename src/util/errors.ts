const requiredMessage = (field: string) => `O campo ${field} é requerido.`;

export const integration = {
  blingApiKey: requiredMessage('blingApiKey'),
  pipedriveApiKey: requiredMessage('blingApiKey.'),
};
