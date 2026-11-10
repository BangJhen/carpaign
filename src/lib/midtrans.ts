import { createHash, timingSafeEqual } from "node:crypto";

export type MidtransStatus = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  transaction_status: string;
  fraud_status?: string;
  signature_key?: string;
};

export function midtransConfigured() {
  return Boolean(process.env.MIDTRANS_SERVER_KEY);
}

function serverKey() {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) throw new Error("Kunci server Midtrans belum diatur.");
  return key;
}

function baseUrls() {
  const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
  return {
    snap: production ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com",
    api: production ? "https://api.midtrans.com" : "https://api.sandbox.midtrans.com",
  };
}

function authorization() {
  return `Basic ${Buffer.from(`${serverKey()}:`).toString("base64")}`;
}

export function validMidtransSignature(payload: MidtransStatus) {
  if (!payload.order_id || !payload.status_code || !payload.gross_amount || !payload.signature_key) return false;
  const expected = createHash("sha512")
    .update(payload.order_id + payload.status_code + payload.gross_amount + serverKey())
    .digest("hex");
  const actual = payload.signature_key.toLowerCase();
  if (!/^[a-f0-9]{128}$/.test(actual)) return false;
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex"));
}

export async function createSnapTransaction(orderId: string, amount: number, campaignTitle: string) {
  const response = await fetch(`${baseUrls().snap}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": authorization(),
    },
    body: JSON.stringify({
      transaction_details: { order_id: orderId, gross_amount: amount },
      item_details: [{ id: "campaign-budget", price: amount, quantity: 1, name: campaignTitle.slice(0, 50) }],
    }),
    cache: "no-store",
  });
  const result: unknown = await response.json();
  if (!response.ok || !result || typeof result !== "object" || !("redirect_url" in result) ||
      typeof result.redirect_url !== "string") {
    throw new Error("Midtrans belum dapat membuat halaman pembayaran.");
  }
  const redirectUrl = result.redirect_url;
  const expectedHost = new URL(baseUrls().snap).hostname;
  if (new URL(redirectUrl).hostname !== expectedHost) throw new Error("Alamat pembayaran Midtrans tidak valid.");
  return redirectUrl;
}

export async function getMidtransStatus(orderId: string): Promise<MidtransStatus> {
  const response = await fetch(`${baseUrls().api}/v2/${encodeURIComponent(orderId)}/status`, {
    headers: { "Accept": "application/json", "Authorization": authorization() },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Status pembayaran belum dapat diverifikasi ke Midtrans.");
  const result: unknown = await response.json();
  if (!result || typeof result !== "object" || !("order_id" in result)) {
    throw new Error("Respons status Midtrans tidak valid.");
  }
  return result as MidtransStatus;
}
