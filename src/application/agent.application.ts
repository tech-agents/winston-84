import { readFileSync } from 'fs';
import { join } from 'path';
import type { IMcpClient } from '../domain/interfaces/mcp-client.interface.js';
import { Tool } from '../domain/entities/tool.js';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/**
 * Application layer - orchestrates domain logic
 * Depends on domain interfaces, not implementations
 */
export class AgentApplication {
  constructor(private readonly mcpClient: IMcpClient) {}

  async run(): Promise<void> {
    console.log('Agent starting...');

    const tools = await this.listAvailableTools();
    console.log(`\nFound ${tools.length} tool(s):\n`);
    
    tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}`);
      if (tool.description) {
        console.log(`   Description: ${tool.description}`);
      }
      console.log('');
    });

    // Query depscore tool with package.json dependencies
    const depscoreTool = tools.find(t => t.name === 'depscore');
    if (depscoreTool) {
      await this.queryDepscore(depscoreTool);
    }
  }

  private async listAvailableTools(): Promise<Tool[]> {
    const result = await this.mcpClient.listTools();
    return (result.tools || []).map(Tool.fromMcpTool);
  }

  private async queryDepscore(tool: Tool): Promise<void> {
    console.log('\nQuerying depscore tool with package.json dependencies...\n');
    
    // Read package.json
    const packageJsonPath = join(process.cwd(), 'package.json');
    let packageJson: PackageJson;
    
    try {
      const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
      packageJson = JSON.parse(packageJsonContent);
    } catch (error) {
      throw new Error(
        `Failed to read package.json: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Extract and format dependencies
    // depscore expects: { ecosystem, depname, version }
    const packages: Array<{ ecosystem: string; depname: string; version: string }> = [];

    // Process dependencies
    if (packageJson.dependencies) {
      for (const [name, version] of Object.entries(packageJson.dependencies)) {
        // Remove version prefix (^, ~, etc.)
        const cleanVersion = version.replace(/^[\^~>=<]/, '');
        packages.push({
          ecosystem: 'npm',
          depname: name,
          version: cleanVersion || 'unknown',
        });
      }
    }

    // Process devDependencies
    if (packageJson.devDependencies) {
      for (const [name, version] of Object.entries(packageJson.devDependencies)) {
        const cleanVersion = version.replace(/^[\^~>=<]/, '');
        packages.push({
          ecosystem: 'npm',
          depname: name,
          version: cleanVersion || 'unknown',
        });
      }
    }

    console.log(`Found ${packages.length} package(s) to check:\n`);
    packages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.depname}@${pkg.version}`);
    });
    console.log('');

    // Call depscore tool
    console.log('Calling depscore tool...\n');
    const result = await this.mcpClient.callTool(tool.name, {
      packages,
    });

    // Extract and display plain text response
    console.log('Depscore result:\n');
    if (result && typeof result === 'object' && 'content' in result) {
      const content = (result as { content?: Array<{ type?: string; text?: string }> }).content;
      if (Array.isArray(content)) {
        for (const item of content) {
          if (item.type === 'text' && item.text) {
            console.log(item.text);
          }
        }
      }
    } else {
      console.log(String(result));
    }
  }

  async useTool(tool: Tool): Promise<void> {
    console.log(`Using tool: ${tool.name}`);
    // Implement tool usage logic here
    const result = await this.mcpClient.callTool(tool.name, {});
    console.log('Tool result:', result);
  }

  async cleanup(): Promise<void> {
    await this.mcpClient.close();
    console.log('Agent stopped');
  }
}

