export interface ProductHttpResponse {
  retorno: Response
}
export interface Response {
  produtos: { produto: Product }[]
}

export interface Product {
  id?: string
  codigo: string
  descricao?: string
  tipo?: string
  situacao?: string
  unidade?: string
  preco?: string
  precoCusto?: string
  descricaoComplementar?: string
  cest?: string
  class_fiscal?: string
  idGrupoProduto?: any
  linkExterno?: string
  observacoes?: string
  descricaoFornecedor?: string
  idFabricante?: string
  codigoFabricante?: string
  pesoLiq?: string
  pesoBruto?: string
  gtin?: string
  gtinEmbalagem?: string
  alturaProduto?: string
  larguraProduto?: string
  profundidadeProduto?: string
  unidadeMedida?: any
  itensPorCaixa?: any
  volumes?: any
  estoqueMinimo?: string
  estoqueMaximo?: string
  localizacao?: string
  crossdocking?: string
  marca?: string
  garantia?: string
  condicao?: any
  freteGratis?: string
  producao?: string
  dataValidade?: string
  spedTipoItem?: string
  idCategoria?: string
  clonarDadosPai?: string
}

export interface OrderHttpResponseError {
  retorno: {
    erros: Array<{
      erro: {
        cod: number
        msg: string
      }
    }>
  }
}
export interface OrderHttpResponse {
  retorno: {
    pedidos: Array<{
      pedido: {
        numero: string
        idPedido: number
      }
    }>
  }
}
export interface Order {
  pipedriveDealId: number;
  total: number;
  pipedriveCreatedAt: string;
  cliente: Client
  transporte?: Transport
  itens?: Array<{ item: Item }>
  parcelas?: Array<{ parcel: Parcel }>
  vlr_frete?: string
  vlr_desconto?: string
  obs?: string
  obs_internas?: string
}

export interface Client {
  nome: string
  tipoPessoa?: string
  endereco?: string
  cpf_cnpj?: string
  ie?: string
  numero?: string
  complemento?: string
  bairro?: string
  cep?: string
  cidade?: string
  uf?: string
  fone?: string
  email?: string
}

export interface Transport {
  transportadora?: string
  tipo_frete?: string
  servico_correios?: string
  dados_etiqueta?: TagData
  volumes?: Array<{ volume: Volume }>
}

export interface TagData {
  nome?: string
  endereco?: string
  numero?: string
  complemento?: string
  municipio?: string
  uf?: string
  cep?: string
  bairro?: string
}

export interface Volume {
  servico?: string
  codigoRastreamento?: Array<any>
}

export interface Item {
  codigo?: number | string
  descricao?: string
  un?: string
  qtde?: number | string
  vlr_unit?: number | string
}

export interface Parcel {
  data?: string
  vlr?: string
  obs?: any
}