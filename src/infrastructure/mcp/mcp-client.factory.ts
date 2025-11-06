import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { McpClientAdapter } from './mcp-client.adapter.js';
import type { IMcpClient } from '../../domain/interfaces/mcp-client.interface.js';

export interface McpConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

/**
 * Factory for creating MCP client instances
 * Encapsulates infrastructure setup
 */
export class McpClientFactory {
  static async create(config: McpConfig): Promise<IMcpClient> {
    console.log(`Starting MCP server: ${config.command} ${config.args.join(' ')}`);
    
    // Use Homebrew's Node by prioritizing /opt/homebrew/bin in PATH
    const env = {
      ...process.env,
      PATH: `/opt/homebrew/bin:${process.env.PATH || ''}`,
      ...config.env,
    };
    
    const transport = new StdioClientTransport({
      command: config.command,
      args: config.args,
      env,
    });

    const client = new Client(
      {
        name: 'mcp-ai-agent',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );

    try {
      await client.connect(transport);
      console.log('Connected to MCP server');
      
      // Initialize is handled automatically by connect() in newer SDK versions
      console.log('MCP client ready');
      
      return new McpClientAdapter(client);
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      throw new Error(
        `Failed to connect to MCP server. ` +
        `Make sure the server command is correct and Node.js version is compatible. ` +
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

