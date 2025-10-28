# AWS IP Lookup Tool

Tool to verify if IP addresses belong to AWS services. Useful for identifying which AWS services are behind a specific IP, analyzing multiple IPs in batch, and getting information about regions and CIDR ranges. Includes an interactive web application and an MCP server for your GenAI tools.

**Live Demo:** https://d3604cm7i64zvo.cloudfront.net

## Structure

```
├── www/    # Web application (Astro + React)
├── mcp/    # MCP server for Claude Desktop
```

## Quick Start

### Web App
```bash
cd www
npm install
npm run dev
```

### MCP Server
```bash
cd mcp
# Install uv if you don't have it
curl -LsSf https://astral.sh/uv/install.sh | sh

# Configure in Claude Desktop
# Edit: ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "aws-ip-lookup-tool": {
      "command": "/path/to/uv",
      "args": ["--directory", "/path/to/mcp", "run", "aws-ip-lookup-tool.py"]
    }
  }
}
```

## Features

- Individual and batch IP address lookup
- CSV export of results
- Claude Desktop integration via MCP server
- Real-time official AWS data
- Detailed information on services, regions, and CIDR ranges