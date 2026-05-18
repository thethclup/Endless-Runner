# Endless Runner Orchestrator

Endless Runner platformunda çalışan ERC-8004 uyumlu AI Agent. Endless running mechanics, obstacle management, score optimization ve continuous automation yapan akıllı orchestrator.

## Overview

Endless Runner Dash is a cyberpunk-themed, Web3-enabled endless runner game natively integrated with Base network. The agent uses the standard Model Context Protocol (MCP) to supply external AI models with tools necessary for runner automation, real-time control, and execution on Base mainnet.

## Web3 Configuration & Links

- **Agent Wallet**: `0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6`
- **Supported Chains**: Base Mainnet (`eip155:8453`)
- **Agent standard**: ERC-8004 / Registration v1
- **Live Deployment URL**: [https://endless-runner-iota-pied.vercel.app](https://endless-runner-iota-pied.vercel.app)
- **A2A JSON**: [Base Endpoint](https://endless-runner-iota-pied.vercel.app/.well-known/agent-card.json)
- **MCP Endpoint**: [https://endless-runner-iota-pied.vercel.app/api/mcp](https://endless-runner-iota-pied.vercel.app/api/mcp)
- **API Endpoint**: [https://endless-runner-iota-pied.vercel.app/api/agent](https://endless-runner-iota-pied.vercel.app/api/agent)

## Tech Stack
- Frontend: Next.js 14 (App Router)
- Language: TypeScript
- Integrations: wagmi, viem, SIWE (Sign-In with Ethereum)
- Game Engine: Canvas 2D + Framer Motion
- UI Styling: TailwindCSS + HTML

## Key Agent Capabilities

The orchestrator utilizes the following capabilities:
- **endless-running**: Continuous running automation and trajectory precision.
- **obstacle-management**: Real-time AI detection and collision avoidance.
- **score-optimization**: Maximum combo preservation and energy orbs collection.
- **continuous-automation**: 24/7 autonomous runner strategies.
- **survival-strategy**: Multi-track management and ecosystem coordination.
- **real-time-control**: Precision timing mapping and immediate execution.
- **mcp-command-execution**: Direct Model Context Protocol support.

## Model Context Protocol (MCP)

This project fully supports the Model Context Protocol (MCP). External AI orchestration tools can communicate with this agent using the following tools:

- `get_race_status`: Get the current endless runner race status and metrics.
- `start_race`: Initialize and start a new endless runner race sequence.
- `get_leaderboard`: Retrieve the current on-chain endless runner leaderboard.
- `optimize_speed`: Calculate and apply speed optimizations for the runner.
- `get_track_info`: Retrieve procedural generation details for the current track.

When queried at `/api/mcp`, the system correctly implements:
- Handshake & `initialize` routes
- `tools/list`
- `tools/call`
- `prompts/list`
- `resources/list`

## Local Development

To run this project locally:

1. Clone the repository and install dependencies.
```bash
npm install
```

2. Start the Next.js development server.
```bash
npm run dev
```

The game and endpoints will be available at `http://localhost:3000`.
