import { ViewAllFooter } from "@/components/listing/view-all-link";
import { PartnerGrid } from "@/components/sections/partner-grid";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { getEnabledPartners } from "@/lib/data";
import { HOME_LIMITS } from "@/lib/listing-config";

export async function PartnersSection() {
  const partners = await getEnabledPartners();
  const shown = partners.slice(0, HOME_LIMITS.partners);
  return (
    <section id="partners" className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <Reveal>
        <SectionHeading lead="Our Trusted" highlight="Partners" subtitle="Brands and services we proudly work with" />
      </Reveal>
      <div className="mt-10">
        <PartnerGrid partners={shown} />
      </div>
      <ViewAllFooter href="/partners" shown={shown.length} total={partners.length} />
    </section>
  );
}
