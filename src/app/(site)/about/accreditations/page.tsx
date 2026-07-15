// import Container from "@/components/Container";
// import { Award, BadgeCheck, ShieldCheck } from "lucide-react";
// import Link from "next/link";

// const accreditations = [
//   {
//     icon: ShieldCheck,
//     title: "UAE Trade Licence",
//     desc: "Fully licensed catering and event equipment supplier operating across Dubai and Ras Al Khaimah.",
//   },
//   {
//     icon: BadgeCheck,
//     title: "Food-Grade Equipment",
//     desc: "Catering inventory supplied to hospitality standards suitable for hotels, venues, and corporate events.",
//   },
//   {
//     icon: Award,
//     title: "Trusted Supplier",
//     desc: "Two decades of service to hotels, caterers, event companies, and corporate clients across the UAE.",
//   },
// ];

// export default function AccreditationsPage() {
//   return (
//     <>
//       <section className="relative overflow-hidden bg-white pt-32 pb-16 md:pt-40 md:pb-20">
//         <Container className="relative z-10">
//           <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
//             About Catertech
//           </p>
//           <h1 className="mt-4 max-w-3xl text-[2.35rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3.1rem]">
//             Accreditations &amp; credentials
//           </h1>
//           <p className="mt-5 max-w-2xl text-base leading-relaxed text-body-muted md:text-lg">
//             Catertech maintains the standards expected by UAE hospitality teams, event planners,
//             and corporate procurement departments.
//           </p>
//         </Container>
//       </section>

//       <section className="bg-surface pb-24">
//         <Container>
//           <div className="grid gap-6 md:grid-cols-3">
//             {accreditations.map(({ icon: Icon, title, desc }) => (
//               <article
//                 key={title}
//                 className="rounded-2xl border border-border bg-white p-6 shadow-sm"
//               >
//                 <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-soft text-primary">
//                   <Icon className="size-5" strokeWidth={1.75} />
//                 </span>
//                 <h2 className="mt-5 text-lg font-semibold text-ink">{title}</h2>
//                 <p className="mt-3 text-sm leading-relaxed text-body-muted">{desc}</p>
//               </article>
//             ))}
//           </div>

//           <div className="mt-12 flex flex-wrap gap-4">
//             <Link
//               href="/about"
//               className="btn-brand inline-flex rounded-xl px-5 py-3 text-sm font-semibold uppercase tracking-widest"
//             >
//               About Catertech
//             </Link>
//             <Link
//               href="/contact"
//               className="inline-flex rounded-xl border border-border px-5 py-3 text-sm font-semibold uppercase tracking-widest text-ink transition hover:border-primary hover:text-primary"
//             >
//               Contact us
//             </Link>
//           </div>
//         </Container>
//       </section>
//     </>
//   );
// }
