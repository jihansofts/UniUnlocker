import { FolderOpen } from "lucide-react";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { SectionHeading } from "@/components/sections/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/reveal";
import { getPublishedProjects } from "@/lib/data";

export async function PortfolioSection() {
  const projects = await getPublishedProjects();
  return (
    <section id="portfolio" className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <Reveal>
        <SectionHeading lead="My" highlight="Projects" subtitle="Some of my recent work" />
      </Reveal>
      {projects.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={FolderOpen} title="Projects coming soon" message="New work will be published here shortly." />
        </div>
      ) : (
        <PortfolioGrid projects={projects} />
      )}
    </section>
  );
}
