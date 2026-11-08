import { Handshake } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/reveal";
import { SafeImage } from "@/components/ui/safe-image";
import { getEnabledPartners } from "@/lib/data";

export async function PartnersSection() {
  const partners = await getEnabledPartners();
  return (
    <section id="partners" className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <Reveal>
        <SectionHeading lead="Our Trusted" highlight="Partners" subtitle="Brands and services we proudly work with" />
      </Reveal>
      {partners.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={Handshake} title="Partners coming soon" message="Our trusted partners will be listed here shortly." />
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((partner, index) => {
            const card = (
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
            return (
              <li key={partner.id}>
                <Reveal delay={index * 0.05} className="h-full">
                  {partner.url ? (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${partner.name} (opens in a new tab)`}
                      className={`${cardClass} neon-card-hover`}
                    >
                      {card}
                    </a>
                  ) : (
                    <div className={cardClass}>{card}</div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
