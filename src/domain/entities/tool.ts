/**
 * Domain entity representing a tool
 */
export class Tool {
  constructor(
    public readonly name: string,
    public readonly description?: string
  ) {}

  static fromMcpTool(tool: { name: string; description?: string }): Tool {
    return new Tool(tool.name, tool.description);
  }
}

