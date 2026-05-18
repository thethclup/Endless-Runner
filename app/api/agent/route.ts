import { NextResponse } from 'next/server';

const agentInfo = {
  name: "Endless Runner Orchestrator",
  status: "active",
  wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
  platform: "Endless Runner",
  version: "1.0.0",
  description: "Endless Runner platformunda çalışan ERC-8004 uyumlu AI Agent. Endless running mechanics, obstacle management, score optimization ve continuous automation yapan akıllı orchestrator."
};

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function GET() {
  return NextResponse.json(agentInfo, { headers: getCorsHeaders() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    return NextResponse.json({
      ...agentInfo,
      receivedData: body,
      message: "Agent interacted successfully"
    }, { headers: getCorsHeaders() });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process request"
    }, { status: 400, headers: getCorsHeaders() });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders()
  });
}
