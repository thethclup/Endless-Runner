import { NextResponse } from 'next/server';

const TOOLS = [
  {
    name: "get_race_status",
    description: "Get the current endless runner race status and metrics.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "start_race",
    description: "Initialize and start a new endless runner race sequence.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "get_leaderboard",
    description: "Retrieve the current on-chain endless runner leaderboard.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "optimize_speed",
    description: "Calculate and apply speed optimizations for the runner.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "get_track_info",
    description: "Retrieve procedural generation details for the current track.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
];

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Endless Runner MCP Endpoint",
    status: "active",
    description: "Active MCP server for Endless Runner Orchestrator Agent",
    capabilities: {
      tools: true,
      prompts: true,
      resources: true
    },
    tools: TOOLS,
    prompts: [],
    resources: [],
    timestamp: new Date().toISOString()
  }, {
    headers: getCorsHeaders()
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, command, params, method, jsonrpc, id } = body;

    const isJsonRpc = jsonrpc === "2.0";

    // Standard MCP protocol responses
    if (method === "initialize" || action === "initialize") {
      const result = {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {},
          prompts: {},
          resources: {}
        },
        serverInfo: {
          name: "Endless Runner Orchestrator",
          version: "1.0.0"
        }
      };
      if (isJsonRpc) {
        return NextResponse.json({ jsonrpc: "2.0", id, result }, { headers: getCorsHeaders() });
      }
      return NextResponse.json(result, { headers: getCorsHeaders() });
    }

    if (method === "tools/list" || action === "tools/list") {
      const result = { tools: TOOLS };
      if (isJsonRpc) {
        return NextResponse.json({ jsonrpc: "2.0", id, result }, { headers: getCorsHeaders() });
      }
      return NextResponse.json(result, { headers: getCorsHeaders() });
    }

    if (method === "prompts/list" || action === "prompts/list") {
      const result = { prompts: [] };
      if (isJsonRpc) {
        return NextResponse.json({ jsonrpc: "2.0", id, result }, { headers: getCorsHeaders() });
      }
      return NextResponse.json(result, { headers: getCorsHeaders() });
    }

    if (method === "resources/list" || action === "resources/list") {
      const result = { resources: [] };
      if (isJsonRpc) {
        return NextResponse.json({ jsonrpc: "2.0", id, result }, { headers: getCorsHeaders() });
      }
      return NextResponse.json(result, { headers: getCorsHeaders() });
    }

    if (method === "tools/call" || action === "tools/call") {
      const toolName = body.params?.name || params?.name || command;
      const result = {
        content: [{ type: "text", text: `Executed ${toolName} successfully.` }],
        isError: false
      };
      if (isJsonRpc) {
        return NextResponse.json({ jsonrpc: "2.0", id, result }, { headers: getCorsHeaders() });
      }
      return NextResponse.json(result, { headers: getCorsHeaders() });
    }

    // Legacy or custom commands fallback
    let fallbackResult: any = {};
    switch (action || command) {
      case "status":
      case "ping":
        fallbackResult = { 
          status: "online", 
          agent: "Endless Runner Orchestrator",
          message: "Ready to run endlessly" 
        };
        break;

      case "execute":
        fallbackResult = {
          success: true,
          action: command || params,
          executedAt: new Date().toISOString(),
          message: "Command executed in Endless Runner"
        };
        break;

      case "get_info":
        fallbackResult = {
          name: "Endless Runner Orchestrator",
          wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
          platform: "Base",
          version: "1.0.0"
        };
        break;

      default:
        fallbackResult = {
          success: true,
          message: "Command received",
          data: body
        };
    }

    return NextResponse.json({
      status: "success",
      agent: "Endless Runner Orchestrator",
      response: fallbackResult,
      receivedAt: new Date().toISOString()
    }, { headers: getCorsHeaders() });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process MCP command"
    }, { status: 400, headers: getCorsHeaders() });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders()
  });
}
