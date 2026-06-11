import Container from "@/components/Container";
import TestimonialsMarquee from "@/components/ui/testimonials-marquee";

export default function TestimonialsSection() {
  return (
    <section className="overflow-hidden border-t border-border/40 bg-bg-warm py-16 md:py-20">
      <Container>
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <div className="mb-3 inline-block rounded-full border border-border bg-white px-4 py-1">
            <span className="text-xs font-medium text-body-muted">
              Loved by clients
            </span>
          </div>
          <h2 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl lg:text-5xl">
            What people are saying
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-body-muted md:text-base">
            Real feedback from hospitality teams, event operators and venues
            building memorable experiences across the UAE with Catertech.
          </p>
        </div>

        <TestimonialsMarquee />
      </Container>
    </section>
  );
}
