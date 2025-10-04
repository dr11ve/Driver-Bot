import { ethers } from "ethers";
import { CONFIG } from "../config";

/**
 * Build a simple limit‑order payload compatible with the Recall Agent Action schema.
 */
export const buildOrder = (
  side: "buy" | "sell",
  price: number,
  sizeUsd: number
) => {
  const sizeWei = ethers.parseUnits((sizeUsd / price).toString(), "ether"); // amount of base token
  const order = {
    agentId: CONFIG.RECALL_AGENT_ID,
    action: "trade",
    payload: {
      side,
      price: price.toString(),
      amount: sizeWei.toString(),
      tokenPair: CONFIG.SYMBOL
    },
    timestamp: Date.now()
  };
  return order;
};

/**
 * Sign the order with the agent's private key.
 */
export const signOrder = (order: any) => {
  const wallet = new ethers.Wallet(CONFIG.PRIVATE_KEY);
  const hash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(order)));
  const signature = wallet.signingKey.sign(hash);
  return {
    ...order,
    signature: ethers.Signature.from(signature).serialized
  };
};
