/**
 * Reference usage for the avatar primitive. Not rendered in production —
 * the live integration is `components/site/system-assistant.tsx`, which uses
 * the avatar as the chat launcher and as the talking header/typing indicator.
 */
"use client";

import Avatar from "@/components/ui/components-primitives-avatar";

export default function Demo() {
  return (
    <div className="flex items-center justify-center gap-4">
      <Avatar />
      <Avatar color="lime" size="sm" shape="squircle" />
      <Avatar color="lime" size="md" shape="squircle" talking />
      <Avatar color="lime" size="lg" shape="circle" blinking={false} />
    </div>
  );
}
