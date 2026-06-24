import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { BUILDER_CODE, declareBuilderCodeExtension } from "@x402/extensions/builder-code";

const TOOLS = [
  {
    name: "get_race_status",
    description: "Get the current endless runner race status and metrics.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "start_race",
    description: "Initialize and start a new endless runner race sequence.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "get_leaderboard",
    description: "Retrieve the current onchain endless runner leaderboard.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "optimize_speed",
    description: "Calculate and apply speed optimizations for the runner.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "get_track_info",
    description: "Retrieve procedural generation details for the current track.",
    inputSchema: { type: "object", properties: {} }
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add JSON body parser for POST requests
  app.use(express.json());

  // CORS headers for MCP
  app.use("/api/mcp", (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Payment-Signature');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  // === MCP API ===
  const resourceServer = new x402ResourceServer().register("eip155:84532", new ExactEvmScheme());

  app.use(
    paymentMiddleware(
      {
        "POST /api/mcp": {
          accepts: [
            {
              scheme: "exact",
              price: "1000000000000", // 0.000001 ETH
              network: "eip155:84532",
              payTo: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", // Orchestrator wallet
            },
          ],
          description: "Endless Runner MCP AI Agent Tools",
          mimeType: "application/json",
          extensions: {
            [BUILDER_CODE]: declareBuilderCodeExtension("bc_1aw46v36"),
          },
        },
      },
      resourceServer,
      undefined,
      undefined,
      false
    )
  );

  app.get("/api/mcp", (req, res) => {
    res.json({
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
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body || {};
      const { action, command, params, method, jsonrpc, id } = body;

      const isJsonRpc = jsonrpc === "2.0";

      let result: any = {};

      if (method === "initialize" || action === "initialize") {
        const result = {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {}, prompts: {}, resources: {} },
          serverInfo: { name: "Endless Runner Orchestrator", version: "1.0.0" }
        };
        const responsePayload = isJsonRpc ? { jsonrpc: "2.0", id, result } : result;
        return res.json(responsePayload);
      }

      if (method === "tools/list" || action === "tools/list") {
        const result = { tools: TOOLS };
        const responsePayload = isJsonRpc ? { jsonrpc: "2.0", id, result } : result;
        return res.json(responsePayload);
      }

      if (method === "prompts/list" || action === "prompts/list") {
        const result = { prompts: [] };
        const responsePayload = isJsonRpc ? { jsonrpc: "2.0", id, result } : result;
        return res.json(responsePayload);
      }

      if (method === "resources/list" || action === "resources/list") {
        const result = { resources: [] };
        const responsePayload = isJsonRpc ? { jsonrpc: "2.0", id, result } : result;
        return res.json(responsePayload);
      }

      if (method === "tools/call" || action === "tools/call") {
        const toolName = body.params?.name || params?.name || command;
        let toolText = "";
        let isError = false;

        switch (toolName) {
          case "get_race_status":
            toolText = JSON.stringify({
              status: "PLAYING",
              player: {
                x: 100,
                y: 412.5,
                state: "RUN",
                vy: 0
              },
              metrics: {
                distance: 348.5,
                score: 1420.2,
                combo: 2.4,
                speed: 480,
                multiplierActive: true
              },
              environment: {
                epoch: 240,
                activeTheme: "Base L2 Golden Grid",
                gasPriceGwei: 0.012,
                blockNumber: 18290382,
                orchestratorWallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6"
              }
            }, null, 2);
            break;

          case "start_race":
            toolText = JSON.stringify({
              success: true,
              message: "Runner initialized and launched at Base Mainnet speed profile.",
              raceId: "race_" + Math.random().toString(36).substring(2, 11),
              initialState: {
                distance: 0,
                score: 0,
                combo: 1.0,
                speed: 400
              },
              timestamp: new Date().toISOString()
            }, null, 2);
            break;

          case "get_leaderboard":
            toolText = JSON.stringify({
              leaderboard: [
                { rank: 1, address: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", score: 98520, distance: 14200, timestamp: "2026-06-11T12:00:00Z", verified: true },
                { rank: 2, address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", score: 75200, distance: 10800, timestamp: "2026-06-12T01:15:00Z", verified: true },
                { rank: 3, address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", score: 62100, distance: 8900, timestamp: "2026-06-12T05:22:00Z", verified: true },
                { rank: 4, address: "0x2D8c3C6CEdb94A3D7aCd730D98399564b73E7b18", score: 45120, distance: 6300, timestamp: "2026-06-12T09:41:00Z", verified: true }
              ],
              contract: {
                network: "Base Mainnet",
                chainId: 8453,
                resolverAddress: "0x019a3bc4d22da10ac73d8e53415d37aa96045330a"
              },
              timestamp: new Date().toISOString()
            }, null, 2);
            break;

          case "optimize_speed":
            toolText = JSON.stringify({
              optimized: true,
              strategyApplied: "Maximum Combo Preservation",
              calculatedMetrics: {
                suggestedSpeedLimit: 520,
                safeJumpToleranceMs: 240,
                recommendedAction: "Use active DASH/WARP state to seamlessly bypass consecutive wall lasers and maintain current x2.4 combo modifier"
              },
              timestamp: new Date().toISOString()
            }, null, 2);
            break;

          case "get_track_info":
            toolText = JSON.stringify({
              trackId: "track_neon_grid_05",
              theme: "Neo-Tokyo L2 Golden Grid",
              parameters: {
                baseSpeed: 400,
                escalationFactor: 1.05,
                seed: "0x159f27c68e8aa140541d3b54e6e207ca89ef142da1f5d7533a553461e80f78d3",
                obstacleSpawnIntervalMs: 1800,
                multiplierSpawnChance: 0.35,
                upcomingObstacles: [
                  { distance: 120, type: "SPIKE", actionRequired: "JUMP" },
                  { distance: 250, type: "WALL", actionRequired: "DASH" }
                ]
              },
              timestamp: new Date().toISOString()
            }, null, 2);
            break;

          default:
            toolText = `Executed ${toolName} successfully. No extra metadata payload was provided.`;
            break;
        }

        const result = {
          content: [{ type: "text", text: toolText }],
          isError: isError
        };
        const responsePayload = isJsonRpc ? { jsonrpc: "2.0", id, result } : result;
        return res.json(responsePayload);
      }

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

      res.json({
        status: "success",
        agent: "Endless Runner Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process MCP command"
      });
    }
  });

  // === Agent API ===
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Endless Runner Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Endless Runner",
      version: "1.0.0"
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
