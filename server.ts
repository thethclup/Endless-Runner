import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { BUILDER_CODE, declareBuilderCodeExtension } from "@x402/extensions/builder-code";

const TOOLS = [
  { name: "get_race_status", description: "Get the current endless runner race status and metrics.", inputSchema: { type: "object", properties: {} } },
  { name: "start_race", description: "Initialize and start a new endless runner race sequence.", inputSchema: { type: "object", properties: {} } },
  { name: "get_leaderboard", description: "Retrieve the current onchain endless runner leaderboard.", inputSchema: { type: "object", properties: {} } },
  { name: "optimize_speed", description: "Calculate and apply speed optimizations for the runner.", inputSchema: { type: "object", properties: {} } },
  { name: "get_track_info", description: "Retrieve procedural generation details for the current track.", inputSchema: { type: "object", properties: {} } }
];

async function startServer() {
  const app = express();
  app.use(express.json());

  // === X402 + MCP Setup ===
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
              payTo: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
            },
          ],
          description: "Endless Runner MCP AI Agent Tools",
          mimeType: "application/json",
          extensions: {
            [BUILDER_CODE]: declareBuilderCodeExtension("bc_1aw46v36"),
          },
        },
      },
      resourceServer
    )
  );

  // MCP GET - Tools List
  app.get("/api/mcp", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Endless Runner MCP Endpoint",
      status: "active",
      description: "Active MCP server for Endless Runner Orchestrator Agent",
      capabilities: { tools: true, prompts: true, resources: true },
      tools: TOOLS,
      prompts: [],
      resources: [],
      timestamp: new Date().toISOString()
    });
  });

  // MCP POST - Tool Calls
  app.post("/api/mcp", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
      const body = req.body || {};
      const { method, action, command, params, id, jsonrpc } = body;
      const isJsonRpc = jsonrpc === "2.0";

      const toolName = body.params?.name || params?.name || command;
      let toolText = "";

      switch (toolName) {
        case "get_race_status":
          toolText = JSON.stringify({
            status: "PLAYING",
            player: { x: 100, y: 412.5, state: "RUN", vy: 0 },
            metrics: { distance: 348.5, score: 1420.2, combo: 2.4, speed: 480, multiplierActive: true },
            environment: { epoch: 240, activeTheme: "Base L2 Golden Grid", gasPriceGwei: 0.012, blockNumber: 18290382, orchestratorWallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6" }
          }, null, 2);
          break;

        case "start_race":
          toolText = JSON.stringify({
            success: true,
            message: "Runner initialized and launched at Base speed profile.",
            raceId: "race_" + Math.random().toString(36).substring(2, 11),
            initialState: { distance: 0, score: 0, combo: 1.0, speed: 400 },
            timestamp: new Date().toISOString()
          }, null, 2);
          break;

        case "get_leaderboard":
          toolText = JSON.stringify({
            leaderboard: [
              { rank: 1, address: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", score: 98520, distance: 14200, timestamp: "2026-06-11T12:00:00Z", verified: true },
              { rank: 2, address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045", score: 75200, distance: 10800, timestamp: "2026-06-12T01:15:00Z", verified: true },
            ],
            contract: { network: "Base Sepolia", chainId: 84532, resolverAddress: "0x019a3bc4d22da10ac73d8e53415d37aa96045330a" },
            timestamp: new Date().toISOString()
          }, null, 2);
          break;

        case "optimize_speed":
          toolText = JSON.stringify({
            optimized: true,
            strategyApplied: "Maximum Combo Preservation",
            calculatedMetrics: { suggestedSpeedLimit: 520, safeJumpToleranceMs: 240, recommendedAction: "Use active DASH/WARP state to seamlessly bypass consecutive wall lasers and maintain current x2.4 combo modifier" },
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
          toolText = `Executed ${toolName || method || action} successfully.`;
          break;
      }

      res.json({
        status: "success",
        response: { message: "Tool executed via x402 protected MCP", data: JSON.parse(toolText) }
      });
    } catch (error) {
      console.error("MCP Error:", error);
      res.status(500).json({ status: "error", message: "Internal MCP error" });
    }
  });

  // Vite + Static (production)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
