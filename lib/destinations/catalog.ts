export type DestinationCatalogSectionId =
  | "nacional"
  | "africa"
  | "europa"
  | "americas"
  | "asia";

export type DestinationCatalogItem = {
  number: number;
  name: string;
  region: string;
  duration: string;
  hotel: string;
  meals: string;
  transport: string;
  priceFrom: number;
  imageSeed: string;
};

export type DestinationCatalogSection = {
  id: DestinationCatalogSectionId;
  title: string;
  subtitle: string;
  badge?: string;
  intro: string;
  items: DestinationCatalogItem[];
};

export const DESTINATION_CATALOG_SECTIONS: DestinationCatalogSection[] = [
  {
    id: "nacional",
    title: "Destinos nacionais",
    subtitle: "Mocambique",
    intro:
      "Descubra as maravilhas do nosso pais. Praias paradisiacas, cultura rica e experiencias inesqueciveis.",
    items: [
      { number: 1, name: "Praia do Tofo", region: "Inhambane", duration: "2 - 3 Dias", hotel: "Hotel 3/4 Estrelas", meals: "Pequeno-almoço", transport: "Transfer + Passeios", priceFrom: 29000, imageSeed: "tofo" },
      { number: 2, name: "Praia de Bilene", region: "Gaza", duration: "2 - 3 Dias", hotel: "Hotel 3/4 Estrelas", meals: "Pequeno-almoço", transport: "Transfer + Passeios", priceFrom: 26000, imageSeed: "bilene" },
      { number: 3, name: "Xai-Xai", region: "Gaza", duration: "2 - 3 Dias", hotel: "Hotel 3/4 Estrelas", meals: "Pequeno-almoço", transport: "Transfer + Passeios", priceFrom: 29000, imageSeed: "xaixai" },
      { number: 4, name: "Ponta do Ouro", region: "Maputo", duration: "2 - 3 Dias", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço", transport: "Transfer + Passeios", priceFrom: 31000, imageSeed: "ponta-ouro" },
      { number: 5, name: "Quilalea", region: "Zambezia", duration: "2 - 3 Dias", hotel: "Resort 4 Estrelas", meals: "Pequeno-almoço + Jantar", transport: "Transfer + Passeios", priceFrom: 27000, imageSeed: "quilalea" },
      { number: 6, name: "Morrungulo", region: "Nampula", duration: "3 Dias / 2 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço", transport: "Transfer + Passeios", priceFrom: 30000, imageSeed: "morrungulo" },
      { number: 7, name: "Vilankulo", region: "Inhambane", duration: "3 - 4 Dias", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Jantar", transport: "Transfer + Passeios", priceFrom: 39000, imageSeed: "vilankulo" },
      { number: 8, name: "Ilha de Mocambique", region: "Nampula", duration: "3 Dias / 2 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço", transport: "Transfer + City Tour", priceFrom: 36000, imageSeed: "ilha-mocambique" },
      { number: 9, name: "Pemba", region: "Cabo Delgado", duration: "4 Dias / 3 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Jantar", transport: "Transfer + Passeios", priceFrom: 42000, imageSeed: "pemba" },
      { number: 10, name: "Lago Niassa", region: "Niassa", duration: "4 Dias / 3 Noites", hotel: "Lodge 4 Estrelas", meals: "Pequeno-almoço + Jantar", transport: "Transfer + Passeios", priceFrom: 39000, imageSeed: "lago-niassa" },
      { number: 11, name: "Gorongosa", region: "Sofala", duration: "3 Dias / 2 Noites", hotel: "Lodge 4/5 Estrelas", meals: "Pequeno-almoço + Jantar", transport: "Transfer + Safari", priceFrom: 36000, imageSeed: "gorongosa" },
      { number: 12, name: "Chimoio e Serra", region: "Manica", duration: "3 Dias / 2 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço", transport: "Transfer + Passeios", priceFrom: 33000, imageSeed: "chimoio" },
    ],
  },
  {
    id: "africa",
    title: "Destinos Africa",
    subtitle: "Continente africano",
    intro:
      "Viva a diversidade, a cultura e a hospitalidade africana com conforto e assistencia dedicada.",
    items: [
      { number: 1, name: "Cidade do Cabo", region: "Africa do Sul", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Jantar", transport: "Transfer + City Tour", priceFrom: 162000, imageSeed: "cape-town" },
      { number: 2, name: "Joanesburgo", region: "Africa do Sul", duration: "4 Dias / 3 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 155000, imageSeed: "johannesburg" },
      { number: 3, name: "Nairobi", region: "Quenia", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Safari", transport: "Transfer + Safari", priceFrom: 168000, imageSeed: "nairobi" },
      { number: 4, name: "Zanzibar", region: "Tanzania", duration: "6 Dias / 5 Noites", hotel: "Resort 4/5 Estrelas", meals: "Pequeno-almoço + Jantar", transport: "Transfer + Passeios", priceFrom: 175000, imageSeed: "zanzibar" },
      { number: 5, name: "Victoria Falls", region: "Zimbabue / Zambia", duration: "4 Dias / 3 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 158000, imageSeed: "victoria-falls" },
      { number: 6, name: "Mauricio", region: "Ilhas do Indico", duration: "7 Dias / 6 Noites", hotel: "Resort 5 Estrelas", meals: "Pequeno-almoço + Jantar", transport: "Transfer + Passeios", priceFrom: 198000, imageSeed: "mauritius" },
      { number: 7, name: "Marrakech", region: "Marrocos", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 172000, imageSeed: "marrakech" },
      { number: 8, name: "Cairo", region: "Egipto", duration: "6 Dias / 5 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Guia", priceFrom: 185000, imageSeed: "cairo" },
      { number: 9, name: "Dakar", region: "Senegal", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 165000, imageSeed: "dakar" },
      { number: 10, name: "Windhoek e Deserto", region: "Namibia", duration: "6 Dias / 5 Noites", hotel: "Lodge 4 Estrelas", meals: "Pequeno-almoço + Jantar", transport: "Transfer + Safari", priceFrom: 188000, imageSeed: "namibia" },
      { number: 11, name: "Kigali", region: "Ruanda", duration: "4 Dias / 3 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 160000, imageSeed: "kigali" },
      { number: 12, name: "Accra", region: "Gana", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 170000, imageSeed: "accra" },
    ],
  },
  {
    id: "europa",
    title: "Destinos internacionais",
    subtitle: "Premium · Europa",
    badge: "PREMIUM",
    intro:
      "Explore a Europa com conforto, exclusividade e experiencias inesqueciveis. Os melhores destinos e servicos.",
    items: [
      { number: 13, name: "Paris", region: "Franca", duration: "6 Dias / 5 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 198000, imageSeed: "paris" },
      { number: 14, name: "Roma", region: "Italia", duration: "6 Dias / 5 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 195000, imageSeed: "rome" },
      { number: 15, name: "Londres", region: "Reino Unido", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 205000, imageSeed: "london" },
      { number: 16, name: "Madrid", region: "Espanha", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 192000, imageSeed: "madrid" },
      { number: 17, name: "Barcelona", region: "Espanha", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 190000, imageSeed: "barcelona" },
      { number: 18, name: "Amsterdao", region: "Paises Baixos", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 188000, imageSeed: "amsterdam" },
      { number: 19, name: "Praga", region: "Republica Checa", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 178000, imageSeed: "prague" },
      { number: 20, name: "Viena", region: "Austria", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 186000, imageSeed: "vienna" },
      { number: 21, name: "Budapeste", region: "Hungria", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 175000, imageSeed: "budapest" },
      { number: 22, name: "Atenas", region: "Grecia", duration: "6 Dias / 5 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 182000, imageSeed: "athens" },
      { number: 23, name: "Veneza", region: "Italia", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 194000, imageSeed: "venice" },
      { number: 24, name: "Berlim", region: "Alemanha", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 180000, imageSeed: "berlin" },
      { number: 25, name: "Lisboa", region: "Portugal", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 182000, imageSeed: "lisbon" },
      { number: 26, name: "Porto", region: "Portugal", duration: "4 Dias / 3 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 168000, imageSeed: "porto" },
      { number: 27, name: "Dublin", region: "Irlanda", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 188000, imageSeed: "dublin" },
      { number: 28, name: "Edimburgo", region: "Escocia", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 185000, imageSeed: "edinburgh" },
      { number: 29, name: "Copenhaga", region: "Dinamarca", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 192000, imageSeed: "copenhagen" },
      { number: 30, name: "Estocolmo", region: "Suecia", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 195000, imageSeed: "stockholm" },
      { number: 31, name: "Oslo", region: "Noruega", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 210000, imageSeed: "oslo" },
      { number: 32, name: "Helsinki", region: "Finlandia", duration: "4 Dias / 3 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 178000, imageSeed: "helsinki" },
      { number: 33, name: "Bruxelas", region: "Belgica", duration: "4 Dias / 3 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 172000, imageSeed: "brussels" },
      { number: 34, name: "Zurique", region: "Suica", duration: "5 Dias / 4 Noites", hotel: "Hotel 5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 225000, imageSeed: "zurich" },
      { number: 35, name: "Genebra", region: "Suica", duration: "4 Dias / 3 Noites", hotel: "Hotel 5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 218000, imageSeed: "geneva" },
      { number: 36, name: "Florenca", region: "Italia", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 190000, imageSeed: "florence" },
    ],
  },
  {
    id: "americas",
    title: "Destinos internacionais",
    subtitle: "Premium · Americas",
    badge: "PREMIUM",
    intro:
      "Das metropoles vibrantes as praias tropicais — viagens premium para momentos unicos nas Americas.",
    items: [
      { number: 37, name: "Nova Iorque", region: "EUA", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 196000, imageSeed: "new-york" },
      { number: 38, name: "Miami", region: "EUA", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 188000, imageSeed: "miami" },
      { number: 39, name: "Cancun", region: "Mexico", duration: "6 Dias / 5 Noites", hotel: "Resort 5 Estrelas", meals: "Pequeno-almoço + Jantar", transport: "Transfer + Passeios", priceFrom: 192000, imageSeed: "cancun" },
      { number: 40, name: "Rio de Janeiro", region: "Brasil", duration: "6 Dias / 5 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 185000, imageSeed: "rio" },
      { number: 41, name: "Buenos Aires", region: "Argentina", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 178000, imageSeed: "buenos-aires" },
      { number: 42, name: "Santiago", region: "Chile", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 175000, imageSeed: "santiago" },
      { number: 43, name: "Lima", region: "Peru", duration: "6 Dias / 5 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Guia", priceFrom: 180000, imageSeed: "lima" },
      { number: 44, name: "Cartagena", region: "Colombia", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 172000, imageSeed: "cartagena" },
      { number: 45, name: "Toronto", region: "Canada", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 190000, imageSeed: "toronto" },
      { number: 46, name: "Vancouver", region: "Canada", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 188000, imageSeed: "vancouver" },
      { number: 47, name: "San Francisco", region: "EUA", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 194000, imageSeed: "san-francisco" },
      { number: 48, name: "Montevideu", region: "Uruguai", duration: "4 Dias / 3 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 168000, imageSeed: "montevideo" },
      { number: 49, name: "Chicago", region: "EUA", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 186000, imageSeed: "chicago" },
      { number: 50, name: "Nova Orleans", region: "EUA", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 182000, imageSeed: "new-orleans" },
      { number: 51, name: "Las Vegas", region: "EUA", duration: "4 Dias / 3 Noites", hotel: "Hotel 5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 178000, imageSeed: "las-vegas" },
      { number: 52, name: "Los Angeles", region: "EUA", duration: "5 Dias / 4 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 192000, imageSeed: "los-angeles" },
      { number: 53, name: "Washington DC", region: "EUA", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 188000, imageSeed: "washington" },
      { number: 54, name: "Boston", region: "EUA", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 185000, imageSeed: "boston" },
      { number: 55, name: "Orlando", region: "EUA", duration: "6 Dias / 5 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 190000, imageSeed: "orlando" },
      { number: 56, name: "Sao Paulo", region: "Brasil", duration: "4 Dias / 3 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 170000, imageSeed: "sao-paulo" },
      { number: 57, name: "Cusco e Machu Picchu", region: "Peru", duration: "7 Dias / 6 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Guia", priceFrom: 205000, imageSeed: "cusco" },
      { number: 58, name: "Punta Cana", region: "Republica Dominicana", duration: "6 Dias / 5 Noites", hotel: "Resort 5 Estrelas", meals: "Pequeno-almoço + Jantar", transport: "Transfer + Passeios", priceFrom: 188000, imageSeed: "punta-cana" },
      { number: 59, name: "Havana", region: "Cuba", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 175000, imageSeed: "havana" },
      { number: 60, name: "Quito", region: "Equador", duration: "5 Dias / 4 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Guia", priceFrom: 172000, imageSeed: "quito" },
    ],
  },
  {
    id: "asia",
    title: "Destinos internacionais",
    subtitle: "Premium · Asia e Medio Oriente",
    badge: "PREMIUM",
    intro:
      "Explore o mundo com conforto e exclusividade. Os melhores destinos da Asia e Medio Oriente para momentos unicos.",
    items: [
      { number: 1, name: "Bali", region: "Indonesia", duration: "7 Dias / 6 Noites", hotel: "Resort 5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Guia Privado", priceFrom: 210000, imageSeed: "bali" },
      { number: 2, name: "Phuket", region: "Tailandia", duration: "6 Dias / 5 Noites", hotel: "Resort 5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Passeios", priceFrom: 198000, imageSeed: "phuket" },
      { number: 3, name: "Maldivas", region: "Maldivas", duration: "6 Dias / 5 Noites", hotel: "Resort 5 Estrelas", meals: "Pequeno-almoço + Jantar", transport: "Transfer + Passeios", priceFrom: 245000, imageSeed: "maldives" },
      { number: 4, name: "Singapura", region: "Singapura", duration: "5 Dias / 4 Noites", hotel: "Hotel 5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 205000, imageSeed: "singapore" },
      { number: 5, name: "Toquio", region: "Japao", duration: "7 Dias / 6 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Guia", priceFrom: 228000, imageSeed: "tokyo" },
      { number: 6, name: "Bangkok", region: "Tailandia", duration: "6 Dias / 5 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 192000, imageSeed: "bangkok" },
      { number: 7, name: "Dubai", region: "Emirados Arabes", duration: "5 Dias / 4 Noites", hotel: "Hotel 5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 215000, imageSeed: "dubai" },
      { number: 8, name: "Hanoi", region: "Vietname", duration: "6 Dias / 5 Noites", hotel: "Hotel 4 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Guia", priceFrom: 178000, imageSeed: "hanoi" },
      { number: 9, name: "Seul", region: "Coreia do Sul", duration: "6 Dias / 5 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 208000, imageSeed: "seoul" },
      { number: 10, name: "Hong Kong", region: "China", duration: "5 Dias / 4 Noites", hotel: "Hotel 5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + City Tour", priceFrom: 212000, imageSeed: "hong-kong" },
      { number: 11, name: "Xangai", region: "China", duration: "6 Dias / 5 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Guia", priceFrom: 200000, imageSeed: "shanghai" },
      { number: 12, name: "Kyoto", region: "Japao", duration: "6 Dias / 5 Noites", hotel: "Hotel 4/5 Estrelas", meals: "Pequeno-almoço + Tours", transport: "Transfer + Guia", priceFrom: 218000, imageSeed: "kyoto" },
    ],
  },
];

export const DESTINATION_SECTION_LABELS: Record<DestinationCatalogSectionId, string> = {
  nacional: "Nacionais",
  africa: "Africa",
  europa: "Europa",
  americas: "Americas",
  asia: "Asia",
};

export function getCatalogSection(id: DestinationCatalogSectionId) {
  return DESTINATION_CATALOG_SECTIONS.find((s) => s.id === id) ?? DESTINATION_CATALOG_SECTIONS[0];
}

export { catalogImageUrl } from "@/lib/destinations/catalog-images";
