# Projeto Recarga

Sistema para gerenciamento de recargas de veículos, com importação de dados, API em Node.js e persistência em banco de dados MySQL.

---

## 🛠️ Como configurar o ambiente

1. **Pré-requisitos**  
   - Node.js (v14 ou superior)
   - MySQL Server
   - Git
   - npm

2. **Clonar o repositório**  
   ```bash
   git clone <url-do-repo>
   cd projeto-recarga
   ```

3. **Instalar dependências Node.js sql12 e dotenv**  
   ```bash
   npm install
   npm install dotenv mysql2


   ```

4. **Configurar variáveis de ambiente**  
   Crie um arquivo `.env` na raiz com as variáveis:
   ```env
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=recarga_veiculos
   ```

5. **Criar o banco de dados e importar base inicial**  
   - Crie o banco `recarga_veiculos` no MySQL.
   - Importe o arquivo `base_inicial.csv` manualmente via MySQL Workbench ou script próprio.

---

## 🚀 Como rodar o projeto localmente

Após configurar o `.env` e o banco:

```bash
npm start
```

Por padrão, a aplicação será iniciada em `http://localhost:3000`.

---

## 🧱 Estrutura do Projeto

```
projeto recarga/
├── .env                       # Variáveis de ambiente
├── base_inicial.csv          # Base de dados para importação
├── package.json              # Dependências e scripts
├── server.js                 # Ponto de entrada da aplicação
├── db.js                     # Conexão com banco MySQL
├── controllers/              # Lógica das rotas
│   ├── recargaController.js
│   └── veiculoController.js
└── node_modules/             # Dependências do projeto
```

---

## 🧭 Como me localizar no projeto

- `server.js`  
  Ponto inicial da aplicação. Responsável por configurar rotas e middlewares.

- `controllers/`  
  Contém a lógica das rotas da API, como manipulação de recargas e veículos.

- `db.js`  
  Arquivo central de conexão com o banco de dados.

- `.env`  
  Onde estão as credenciais e configurações sensíveis.

- `base_inicial.csv`  
  Base de dados de recarga que pode ser usada para importação manual no banco.


DIAGRAMA DO BANCO :

<img width="678" height="547" alt="diagrama" src="https://github.com/user-attachments/assets/ee856fe3-9f8b-40df-95d5-968db4e7f4ce" />


