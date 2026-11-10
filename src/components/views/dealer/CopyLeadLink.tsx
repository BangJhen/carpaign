"use client";

import { useState } from "react";

export function CopyLeadLink({ campaignId }: { campaignId: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" onClick={async () => {
      await navigator.clipboard.writeText(`${window.location.origin}/go/${campaignId}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }} className="text-sm text-white underline underline-offset-4 hover:text-white/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
      {copied ? "Tautan tersalin" : "Salin tautan WhatsApp"}
    </button>
  );
}
