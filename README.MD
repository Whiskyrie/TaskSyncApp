# TaskSyncApp

TaskSyncApp é um aplicativo desenvolvido em React Native para gerenciamento de tarefas, permitindo aos usuários adicionar, visualizar e excluir tarefas. Além disso, o aplicativo sincroniza automaticamente as tarefas com um serviço de backend quando conectado à internet.

## Funcionalidades

- Adicionar novas tarefas.
- Excluir tarefas existentes.
- Visualizar o status de sincronização de cada tarefa (Sincronizado ou Pendente).
- Gerenciamento offline: permite criar tarefas mesmo sem conexão à internet.
- Sincronização automática ao restabelecer a conexão.

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile multiplataforma.
- **@react-native-community/netinfo**: Para detectar o estado da conexão de rede.
- **Expo**: Gerenciamento do projeto e desenvolvimento.
- **TypeScript**: Para um código mais seguro e tipado.

## Como Executar o Projeto

### Pré-requisitos

- Node.js instalado.
- Yarn ou npm como gerenciador de pacotes.
- Expo CLI instalado globalmente.
- Dispositivo ou emulador com Android ou iOS configurado.

### Passo a Passo

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/task-sync-app.git
   cd task-sync-app
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   ```

3. Inicie o servidor do Expo:

   ```bash
   expo start
   ```

4. Escaneie o QR Code com o aplicativo Expo Go no seu dispositivo ou execute no emulador desejado.

## Estrutura do Projeto

```
TaskSyncApp/
├── assets/
├── src/
│   ├── components/
│   │   └── TaskInput.tsx
│   ├── services/
│   │   ├── localStorageServices.ts
│   │   └── syncService.ts
│   ├── types/
│   │   └── types.ts
│   └── App.tsx
├── package.json
└── README.md
```
