import Container from "@/components/Container";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/40 bg-white">
      <Container className="relative z-10 py-24 md:py-32 lg:py-36">
        <div className="mb-12 max-w-2xl">
          <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-muted">
            Client testimonials
          </p>
          <h2 className="mt-4 font-display text-3xl leading-[1.12] tracking-[-0.02em] text-ink md:text-[2rem] xl:text-[2.25rem]">
            Stories from the teams we support
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-body-muted md:text-[0.9375rem]">
            Venues and operators across Dubai and the Northern Emirates share how
            Catertech shows up on site—from enquiry to delivery and event day.
          </p>
        </div>

        <StaggerTestimonials />
      </Container>
    </section>
  );
}
