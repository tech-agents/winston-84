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

The agent is configured to connect to socket-mcp server via npx. Set the Socket API key:

```bash
export SOCKET_API_KEY=your-api-key-here
```

The server will be automatically launched via `npx -y @socketsecurity/mcp@latest` when the client connects.

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

