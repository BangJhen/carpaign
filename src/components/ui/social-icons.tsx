"use client";

import React from "react";

export function InstagramIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function TikTokIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.068-.102a2.895 2.895 0 0 1 2.373-4.538c.307 0 .604.048.882.138V9.32a6.34 6.34 0 0 0-.882-.062C6.012 9.258 3.2 12.07 3.2 15.535c0 3.466 2.812 6.277 6.277 6.277 3.466 0 6.277-2.811 6.277-6.277V8.83a8.23 8.23 0 0 0 4.835 1.542V6.927a4.833 4.833 0 0 1-1-.241z" />
    </svg>
  );
}

export function YouTubeIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function SocialIcon({
  platform,
  className = "size-3.5",
}: {
  platform: string;
  className?: string;
}) {
  const norm = platform.toLowerCase();
  if (norm.includes("tiktok")) {
    return <TikTokIcon className={className} />;
  }
  if (norm.includes("instagram") || norm.includes("reels")) {
    return <InstagramIcon className={className} />;
  }
  if (norm.includes("youtube") || norm.includes("shorts")) {
    return <YouTubeIcon className={className} />;
  }
  return null;
}
