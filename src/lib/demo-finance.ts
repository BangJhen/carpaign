export function isDemoFinanceEnabled() {
  return process.env.NODE_ENV === "development" || process.env.CARPAIGN_DEMO_FINANCE === "true";
}

export function campaignTotalWithFee(budget: number) {
  return budget + Math.round(budget * 0.1);
}
