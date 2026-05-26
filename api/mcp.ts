export const config = {
  runtime: 'edge',
};

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
  return new Response(JSON.stringify({
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
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders()
    }
  });
}

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const body = bodyText ? JSON.parse(bodyText) : {};
    const { action, command, params, method } = body;

    let result: any = {};

    // Standard MCP protocol responses
    if (method === "initialize") {
      result = {
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
      return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json', ...getCorsHeaders() } });
    }

    if (method === "tools/list" || action === "tools/list") {
      return new Response(JSON.stringify({ tools: TOOLS }), { headers: { 'Content-Type': 'application/json', ...getCorsHeaders() } });
    }

    if (method === "prompts/list" || action === "prompts/list") {
      return new Response(JSON.stringify({ prompts: [] }), { headers: { 'Content-Type': 'application/json', ...getCorsHeaders() } });
    }

    if (method === "resources/list" || action === "resources/list") {
      return new Response(JSON.stringify({ resources: [] }), { headers: { 'Content-Type': 'application/json', ...getCorsHeaders() } });
    }

    if (method === "tools/call" || action === "tools/call") {
      const toolName = body.params?.name || params?.name || command;
      result = {
        content: [{ type: "text", text: `Executed ${toolName} successfully.` }],
        isError: false
      };
      return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json', ...getCorsHeaders() } });
    }

    // Legacy or custom commands fallback
    switch (action || command) {
      case "status":
      case "ping":
        result = { 
          status: "online", 
          agent: "Endless Runner Orchestrator",
          message: "Ready to run endlessly" 
        };
        break;

      case "execute":
        result = {
          success: true,
          action: command || params,
          executedAt: new Date().toISOString(),
          message: "Command executed in Endless Runner"
        };
        break;

      case "get_info":
        result = {
          name: "Endless Runner Orchestrator",
          wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
          platform: "Base",
          version: "1.0.0"
        };
        break;

      default:
        result = {
          success: true,
          message: "Command received",
          data: body
        };
    }

    return new Response(JSON.stringify({
      status: "success",
      agent: "Endless Runner Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    }), { headers: { 'Content-Type': 'application/json', ...getCorsHeaders() } });

  } catch (error: any) {
    return new Response(JSON.stringify({
      status: "error",
      message: "Failed to process MCP command",
      details: error.message
    }), { status: 400, headers: { 'Content-Type': 'application/json', ...getCorsHeaders() } });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders()
  });
}
