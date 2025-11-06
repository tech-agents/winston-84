import { test, mock } from 'node:test';
import assert from 'node:assert';
import { AgentApplication } from './agent.application.js';
import type { IMcpClient } from '../domain/interfaces/mcp-client.interface.js';

test('AgentApplication lists tools', async () => {
  const mockClient: IMcpClient = {
    listTools: mock.fn(async () => ({
      tools: [{ name: 'test-tool', description: 'A test tool' }],
    })),
    callTool: mock.fn(async () => ({ result: 'success' })),
    close: mock.fn(async () => {}),
  };

  const agent = new AgentApplication(mockClient);
  await agent.run();

  assert.strictEqual(mockClient.listTools.mock.calls.length, 1);
  await agent.cleanup();
  assert.strictEqual(mockClient.close.mock.calls.length, 1);
});

