import { EnquiryForm } from "./EnquiryForm";

export default function EnquiryPage() {
  return (
    <>
      <section className="pt-40 pb-24 bg-navy">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sand block mb-4">Trade Portal</span>
          <div className="w-10 h-0.5 bg-sand mb-6" />
          <h1 className="font-serif text-5xl text-white leading-tight max-w-xl">Quick Enquiry</h1>
          <p className="text-white/50 mt-4 max-w-md">We'll respond within 4 business hours.</p>
        </div>
      </section>

      <section className="bg-offwhite py-24">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
