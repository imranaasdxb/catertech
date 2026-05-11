import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, SERVICES_LIST } from "@/lib/services";
import ServiceDetailClient from "@/components/sections/ServiceDetailClient";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES_LIST.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service | Catertech" };
  return {
    title: `${service.title} | Catertech`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  return <ServiceDetailClient service={service} />;
}
