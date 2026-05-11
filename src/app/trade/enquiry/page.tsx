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
          <form className="space-y-6 bg-white border border-border p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">Company Name *</label>
                <input required type="text" className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">Contact Person *</label>
                <input required type="text" className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">Phone *</label>
                <input required type="tel" className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">Email *</label>
                <input required type="email" className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">Emirate</label>
                <select className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors bg-white">
                  <option value="">Select Emirate</option>
                  {["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah", "Ajman", "Fujairah", "Umm Al Quwain"].map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">Service Interest</label>
                <select className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors bg-white">
                  <option value="">Select Service</option>
                  {["Catering Equipment", "Event Equipment Rental", "Kitchen Equipment", "Event Management", "All Services"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">Message *</label>
              <textarea required rows={5} className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-sand transition-colors resize-none" placeholder="Describe your requirements..." />
            </div>
            <div>
              <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">Attach File (optional)</label>
              <input type="file" className="w-full border border-border px-4 py-3 text-sm text-muted file:mr-4 file:py-1 file:px-4 file:border-0 file:bg-cream file:text-xs file:font-medium file:tracking-wider" />
            </div>
            <button type="submit" className="w-full bg-sand hover:bg-sand-dark text-white text-xs font-semibold tracking-widest uppercase py-4 transition-colors">
              Submit Enquiry
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
