import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import type { IMcpClient } from '../../domain/interfaces/mcp-client.interface.js';

/**
 * Infrastructure adapter implementing domain interface
 * Bridges MCP SDK to domain abstraction
 */
export class McpClientAdapter implements IMcpClient {
  constructor(private readonly client: Client) {}

  async listTools() {
    return await this.client.listTools();
  }

  async callTool(name: string, args: Record<string, unknown>) {
    const result = await this.client.callTool({
      name,
      arguments: args,
    });
    return result;
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}

