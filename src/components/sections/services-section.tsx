import { Wrench } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/reveal";
import { getEnabledServices } from "@/lib/data";
import { getServiceIcon } from "@/lib/service-icons";

export async function ServicesSection() {
  const services = await getEnabledServices();
  return (
    <section id="services" className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <Reveal>
        <SectionHeading
          lead="My"
          highlight="Services"
          subtitle="Professional services for all your mobile software needs"
        />
      </Reveal>
      {services.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={Wrench} title="Services coming soon" message="Service details will be listed here shortly." />
        </div>
      ) : (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((service, index) => {
            const Icon = getServiceIcon(service.icon);
            return (
              <li key={service.id}>
                <Reveal delay={index * 0.06} className="h-full">
                  <article className="neon-card neon-card-hover flex h-full flex-col items-center gap-3 p-6 text-center">
                    <Icon aria-hidden className="size-12 text-cyan drop-shadow-[0_0_10px_rgb(0_229_255/0.7)]" />
                    <h3 className="font-display text-lg leading-snug font-semibold">{service.title}</h3>
                    {service.description && <p className="text-sm text-muted">{service.description}</p>}
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
