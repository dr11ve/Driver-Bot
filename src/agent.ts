import WebSocket from "ws";
import { CONFIG } from "./config";
import { log } from "./utils/logger";
import { buildOrder, signOrder } from "./utils/order";
import { RecallSDK } from "@recallnet/sdk";

let lastTradeTs = 0;

// Initialise Recall SDK – handles authentication and on‑chain submission.
const recall = new RecallSDK({
  apiKey: CONFIG.RECALL_API_KEY,
  rpcUrl: CONFIG.RPC_ENDPOINT
});

const ws = new WebSocket(CONFIG.WS_ENDPOINT);

ws.on("open", () => log("WebSocket connected to market feed"));
ws.on("message", async (data) => {
  const trade = JSON.parse(data.toString());
  const price = parseFloat(trade.p); // Binance trade price field

  // Simple strategy: buy when price drops >1% within the last minute,
  // sell when price rises >1% within the last minute.
  // Replace with a more sophisticated model as needed.
  const now = Date.now();

  // Rate‑limit trades
  if (now - lastTradeTs < CONFIG.MIN_TRADE_INTERVAL_MS) return;

  // Placeholder for price‑change detection – you would keep a rolling window.
  // Here we use a dummy `prevPrice` field for illustration.
  const prevPrice = trade.prevPrice ? parseFloat(trade.prevPrice) : price;
  const priceChange = (price - prevPrice) / prevPrice;

  if (priceChange <= -0.01) {
    // BUY signal
    const order = buildOrder("buy", price, CONFIG.MAX_TRADE_SIZE_USD);
    const signed = signOrder(order);
    await recall.submitAction(signed);
    log(`🟢 BUY ${CONFIG.SYMBOL} @ $${price.toFixed(2)}`);
    lastTradeTs = now;
  } else if (priceChange >= 0.01) {
    // SELL signal
    const order = buildOrder("sell", price, CONFIG.MAX_TRADE_SIZE_USD);
    const signed = signOrder(order);
    await recall.submitAction(signed);
    log(`🔴 SELL ${CONFIG.SYMBOL} @ $${price.toFixed(2)}`);
    lastTradeTs = now;
  }
});

ws.on("error", (err) => log("WebSocket error:", err));
ws.on("close", () => log("WebSocket closed – reconnecting in 5 s"));
