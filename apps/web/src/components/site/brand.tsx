import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({
  size = 40,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/h2h-mark.png"
      alt="Hair2Harvest"
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0 select-none", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function Wordmark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "paper";
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)} aria-label="Hair2Harvest">
      <BrandMark size={34} priority />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.0625rem] font-semibold tracking-[-0.035em]",
            tone === "ink" ? "text-ink" : "text-paper",
          )}
        >
          Hair2Harvest
        </span>
        <span
          className={cn(
            "mt-1 font-mono text-[0.5rem] uppercase tracking-[0.22em]",
            tone === "ink" ? "text-ink-mute" : "text-paper/50",
          )}
        >
          soil from barbers
        </span>
      </span>
    </div>
  );
}
