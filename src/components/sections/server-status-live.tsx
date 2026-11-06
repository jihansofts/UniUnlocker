"use client";

import { CircleAlert, CircleCheck, Server, ShieldCheck, TriangleAlert, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/sections/section-heading";
import { RelativeTime } from "@/components/ui/relative-time";
import { SafeImage } from "@/components/ui/safe-image";
import { computeOverallStatus, OVERALL_META, STATUS_META } from "@/lib/server-status";
import type { OverallStatus, ServerDTO } from "@/types";

const POLL_MS = 20_000;

const OVERALL_VISUAL: Record<OverallStatus, { icon: typeof CircleCheck; color: string; glow: string }> = {
  operational: { icon: CircleCheck, color: "text-status-online", glow: "var(--status-online)" },
  partial_outage: { icon: TriangleAlert, color: "text-status-offline", glow: "var(--status-offline)" },
  major_outage: { icon: CircleAlert, color: "text-status-offline", glow: "var(--status-offline)" },
  under_maintenance: { icon: Wrench, color: "text-status-maintenance", glow: "var(--status-maintenance)" },
  unknown: { icon: Server, color: "text-muted", glow: "var(--muted)" },
};

/** Shows the latest statuses, refreshing in the background while the tab is visible. */
export function ServerStatusLive({ initialServers }: { initialServers: ServerDTO[] | null }) {
  const [servers, setServers] = useState(initialServers);
  const [unreachable, setUnreachable] = useState(initialServers === null);

  useEffect(() => {
    let cancelled = false;

    const refresh = () => {
      if (document.hidden) return;
      fetch("/api/servers", { cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error(`Status ${response.status}`);
          return response.json() as Promise<{ servers: ServerDTO[] }>;
        })
        .then((body) => {
          if (cancelled) return;
          setServers(body.servers);
          setUnreachable(false);
        })
        .catch(() => {
          if (!cancelled) setUnreachable(true);
        });
    };

    const timer = setInterval(refresh, POLL_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const overall = servers ? computeOverallStatus(servers) : "unknown";
  const meta = OVERALL_META[overall];
  const visual = OVERALL_VISUAL[overall];
  const OverallIcon = visual.icon;

  return (
    <div className="neon-card overflow-hidden p-5 sm:p-8">
      <SectionHeading highlight="Status" lead="Server" subtitle={meta.message} />

      <div className="mt-8 grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
        <div aria-hidden className="relative mx-auto hidden size-40 items-center justify-center lg:flex">
          <div className="flex w-32 flex-col gap-2">
            {[0, 1, 2, 3].map((rack) => (
              <span
                key={rack}
                className="flex h-7 items-center gap-1.5 rounded-md border border-cyan/70 bg-linear-to-r from-surface-raised to-primary/50 px-2 shadow-[0_0_14px_rgb(8_123_255/0.7)]"
              >
                <span className="size-1.5 rounded-full bg-cyan shadow-[0_0_6px_var(--cyan)]" />
                <span className="size-1.5 rounded-full bg-status-online" />
                <span className="ml-auto h-1 w-10 rounded-full bg-cyan/50" />
              </span>
            ))}
          </div>
          <ShieldCheck className="absolute -right-2 -bottom-1 size-16 fill-background text-status-online drop-shadow-[0_0_12px_rgb(43_234_92/0.8)]" />
        </div>

        {servers && servers.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {servers.map((server, index) => {
              const status = STATUS_META[server.status];
              return (
                <li key={server.id} className={`flex flex-col items-center gap-2.5 rounded-xl border bg-background/50 p-4 text-center ${status.border}`}>
                  <h3 className="text-sm font-semibold">
                    {index + 1}. {server.name}
                  </h3>
                  <SafeImage src={server.logo} alt="" width={48} height={48} className="size-12 rounded-lg object-contain" />
                  <p className={`flex items-center gap-2 font-semibold ${status.text}`}>
                    <span aria-hidden className={`animate-pulse-dot size-3 rounded-full ${status.dot}`} />
                    {status.label}
                  </p>
                  <p className="text-xs text-muted">
                    Updated <RelativeTime iso={server.statusUpdatedAt} />
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-8 text-center text-muted">
            {servers ? "No servers are listed right now." : "Live status is temporarily unavailable."}
          </p>
        )}

        <div className="flex flex-col items-center gap-3 border-line/40 text-center lg:border-l lg:pl-8">
          <span
            className={`flex size-24 items-center justify-center rounded-full border-2 border-current ${visual.color}`}
            style={{ boxShadow: `0 0 26px ${visual.glow}, inset 0 0 18px ${visual.glow}` }}
          >
            <OverallIcon aria-hidden className="size-12" />
          </span>
          <div role="status">
            <p className="text-sm font-semibold">Server Status</p>
            <p className={`font-display text-lg font-bold ${visual.color}`}>{meta.label}</p>
          </div>
        </div>
      </div>

      {unreachable && servers && (
        <p role="alert" className="mt-5 text-center text-sm text-status-maintenance">
          Could not refresh just now, so this may be out of date.
        </p>
      )}
    </div>
  );
}
