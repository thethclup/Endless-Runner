import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

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
    description: "Retrieve the current on-chain endless runner leaderboard.",
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

  // === MCP API ===
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
      const { action, command, params, method } = body;

      let result: any = {};

      if (method === "initialize") {
        return res.json({
          protocolVersion: "2024-11-05",
          capabilities: { tools: {}, prompts: {}, resources: {} },
          serverInfo: { name: "Endless Runner Orchestrator", version: "1.0.0" }
        });
      }

      if (method === "tools/list" || action === "tools/list") {
        return res.json({ tools: TOOLS });
      }

      if (method === "prompts/list" || action === "prompts/list") {
        return res.json({ prompts: [] });
      }

      if (method === "resources/list" || action === "resources/list") {
        return res.json({ resources: [] });
      }

      if (method === "tools/call" || action === "tools/call") {
        const toolName = body.params?.name || params?.name || command;
        return res.json({
          content: [{ type: "text", text: `Executed ${toolName} successfully.` }],
          isError: false
        });
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
