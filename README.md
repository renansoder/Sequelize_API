## ORIENTAÇÕES DE AÇÕES Sequelize

- Este projeto é com MySql (no prompt: mysql -u usuario -p)

- Instalar pacotes (ver package.json)
- npx sequelize-cli init
- Criar .gitignore
- acrescentar scripts "start"
- Configurar .sequelizerc
- Configurar config.json

--> CRIAR BANCO: criado pelo terminal (create database escola;)

--> CRIAR MODEL: npx sequelize-cli model:create --name User --attributes firstName:string,lastName:string,email:string

--> CRIAR TABELA NO BANCO: npx sequelize-cli db:migrate

--> POPULAR BANCO: npx sequelize-cli seed:generate --name demo-pessoa

--> Depois de colocar itens no seed: npx sequelize-cli db:seed:all (roda all por que é o único)

--> Começar a criação de tabelas pelas que não usam FK. (Pessoas, depois Niveis, depois Turmas, depois Matriculas)
--> As FK são feitas depois, mas antes de rodar o db:migrate. (associações são feitas nos models)
--> Feitas as associações (hasMany e belongsTo) em models, é preciso referenciar em migrations as FK, fazendo references:{models:'', key:''}.
--> Agora pode rodar as migrações. (npx sequelize-cli db:migrate)
--> Quando rodar db:migrate é importante a ordem de criação das tabelas. (quando criar Turmas, já existe Niveis e Pessoas)
--> Depois pode rodar o db:seed:all para popular tabela.

--> Utilizando o paranoid:true é neceessário criar a coluna deletedAt, esta é criada dentro da pasta migrations (addcolumn-pessoa), depois se roda o comando npx sequelize-cli db:migrate, para criar a coluna no banco.

--> "defaultScope" funciona como um filtro para todas as pesquisas do model em que for incluído.
--> "scopes" é um filtro que coloca-se o nome que quiser e os filtros que se quer, mas para fucionar, necessário se faz, utilizar o nome do scope.

--> "validate" vai dentro do model.
--> "unique: true" vai dentro do model. Garante, por exemplo, que o nome de usuário de quem for utilizar o sistema seja sempre único.

importante antes de rodar migrações é realizar as relações entre tabelas.
Rodar o db:migrate sem as relações, somente com as colunas que não tem dependência.

- Relações (hasMany, belongsTo...), depois criar as colunas nas migrations.

  Importante rodar a criação nas seed na ordem correta, por exemplo, primeiro Pessoas e Niveis, depois turmas e matrículas, pois estas necessitam de itens de Prssoas e Niveis.

- npx sequelize-cli db:migrate:undo ( para desfazer a última tabela)
- db:migrate:undo --name [data-hora]-create-[nome-da-tabela].js (desfaz tabela específica)

- npx sequelize db:seed:undo (desfazer último seeds)

- paranoid: true --> é para o soft delete, ou seja, ele não exclui definitivamente do banco. O deletedAt não fica null, mas sim com a data que que foi deletado.

- Adiconar nova coluna em tabela:
  Pode ser em sql: use escola_ingles,
  alter table Pessoas,
  add column deletedAt datetime after updatedAt
- Ou cria o arquivo de migração (olhar addColumn-pessoas.js), depois roda no terminal npx sequelize-cli db:migrate

- allowNull: true, permite que o item seja null.

-defaultScope: {where:{}, include:} funciona como um filtro, definindo restrições. É o escopo padrão para montagem da query SELECT.

- scope: {} define escopo específico para a pesquisa.

- validate: {} para validação de campo. É pronto no sequelize e tem vários tipos.

#### São constraints em SQL:

NOT NULL - garante que não exista nenhum valor NULL na coluna;

UNIQUE - Garante que não existam valores iguais em uma coluna;

PRIMARY KEY - Identifica cada linha em uma tabela através de um valor único (junção de NOT NULL e UNIQUE);

FOREIGN KEY - Identifica um valor único em outra tabela como chave;

CHECK - Garante que todos os valores em uma coluna satisfazem uma condição específica;

DEFAULT - Determina um valor padrão caso nenhum valor seja informado;

INDEX - Para criar índices e facilitar o acesso a determinados conjuntos de dados.

const Pessoa = sequelize.define('Pessoa', {
nomeUser: {
type: DataTypes.STRING,
unique: true
},

#### MIXINS --> A lista de métodos criados automaticamente com as instâncias de modelo são:

// addModel()

// addModels()

// countModels()

// createModel()

// getModels()

// hasModel()

// hasModels()

// removeModel()

// removeModels()

// setModels()

// Lembrando que “Model” e “Models”, aqui, refere-se ao nome do modelo!
