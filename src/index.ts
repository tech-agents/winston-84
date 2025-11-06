import { AgentApplication } from './application/agent.application.js';
import { McpClientFactory } from './infrastructure/mcp/mcp-client.factory.js';
import { config } from './infrastructure/config/index.js';

async function main(): Promise<void> {
  try {
    console.log('Initializing MCP client...');
    const mcpClient = await McpClientFactory.create(config.mcp);
    const agent = new AgentApplication(mcpClient);

    await agent.run();
    await agent.cleanup();
  } catch (error) {
    console.error('Fatal error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
    process.exit(1);
  }
}

main().catch(console.error);

