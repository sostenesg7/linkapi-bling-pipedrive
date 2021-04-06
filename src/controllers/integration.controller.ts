import { Request, Response, NextFunction } from 'express';
import { Integration } from '../models';
import { IntegrationDoc } from '../types/integration.types';
import { Types } from 'mongoose';
import { CustomRequest } from '../types/common.types';
import { blingAPI, pipedriveAPI } from '../apis';
import { Order } from '../types/bling.types';
const ObjectId = Types.ObjectId;

const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const order: Order = {
      pipedriveDealId: 0,
      cliente: {
        nome: 'Organisys Software',
        tipoPessoa: 'J',
        endereco: 'Rua Visconde de São Gabriel',
        cpf_cnpj: '00000000000000',
        ie: '3067663000',
        numero: '392',
        complemento: 'Sala 54',
        bairro: 'Cidade Alta',
        cep: '95.700-000',
        cidade: 'Bento Gonçalves',
        uf: 'RS',
        fone: '5481153376',
        email: 'teste@teste.com.br',
      },
      itens: [
        {
          item: {
            codigo: '001',
            descricao: 'Caneta 001',
            un: 'Pç',
            qtde: '10',
            vlr_unit: '1.68',
          }
        },
      ],
    };

    const data = await blingAPI.createOrder({
      apiKey:
        '72fc8fab18ef3e077a0adbdd13125e089e997785206751f49fbca9ca48248821b97b9b86',
      order,
    });

    return res.json(data);
  } catch (error) {
    next();
  }
};

const listOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {

    const data = await pipedriveAPI.list({
      apiToken: 'b51865d76db88d36e9d37b362c04cc0ea7900649',
      limit: 100
    });

    return res.json(data);
  } catch (error) {
    next();
  }
};

export { createOrder, listOrders };
