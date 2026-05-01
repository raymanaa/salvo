import { notFound } from "next/navigation";
import { IncidentReader } from "@/components/incident-reader";
import { INCIDENTS, getIncident } from "@/lib/incidents";

export function generateStaticParams() {
  return INCIDENTS.map((i) => ({ incidentId: i.slug }));
}

export const dynamicParams = false;

export default async function IncidentPage({
  params,
}: {
  params: Promise<{ incidentId: string }>;
}) {
  const { incidentId } = await params;
  const inc = getIncident(incidentId);
  if (!inc) notFound();
  return <IncidentReader incident={inc} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ incidentId: string }>;
}) {
  const { incidentId } = await params;
  const inc = getIncident(incidentId);
  if (!inc) return { title: "Incident · Salvo" };
  return {
    title: `${inc.id.toUpperCase()} — ${inc.title} · Salvo`,
    description: inc.summary,
  };
}
