import { IncidentsIndex } from "@/components/incidents-index";
import { INCIDENTS } from "@/lib/incidents";

export default function AppHome() {
  return <IncidentsIndex incidents={INCIDENTS} />;
}
