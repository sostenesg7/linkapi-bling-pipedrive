const { parse: xmlToJSON } = require('js2xmlparser');

const jsonData = {
  id: '11948415608',
  codigo: '223435780',
  descricao: 'Caneta 001',
  tipo: 'P',
  situacao: 'Ativo',
  unidade: 'Pc',
  preco: '1.68',
  precoCusto: '1.23',
  descricaoComplementar: 'Descrição complementar da caneta',
  cest: '28.040.00',
  class_fiscal: '1000.01.01',
  linkExterno: '',
  observacoes: '',
  descricaoFornecedor: '',
  idFabricante: '',
  codigoFabricante: '',
  pesoLiq: '0.18',
  pesoBruto: '0.2',
  gtin: '223435780',
  gtinEmbalagem: '54546',
  alturaProduto: '21',
  larguraProduto: '11',
  profundidadeProduto: '31',
  estoqueMinimo: '1.00',
  estoqueMaximo: '100.00',
  localizacao: '',
  crossdocking: '',
  marca: 'Marca da Caneta',
  garantia: '',
  freteGratis: 'N',
  producao: '',
  dataValidade: '',
  spedTipoItem: '',
  clonarDadosPai: 'N',
};

const xmlData = xmlToJSON('produto', jsonData);

console.log(xmlData);