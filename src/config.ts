import * as dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  // ── Recall network credentials ────────────────────────────────────────
  RECALL_API_KEY: process.env.RECALL_API_KEY ?? "", // generated in Recall UI → Settings → API Keys
  RECALL_AGENT_ID: process.env.RECALL_AGENT_ID ?? "",

  // ── Market‑data feed (example: Binance) ───────────────────────────────
  WS_ENDPOINT: "wss://stream.binance.com:9443/ws/btcusdt@trade",
  SYMBOL: "BTC/USDT",

  // ── Trading parameters ────────────────────────────────────────────────
  MAX_TRADE_SIZE_USD: 500,          // max USD per trade
  STOP_LOSS_PCT: 0.02,              // 2 % stop‑loss
  TAKE_PROFIT_PCT: 0.04,            // 4 % take‑profit
  MIN_TRADE_INTERVAL_MS: 30_000,   // minimum time between trades

  // ── On‑chain signing (EVM) ─────────────────────────────────────────────
  PRIVATE_KEY: process.env.PRIVATE_KEY ?? "", // store in GitHub Secrets, never commit
  RPC_ENDPOINT: "https://rpc.recall.network"
};
