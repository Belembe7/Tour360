import {
  DESTINATION_CATALOG_SECTIONS,
  DESTINATION_SECTION_LABELS,
  getCatalogSection,
  type DestinationCatalogItem,
  type DestinationCatalogSectionId,
} from "@/lib/destinations/catalog";

export type { DestinationCatalogSectionId };

/** Cidades de partida em Mocambique (mantidas no formulario). */
export const MOZAMBIQUE_ORIGIN_CITIES = [
  "Beira",
  "Maputo",
  "Nampula",
  "Lichinga",
  "Vilankulo",
  "Inhambane",
  "Pemba",
  "Xai-Xai",
] as const;

const INTERNATIONAL_SECTIONS: DestinationCatalogSectionId[] = ["africa", "europa", "americas", "asia"];

/** Pacote por defeito para abrir o formulario de reserva a partir do catalogo. */
export function defaultPackageSlugForSection(sectionId: DestinationCatalogSectionId): string {
  if (sectionId === "nacional") return "hinkwero";
  return "basico-internacional";
}

export function isCatalogSectionId(value: string | null | undefined): value is DestinationCatalogSectionId {
  return (
    value === "nacional" ||
    value === "africa" ||
    value === "europa" ||
    value === "americas" ||
    value === "asia"
  );
}

/** Destinos do catalogo para o selector «Destino» consoante o tipo de pacote / seccao. */
export function getCatalogDestinationCities(
  packageType: "nacional" | "internacional",
  catalogSection?: DestinationCatalogSectionId | null,
): string[] {
  if (packageType === "nacional") {
    return getCatalogSection("nacional").items.map((i) => i.name);
  }
  if (catalogSection && catalogSection !== "nacional") {
    return getCatalogSection(catalogSection).items.map((i) => i.name);
  }
  const names = INTERNATIONAL_SECTIONS.flatMap((id) => getCatalogSection(id).items.map((i) => i.name));
  return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, "pt"));
}

export function getCatalogItem(
  sectionId: DestinationCatalogSectionId,
  destinationName: string,
): DestinationCatalogItem | undefined {
  const normalized = destinationName.trim();
  return getCatalogSection(sectionId).items.find((i) => i.name === normalized);
}

export function buildCatalogReservationHref(
  sectionId: DestinationCatalogSectionId,
  destinationName: string,
): string {
  const params = new URLSearchParams({
    destino: destinationName,
    secao: sectionId,
  });
  return `/pacotes/reservar?${params.toString()}`;
}

export function catalogSectionLabel(sectionId: DestinationCatalogSectionId): string {
  return DESTINATION_SECTION_LABELS[sectionId];
}

export function allCatalogSections() {
  return DESTINATION_CATALOG_SECTIONS;
}
