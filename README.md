# MCP AI Agent

A bare-bones TypeScript AI agent using Clean Architecture principles to interact with socket-mcp server running locally via npx.

## Architecture

```
src/
├── index.ts                    # Entry point
├── domain/                     # Domain layer (business logic)
│   ├── interfaces/            # Domain contracts
│   │   └── mcp-client.interface.ts
│   └── entities/              # Domain entities
│       └── tool.ts
├── application/               # Application layer (use cases)
│   └── agent.application.ts
└── infrastructure/            # Infrastructure layer (external)
    ├── mcp/                   # MCP implementation
    │   ├── mcp-client.adapter.ts
    │   └── mcp-client.factory.ts
    └── config/                # Configuration
        └── index.ts
```

## Clean Architecture Principles

- **Domain Layer**: Pure business logic, no dependencies
- **Application Layer**: Orchestrates domain logic, depends on domain interfaces
- **Infrastructure Layer**: Implements domain interfaces, handles external concerns
- **Dependency Inversion**: Domain defines contracts, infrastructure implements them

## Setup

```bash
npm install
```

## Configuration

The agent is configured to connect to socket-mcp server via npx. 

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Socket API key to `.env`:
   ```bash
   SOCKET_API_KEY=your-api-key-here
   ```

   Or set it as an environment variable:
   ```bash
   export SOCKET_API_KEY=your-api-key-here
   ```

The server will be automatically launched via `npx -y @socketsecurity/mcp@latest` when the client connects.

**Note**: The test packages (`lodash@4.17.15` and `@crowdstrike/logscale-dashboard@1.205.1`) in `devDependencies` are included for testing socket-mcp's vulnerability detection capabilities.

## Usage

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## Testing

```bash
npm test
```

