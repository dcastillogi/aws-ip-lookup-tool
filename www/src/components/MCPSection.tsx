import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ExternalLink } from 'lucide-react';

export default function MCPSection() {
    return (
        <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-blue-50 backdrop-blur-sm mt-8">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-gray-800">
                    Use This Directly in Your GenAI Tools
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                    Integrate this AWS IP lookup tool directly into Claude Desktop, Amazon Q CLI, or any tool that supports Model Context Protocol (MCP)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <img 
                        src="/mcp.gif" 
                        alt="MCP Server Demo" 
                        className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        asChild
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                    >
                        <a
                            href="https://github.com/dcastillogi/aws-ip-lookup-tool/blob/main/mcp/README.md"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Install MCP Server
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        asChild
                        className="border-purple-200 hover:bg-purple-50"
                    >
                        <a
                            href="https://modelcontextprotocol.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Learn About MCP
                        </a>
                    </Button>
                </div>
                <div className="text-center text-sm text-gray-600">
                    <p>Compatible with Claude Desktop, Amazon Q CLI, and other MCP-enabled tools</p>
                </div>
            </CardContent>
        </Card>
    );
}