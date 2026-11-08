import { Handshake } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/reveal";
import { SafeImage } from "@/components/ui/safe-image";
import type { PartnerDTO } from "@/types";

export const PARTNER_COLUMNS = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";

function PartnerCard({ partner }: { partner: PartnerDTO }) {
  const content = (
    <>
      <span className="flex h-16 w-full items-center justify-center">
        <SafeImage
          src={partner.logo}
          alt={partner.url ? "" : partner.name}
          width={160}
          height={64}
          className="max-h-16 w-auto object-contain transition duration-300 group-hover:scale-105"
        />
      </span>
      <span className="text-sm font-medium text-muted transition group-hover:text-cyan">{partner.name}</span>
    </>
  );
  const cardClass = "neon-card group flex h-full flex-col items-center justify-center gap-3 p-5 text-center";
  return partner.url ? (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${partner.name} (opens in a new tab)`}
      className={`${cardClass} neon-card-hover`}
    >
      {content}
    </a>
  ) : (
    <div className={cardClass}>{content}</div>
  );
}

export function PartnerGrid({ partners }: { partners: PartnerDTO[] }) {
  if (partners.length === 0) {
    return <EmptyState icon={Handshake} title="Partners coming soon" message="Our trusted partners will be listed here shortly." />;
  }
  return (
    <ul className={`grid gap-4 ${PARTNER_COLUMNS}`}>
      {partners.map((partner, index) => (
        <li key={partner.id}>
          <Reveal delay={index * 0.05} className="h-full">
            <PartnerCard partner={partner} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
