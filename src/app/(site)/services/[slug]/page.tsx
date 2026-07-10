import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, SERVICES_LIST } from "@/lib/services";
import ServiceDetailClient from "@/components/sections/ServiceDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return SERVICES_LIST.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service | Catertech" };
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
  };
}

export default async function ServiceDetailPage({ params, searchParams }: Props) {
  const [{ slug }] = await Promise.all([params, searchParams]);
  const service = getServiceBySlug(slug);
  if (!service || service.comingSoon) notFound();
  return <ServiceDetailClient service={service} />;
}
