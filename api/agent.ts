export const config = {
  runtime: 'edge',
};

const agentInfo = {
  name: "Endless Runner Orchestrator",
  status: "active",
  wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
  platform: "Endless Runner",
  version: "1.0.0",
  description: "High-performance AI Agent specialized in warp racing mechanics, real-time automation, multi-track management, competitive optimization and ecosystem coordination on Base."
};

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function GET() {
  return new Response(JSON.stringify(agentInfo), {
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
    
    return new Response(JSON.stringify({
      ...agentInfo,
      receivedData: body,
      message: "Agent interacted successfully"
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders()
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: "error",
      message: "Failed to process request"
    }), { status: 400, headers: { 'Content-Type': 'application/json', ...getCorsHeaders() } });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders()
  });
}
