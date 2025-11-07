export interface McpConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

/**
 * Configuration for socket-mcp server running locally via npx
 * The server will be launched automatically when the client connects
 */
export const config = {
  mcp: {
    command: 'npx',
    args: ['-y', '@socketsecurity/mcp@latest'],
    env: {
      SOCKET_API_KEY: process.env.SOCKET_API_KEY || '',
    },
  } satisfies McpConfig,
};

