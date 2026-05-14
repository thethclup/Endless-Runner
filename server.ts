import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

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
      capabilities: [
        "endless-running",
        "obstacle-management",
        "score-optimization",
        "continuous-automation"
      ],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body || {};
      const { action, command, params } = body;

      let result: any = {};

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
