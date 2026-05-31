/** Fotos locais do catalogo (public/images/destinations) — servidas pelo optimizador Next.js. */
const CATALOG_IMAGE_VERSION = "2";

const LOCAL_CATALOG_IMAGES: Record<string, string> = {
  // Nacional
  tofo: "/images/destinations/tofo.jpg",
  bilene: "/images/destinations/bilene.jpg",
  xaixai: "/images/destinations/xaixai.jpg",
  "ponta-ouro": "/images/destinations/ponta-ouro.jpg",
  quilalea: "/images/destinations/quilalea.jpg",
  morrungulo: "/images/destinations/morrungulo.jpg",
  vilankulo: "/images/destinations/vilankulo.jpg",
  "ilha-mocambique": "/images/destinations/ilha-mocambique.jpg",
  pemba: "/images/destinations/pemba.jpg",
  "lago-niassa": "/images/destinations/lago-niassa.jpg",
  gorongosa: "/images/destinations/gorongosa.jpg",
  chimoio: "/images/destinations/chimoio.jpg",
  // Africa
  "cape-town": "/images/destinations/cape-town.jpg",
  johannesburg: "/images/destinations/johannesburg.jpg",
  nairobi: "/images/destinations/nairobi.jpg",
  zanzibar: "/images/destinations/zanzibar.jpg",
  "victoria-falls": "/images/destinations/victoria-falls.jpg",
  mauritius: "/images/destinations/mauritius.jpg",
  marrakech: "/images/destinations/marrakech.jpg",
  cairo: "/images/destinations/cairo.jpg",
  dakar: "/images/destinations/dakar.jpg",
  namibia: "/images/destinations/namibia.jpg",
  kigali: "/images/destinations/kigali.jpg",
  accra: "/images/destinations/accra.jpg",
  // Europa
  paris: "/images/destinations/paris.jpg",
  rome: "/images/destinations/rome.jpg",
  london: "/images/destinations/london.jpg",
  madrid: "/images/destinations/madrid.jpg",
  barcelona: "/images/destinations/barcelona.jpg",
  amsterdam: "/images/destinations/amsterdam.jpg",
  prague: "/images/destinations/prague.jpg",
  vienna: "/images/destinations/vienna.jpg",
  budapest: "/images/destinations/budapest.jpg",
  athens: "/images/destinations/athens.jpg",
  venice: "/images/destinations/venice.jpg",
  berlin: "/images/destinations/berlin.jpg",
  lisbon: "/images/destinations/lisbon.jpg",
  porto: "/images/destinations/porto.jpg",
  dublin: "/images/destinations/dublin.jpg",
  edinburgh: "/images/destinations/edinburgh.jpg",
  copenhagen: "/images/destinations/stockholm.jpg",
  stockholm: "/images/destinations/stockholm.jpg",
  oslo: "/images/destinations/oslo.jpg",
  helsinki: "/images/destinations/helsinki.jpg",
  brussels: "/images/destinations/brussels.jpg",
  zurich: "/images/destinations/zurich.jpg",
  geneva: "/images/destinations/geneva.jpg",
  florence: "/images/destinations/florence.jpg",
  // Americas
  "new-york": "/images/destinations/new-york.jpg",
  miami: "/images/destinations/miami.jpg",
  cancun: "/images/destinations/cancun.jpg",
  rio: "/images/destinations/rio.jpg",
  "buenos-aires": "/images/destinations/buenos-aires.jpg",
  santiago: "/images/destinations/santiago.jpg",
  lima: "/images/destinations/lima.jpg",
  cartagena: "/images/destinations/cartagena.jpg",
  toronto: "/images/destinations/toronto.jpg",
  vancouver: "/images/destinations/vancouver.jpg",
  "san-francisco": "/images/destinations/san-francisco.jpg",
  montevideo: "/images/destinations/montevideo.jpg",
  chicago: "/images/destinations/chicago.jpg",
  "new-orleans": "/images/destinations/new-orleans.jpg",
  "las-vegas": "/images/destinations/las-vegas.jpg",
  "los-angeles": "/images/destinations/los-angeles.jpg",
  washington: "/images/destinations/washington.jpg",
  boston: "/images/destinations/boston.jpg",
  orlando: "/images/destinations/orlando.jpg",
  "sao-paulo": "/images/destinations/sao-paulo.jpg",
  cusco: "/images/destinations/cusco.jpg",
  "punta-cana": "/images/destinations/punta-cana.jpg",
  havana: "/images/destinations/havana.jpg",
  quito: "/images/destinations/quito.jpg",
  // Asia e Medio Oriente
  bali: "/images/destinations/bali.jpg",
  phuket: "/images/destinations/phuket.jpg",
  maldives: "/images/destinations/maldives.jpg",
  singapore: "/images/destinations/singapore.jpg",
  tokyo: "/images/destinations/tokyo.jpg",
  bangkok: "/images/destinations/bangkok.jpg",
  dubai: "/images/destinations/dubai.jpg",
  hanoi: "/images/destinations/hanoi.jpg",
  seoul: "/images/destinations/seoul.jpg",
  "hong-kong": "/images/destinations/hong-kong.jpg",
  shanghai: "/images/destinations/hong-kong.jpg",
  kyoto: "/images/destinations/kyoto.jpg",
};

const CATALOG_PLACEHOLDER = "/images/destinations/placeholder.jpg";

function withCacheBust(path: string): string {
  return `${path}?v=${CATALOG_IMAGE_VERSION}`;
}

export function catalogImageUrl(seed: string): string {
  const path = LOCAL_CATALOG_IMAGES[seed] ?? CATALOG_PLACEHOLDER;
  return withCacheBust(path);
}
