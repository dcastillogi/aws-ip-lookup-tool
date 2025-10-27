# AWS IP Lookup Tool - MCP Server

## Installation

### 1. Clone the repository

Clone only the `mcp` folder from the repository:

```bash
git clone https://github.com/dcastillogi/aws-ip-lookup-tool.git
cd aws-ip-lookup-tool/mcp
```

### 2. Install uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 3. Find uv location

```bash
which uv
```

This will give you the full path, for example: `/Users/username/.local/bin/uv`

### 4. Configure Claude Desktop

Edit the Claude Desktop configuration file at:
`~/Library/Application Support/Claude/claude_desktop_config.json`

Add the MCP server configuration:

```json
{
  "mcpServers": {
    "aws-ip-lookup-tool": {
      "command": "/Users/username/.local/bin/uv",
      "args": [
        "--directory", 
        "/full/path/to/aws-ip-lookup-tool/mcp",
        "run", 
        "aws-ip-lookup-tool.py"
      ]
    }
  }
}
```

Replace `/full/path/to/aws-ip-lookup-tool/mcp` with the actual path where you cloned the project.

### 5. Restart Claude Desktop

Close and reopen Claude Desktop to load the new configuration.
## Us
age

Once configured, you can use the tool in Claude Desktop:

### Check a single IP
```
Check if IP 52.95.110.1 belongs to AWS
```

### Check multiple IPs
```
Check these IPs: 52.95.110.1, 54.239.28.85, 8.8.8.8
```

The tool will return information about whether each IP belongs to AWS, which AWS services use it, and which AWS regions it's associated with.