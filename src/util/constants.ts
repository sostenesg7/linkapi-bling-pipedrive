const requiredMessage = (field: string) => `O campo ${field} é requerido.`;

export const Summary = {
  blingApiKey: requiredMessage('blingApiKey'),
  pipedriveApiKey: requiredMessage('blingApiKey.'),
};

export const ErrorCodes = {
  ORDER_ALREADY_EXISTS: 30,
};

export const ErrorMessages = {
  MONGO_URI_UNDEFINED: 'MONGO_URI must be defined.',
  LOGGER_LEVEL_UNDEFINED: 'LOGGER_LEVEL must be defined.',
  BLING_REDIS_ERROR: 'Bling redis queue error.',
  PIPEDRIVE_REDIS_ERROR: 'Pipedrive redis queue error.',
};

export const Messages = {
  STARTING_NEW_INTEGRATION: 'Starting new integration...',
  STARTING_BLING_SERVICE: 'Starting pipedrive service...',
  STARTING_PIPEDRIVE_SERVICE: 'Starting bling service...',
  MONGO_DATABASE_CONNECTION_SUCESSFULL: 'MongoDB connection successfull.',
  HTTP_SERVER_STARTED: 'HTTP Server running on port ',
  BLING_REDIS_CONNECTED: 'Bling redis queue connected.',
  BLING_ORDER_CREATED: 'Order created on bling.',
  BLING_WAITING_NEW_ORDERS: 'Waiting for new orders...',
  PIPEDRIVE_REDIS_CONNECTED: 'Pipedrive redis queue connected.',
  PIPEDRIVE_DEALS_INSERTED_ON_QUEUE: 'Orders inserted in queue.',
  STARTING_AUTOMATIC_CONFIGURATION: 'Starting automatic configuration....',
  PIPEDRIVE_CREATING_DEALS_FILTER: 'Creating pipedrive deals filter....',
  BLING_CREATING_PRODUCT: 'Creating bling product....',
  NO_ORDERS_AVAILABLE: 'No new orders available.'
};

export const DEALS_FILTER_REDIS_KEY = 'pipedrive_daily_deals_filter';
export const BLING_PRODUCT_CODE_REDIS_KEY = 'bling_product_code';

export const DealsFilterWithStatusWonAndCreationDataIsToday = {
  name: 'Deal creation is today - API filter',
  type: 'deals',
  visible_to: '1',
  conditions: {
    glue: 'and',
    conditions: [
      {
        glue: 'and',
        conditions: [
          {
            object: 'deal',
            field_id: 12465,
            operator: '=',
            value: 'today',
            extra_value: null,
          },
          {
            object: 'deal',
            field_id: 12464,
            operator: '=',
            value: 'won',
            extra_value: null,
          },
        ],
      },
      {
        glue: 'or',
        conditions: [],
      },
    ],
  },
};
