import { Order } from '../types/bling.types';
import { DealProduct, Product } from '../types/pipedrive.product.types';
import { Deal } from '../types/pipedrive.types';

export const transformPipedriveDealToBlingOrder = (deals: Array<Deal>) => {
  const orderList: Order[] = deals.map((deal, index) => {

    const {
      person_id,
      id,
      add_time,
      value,
    } = deal;

    const phone = person_id?.email.find(({ primary }) => primary)?.value;
    const email = person_id?.phone.find(({ primary }) => primary)?.value;

    const order: Order = {
      pipedriveDealId: id,
      pipedriveCreatedAt: add_time,
      total: value,
      cliente: {
        nome: person_id?.name || 'Usuário sem nome',
        fone: phone,
        email,
        // 'tipoPessoa': 'J',
        'endereco': 'Rua Visconde de São Gabriel',
        // 'cpf_cnpj': '00000000000000',
        'ie': '3067663000',
        'numero': '392',
        'complemento': 'Sala 54',
        'bairro': 'Cidade Alta',
        'cep': '95.700-000',
        'cidade': 'Bento Gonçalves',
        'uf': 'RS',
      },
      obs: `Deal ${id}`,
    };
    return order;
  });
  return orderList;
};

export const transformPipedriveProductToBlingItem = (products: Array<DealProduct>) => {
  return products?.map((product) => (
    {
      item: {
        // Fixed product code
        codigo: '223435780',
        descricao: product.name,
        un: 'Pç',
        qtde: product.quantity,
        vlr_unit: product.item_price,
      }
    }
  ))
};