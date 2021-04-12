# Sobre

Estes documento README tem como objetivo fornecer as informações necessárias sobre o integrador de dados.

# 👷 Requisitos

- Criar uma integração entre as plataformas Pipedrive e Bling. (A integração deve buscar as oportunidades com status igual a ganho no Pipedrive, depois inseri-las como pedido no Bling). 

- Agregar as oportunidades inseridas no bling, tendo um registro no mongo por dia contendo a soma de todos os valores de todos os pedido com ganho daquele dia.

# 🔧 Configuração
  #### Para configurar o integrador, é necessário editar o arquivo .env e adicionar as seguintes variáveis
    PIPEDRIVE_API_KEY=Sua chave de API do Pipedrive
    BLING_API_KEY=Sua chave de API do Bling
 #### Após isso, iniciar o serviço, executando: 
    docker-compose up --build
# 🚀 Como utilizar o integrador?

  1. Criar um negócio no Pipedrive;
  2. Alterar o status do negócio para "Ganho";
  3. Aguardar um minuto pela integração automática, ou realizar a integração manual ([Mais informações](#manual));
  4. Navegar até a lista de pedidos no Bling.
    
## Integração
  - ### Automática
    #### O integrador executa a tarefa de integração a cada um minuto. 
  - ### Manual
    Realizar uma requisição [POST] http://localhost:3000/api/integration/ (Visite a secão [Links](#-links), para acesso à documentação dos endpoints)

## Listar total por dia
  - Realizar uma requisição [GET] http://localhost:3000/api/integration/ (Visite a secão [Links](#-links), para acesso à documentação dos endpoints)


# 🖥  Tecnologias utilizadas

- O integrador e a API foram construídos em **NodeJS** e **TypeScript**
- Foi utilizada a biblioteca de fila de mensageria **Bull**
- Os Bancos de Dados utilizados
  - **MongoDB**
  - **Redis**
- Demais frameworks utilizados
  - **ExpressJS**
  - **mongoose**
- Os serviços são executados em containers **Docker**

# 🔗 Links úteis

- Documentação Pipedrive https://developers.pipedrive.com/docs/api/v1
- Documentação Bling:

  1. Rate limit https://ajuda.bling.com.br/hc/pt-br/articles/360046302394-Limites
  2. Criar pedido https://ajuda.bling.com.br/hc/pt-br/articles/360047064693-POST-pedido

- Documentação dos endpoints https://documenter.getpostman.com/view/2405357/TzCV4QtP