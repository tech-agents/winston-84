/**
 * Domain interface for MCP client
 * Defines the contract without implementation details
 */
export interface IMcpClient {
  listTools(): Promise<{ tools?: Array<{ name: string; description?: string }> }>;
  callTool(name: string, args: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

