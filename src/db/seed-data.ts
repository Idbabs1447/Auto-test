import { site } from "@/lib/site";

/**
 * Inventory seed data.
 *
 * The first six listings are REAL Dashlink Integrated Autos units. Only the
 * facts supplied by the dealership are stored for them (year, make, model,
 * condition, known feature, clearance/arrival notes). Everything unknown is
 * left null so the interface shows "Contact for details".
 *
 * The remaining listings are clearly-flagged SAMPLE records used to show how a
 * larger inventory will look and behave. They are marked `isDemo: true`.
 */

type SeedImage = { url: string; caption?: string };
type SeedVideo = {
  platform: "youtube" | "tiktok" | "instagram";
  url: string;
  caption?: string;
  embedId?: string;
};

export type SeedListing = {
  slug: string;
  make: string;
  model: string;
  trim?: string;
  year: number;
  condition: string;
  bodyType?: string;
  transmission?: string;
  fuelType?: string;
  drivetrain?: string;
  engine?: string;
  exteriorColor?: string;
  interiorColor?: string;
  mileageKm?: number;
  priceNgn?: number;
  status?: "available" | "reserved" | "sold";
  clearance?: string;
  arrivalNote?: string;
  badge?: string;
  titleStatus?: string;
  description: string;
  features: string[];
  specs?: { label: string; value: string }[];
  isDemo: boolean;
  featured?: boolean;
  listingRank: number;
  images: SeedImage[];
  videos?: SeedVideo[];
};

const IMG = {
  mercedesFront: "/images/mercedes-front.jpg",
  mercedesRoad: "/images/mercedes-road.jpg",
  mercedesAutumn: "/images/mercedes-autumn.jpg",
  silverSedan: "/images/silver-sedan.jpg",
  whiteToyotaLot: "/images/white-toyota-lot.jpg",
  whiteToyotaStreet: "/images/white-toyota-street.jpg",
  whiteHatchRear: "/images/white-hatch-rear.jpg",
  whiteHatchRearTwo: "/images/white-hatch-rear-two.png",
  whiteHatchDoors: "/images/white-hatch-doors.jpg",
  whiteHatchRearThree: "/images/white-hatch-rear-three.jpg",
  blackSedan: "/images/black-sedan.jpg",
  blackGarage: "/images/black-garage.jpg",
  rainHeadlight: "/images/rain-headlight.jpg",
  redFrontDetail: "/images/red-front-detail.jpg",
  silverLexus: "/images/silver-lexus.jpg",
  whiteLexus: "/images/white-lexus.jpg",
  blackLexus: "/images/black-lexus.jpg",
  hyundaiSuv: "/images/hyundai-suv.jpg",
  redSuv: "/images/red-suv.jpg",
  whiteSuvSunset: "/images/white-suv-sunset.jpg",
  whiteSuvRoad: "/images/white-suv-road.jpg",
  whiteSuvNature: "/images/white-suv-nature.jpg",
  whiteMercedes: "/images/white-mercedes.jpg",
  goldMercedes: "/images/gold-mercedes.jpg",
  blackSuvMountain: "/images/black-suv-mountain.jpg",
  blackSuvMountainTwo: "/images/black-suv-mountain-two.jpg",
  blackSuvStreet: "/images/black-suv-street.jpg",
  blackSuvParking: "/images/black-suv-parking.jpg",
  minivan: "/images/minivan.jpg",
  minivanTwo: "/images/minivan-two.jpg",
  lotRow: "/images/lot-row.jpg",
  lotWhite: "/images/lot-white.jpg",
  blackToyotaCorolla: "/images/black-toyota-corolla.jpg",
} as const;

export const SEED_LISTINGS: SeedListing[] = [
  /* ------------------------------------------------------------------ *
   * REAL DASHLINK UNITS
   * ------------------------------------------------------------------ */
  {
    slug: "2015-mercedes-benz-gla-250",
    make: "Mercedes-Benz",
    model: "GLA 250",
    year: 2015,
    condition: "Foreign Used",
    bodyType: "SUV",
    exteriorColor: "Brown",
    description:
      "2015 Mercedes-Benz GLA 250, foreign used and on ground at our 47 Ogunnusi Road, Ogba lot. This unit has thumb start (push-button start). Price is available on request — message us on WhatsApp and we will confirm price, condition and inspection arrangements for this exact SUV.",
    features: ["Thumb Start / Push-button Start"],
    specs: [
      { label: "Known feature", value: "Thumb Start / Push-button Start" },
      { label: "Price", value: "Contact for details" },
    ],
    isDemo: false,
    featured: true,
    listingRank: 1,
    images: [
      { url: IMG.mercedesFront, caption: "Front view" },
      { url: IMG.mercedesAutumn, caption: "Exterior" },
      { url: IMG.mercedesRoad, caption: "Drive-by" },
    ],
  },
  {
    slug: "2012-toyota-camry-freshly-cleared",
    make: "Toyota",
    model: "Camry",
    year: 2012,
    condition: "Foreign Used",
    bodyType: "Sedan",
    exteriorColor: "Silver",
    clearance: "Freshly Cleared",
    arrivalNote: "September 2026",
    badge: "JUST ARRIVED",
    description:
      "2012 Toyota Camry, foreign used, freshly cleared and just arrived in our Ogba, Ikeja stock. Listed arrival: September 2026. Availability moves quickly — send us a WhatsApp message for the current price and to arrange inspection.",
    features: [],
    specs: [
      { label: "Status", value: "Freshly Cleared" },
      { label: "Arrival", value: "September 2026" },
      { label: "Price", value: "Contact for details" },
    ],
    isDemo: false,
    featured: true,
    listingRank: 2,
    images: [
      { url: IMG.silverSedan, caption: "Front view" },
      { url: IMG.whiteToyotaLot, caption: "Exterior" },
      { url: IMG.whiteToyotaStreet, caption: "Side view" },
    ],
  },
  {
    slug: "2017-hyundai-elantra-gt",
    make: "Hyundai",
    model: "Elantra GT",
    year: 2017,
    condition: "Foreign Used",
    bodyType: "Hatchback",
    exteriorColor: "White",
    description:
      "2017 Hyundai Elantra GT, foreign used, white, in stock at our Ogba, Ikeja lot. A practical five-door hatch with strong fuel economy for Lagos driving. Price on request — WhatsApp us and we will confirm the numbers and book you in for a viewing.",
    features: [],
    specs: [{ label: "Price", value: "Contact for details" }],
    isDemo: false,
    featured: true,
    listingRank: 3,
    images: [
      { url: IMG.whiteHatchRear, caption: "Rear three-quarter" },
      { url: IMG.whiteHatchRearTwo, caption: "Rear view" },
      { url: IMG.whiteHatchDoors, caption: "Doors open" },
      { url: IMG.whiteHatchRearThree, caption: "Tailgate" },
    ],
  },
  {
    slug: "2015-toyota-camry-se",
    make: "Toyota",
    model: "Camry",
    trim: "SE",
    year: 2015,
    condition: "Foreign Used",
    bodyType: "Sedan",
    exteriorColor: "Black",
    description:
      "2015 Toyota Camry SE, foreign used and available at Dashlink Integrated Autos, Ogba, Ikeja. Sport-styled Camry with the SE bumper and grille treatment seen in the photos. Price on request — message us on WhatsApp for availability and inspection details.",
    features: [],
    specs: [{ label: "Price", value: "Contact for details" }],
    isDemo: false,
    featured: true,
    listingRank: 4,
    images: [
      { url: IMG.blackSedan, caption: "Front view" },
      { url: IMG.blackGarage, caption: "Exterior" },
      { url: IMG.rainHeadlight, caption: "Headlamp detail" },
    ],
  },
  {
    slug: "2013-lexus-es-350",
    make: "Lexus",
    model: "ES 350",
    year: 2013,
    condition: "Foreign Used",
    bodyType: "Sedan",
    exteriorColor: "Red",
    description:
      "2013 Lexus ES 350, foreign used, in stock at our Ogba, Ikeja yard. Full-size luxury sedan with the distinctive spindle grille. Price on request — send a WhatsApp message and we will confirm price and arrange your inspection.",
    features: [],
    specs: [{ label: "Price", value: "Contact for details" }],
    isDemo: false,
    featured: true,
    listingRank: 5,
    images: [
      { url: IMG.redFrontDetail, caption: "Front view" },
      { url: IMG.silverLexus, caption: "Exterior" },
      { url: IMG.whiteLexus, caption: "Profile" },
    ],
  },
  {
    slug: "2016-hyundai-tucson-1-6t",
    make: "Hyundai",
    model: "Tucson",
    trim: "1.6T",
    year: 2016,
    condition: "Foreign Used",
    bodyType: "SUV",
    exteriorColor: "Maroon",
    description:
      "2016 Hyundai Tucson 1.6T, foreign used, maroon, on ground at 47 Ogunnusi Road, Ogba, Ikeja. Mid-size SUV with the 1.6T badge on the tailgate as shown in the photos. Price on request — WhatsApp us for full details and to schedule a viewing.",
    features: [],
    specs: [{ label: "Price", value: "Contact for details" }],
    isDemo: false,
    featured: true,
    listingRank: 6,
    images: [
      { url: IMG.hyundaiSuv, caption: "Front view" },
      { url: IMG.redSuv, caption: "Exterior" },
    ],
  },

  /* ------------------------------------------------------------------ *
   * SAMPLE / DEMO UNITS (prototype content)
   * ------------------------------------------------------------------ */
  {
    slug: "sample-2018-toyota-corolla-le",
    make: "Toyota",
    model: "Corolla",
    trim: "LE",
    year: 2018,
    condition: "Foreign Used",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Petrol",
    drivetrain: "FWD",
    engine: "1.8L 4-cylinder",
    exteriorColor: "White",
    interiorColor: "Grey fabric",
    mileageKm: 96000,
    priceNgn: 18500000,
    titleStatus: "Duty Paid",
    description:
      "Sample listing: the most requested sedan in Nigeria in a clean, well-kept trim. Shown here to demonstrate how a priced Dashlink listing will look once our full inventory is loaded.",
    features: [
      "Reverse camera",
      "Bluetooth audio",
      "Air conditioning (front & rear vents)",
      "Alloy wheels",
      "Keyless entry",
    ],
    isDemo: true,
    featured: false,
    listingRank: 101,
    images: [
      { url: IMG.whiteToyotaLot, caption: "Front view" },
      { url: IMG.whiteToyotaStreet, caption: "Exterior" },
      { url: IMG.blackToyotaCorolla, caption: "Rear quarter" },
    ],
    videos: [
      {
        platform: "instagram",
        url: site.instagram.url,
        caption: "Example video slot — walkaround clips will open from Instagram",
      },
    ],
  },
  {
    slug: "sample-2019-honda-accord-sport",
    make: "Honda",
    model: "Accord",
    trim: "Sport 1.5T",
    year: 2019,
    condition: "Foreign Used",
    bodyType: "Sedan",
    transmission: "Automatic (CVT)",
    fuelType: "Petrol",
    drivetrain: "FWD",
    engine: "1.5L Turbo",
    exteriorColor: "Black",
    interiorColor: "Black leather",
    mileageKm: 74000,
    priceNgn: 27500000,
    titleStatus: "Duty Paid",
    description:
      "Sample listing: sporty mid-size sedan with turbo power, popular with buyers who want executive looks without the fuel bill. Prototype content for layout review.",
    features: [
      "Reverse camera",
      "Apple CarPlay / Android Auto",
      "Paddle shifters",
      "Dual-zone climate control",
      "Push-button start",
    ],
    isDemo: true,
    listingRank: 102,
    images: [
      { url: IMG.blackSedan, caption: "Front view" },
      { url: IMG.blackGarage, caption: "Exterior" },
    ],
    videos: [
      {
        platform: "youtube",
        url: "https://www.youtube.com/results?search_query=honda+accord+2019+walkaround",
        caption: "Example: YouTube walkaround slot",
      },
    ],
  },
  {
    slug: "sample-2020-toyota-rav4-xle",
    make: "Toyota",
    model: "RAV4",
    trim: "XLE AWD",
    year: 2020,
    condition: "Foreign Used",
    bodyType: "SUV",
    transmission: "Automatic",
    fuelType: "Petrol",
    drivetrain: "AWD",
    engine: "2.5L 4-cylinder",
    exteriorColor: "White",
    interiorColor: "Black cloth",
    mileageKm: 58000,
    priceNgn: 39500000,
    status: "available",
    titleStatus: "Duty Paid",
    description:
      "Sample listing: the go-anywhere family SUV. Demonstrates SUV spec panels, AWD filtering and a staged price display.",
    features: [
      "All-wheel drive",
      "Reverse camera",
      "Lane departure alert",
      "Roof rails",
      "Power tailgate",
      "Apple CarPlay",
    ],
    isDemo: true,
    listingRank: 103,
    images: [
      { url: IMG.whiteSuvSunset, caption: "Front view" },
      { url: IMG.whiteSuvNature, caption: "Exterior" },
    ],
    videos: [
      {
        platform: "tiktok",
        url: "https://www.tiktok.com/search?q=rav4%202020%20walkaround",
        caption: "Example: TikTok clip slot",
      },
    ],
  },
  {
    slug: "sample-2017-lexus-rx-350",
    make: "Lexus",
    model: "RX 350",
    trim: "F Sport",
    year: 2017,
    condition: "Foreign Used",
    bodyType: "SUV",
    transmission: "Automatic",
    fuelType: "Petrol",
    drivetrain: "AWD",
    engine: "3.5L V6",
    exteriorColor: "Black",
    interiorColor: "Black leather",
    mileageKm: 88000,
    priceNgn: 42500000,
    titleStatus: "Duty Paid",
    description:
      "Sample listing: one of the most in-demand luxury SUVs in Lagos. Shows how a premium unit with full specs and pricing will be presented.",
    features: [
      "Panoramic roof",
      "Leather seats",
      "Ventilated front seats",
      "Reverse camera",
      "Blind spot monitor",
      "Power tailgate",
    ],
    isDemo: true,
    listingRank: 104,
    images: [
      { url: IMG.blackLexus, caption: "Front view" },
      { url: IMG.silverLexus, caption: "Exterior" },
      { url: IMG.blackSuvParking, caption: "Profile" },
    ],
    videos: [
      {
        platform: "instagram",
        url: site.instagram.url,
        caption: "Example: Instagram reel slot",
      },
    ],
  },
  {
    slug: "sample-2019-mercedes-benz-c300",
    make: "Mercedes-Benz",
    model: "C 300",
    trim: "4MATIC",
    year: 2019,
    condition: "Foreign Used",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Petrol",
    drivetrain: "AWD",
    engine: "2.0L Turbo",
    exteriorColor: "White",
    interiorColor: "Black leather",
    mileageKm: 61000,
    priceNgn: 46500000,
    titleStatus: "Duty Paid",
    description:
      "Sample listing: executive German sedan with all-wheel drive. Used to demonstrate how premium trim levels and AWD filtering read on the inventory page.",
    features: [
      "Ambient lighting",
      "Burmester-style audio",
      "Reverse camera",
      "Push-button start",
      "Power front seats",
      "Paddle shifters",
    ],
    isDemo: true,
    listingRank: 105,
    images: [
      { url: IMG.whiteMercedes, caption: "Front view" },
      { url: IMG.goldMercedes, caption: "Exterior" },
    ],
  },
  {
    slug: "sample-2021-hyundai-santa-fe",
    make: "Hyundai",
    model: "Santa Fe",
    trim: "SEL",
    year: 2021,
    condition: "Foreign Used",
    bodyType: "SUV",
    transmission: "Automatic",
    fuelType: "Petrol",
    drivetrain: "FWD",
    engine: "2.5L 4-cylinder",
    exteriorColor: "Blue",
    interiorColor: "Grey cloth",
    mileageKm: 42000,
    priceNgn: 41500000,
    titleStatus: "Duty Paid",
    description:
      "Sample listing: modern 7-seater SUV, popular for family and business use. Prototype record for review only.",
    features: [
      "Third-row seating",
      "Reverse camera",
      "Wireless charging",
      "Push-button start",
      "Cruise control",
      "Alloy wheels",
    ],
    isDemo: true,
    listingRank: 106,
    images: [
      { url: IMG.hyundaiSuv, caption: "Front view" },
      { url: IMG.whiteSuvRoad, caption: "Exterior" },
    ],
  },
  {
    slug: "sample-2016-ford-explorer",
    make: "Ford",
    model: "Explorer",
    trim: "XLT",
    year: 2016,
    condition: "Foreign Used",
    bodyType: "SUV",
    transmission: "Automatic",
    fuelType: "Petrol",
    drivetrain: "AWD",
    engine: "3.5L V6",
    exteriorColor: "Black",
    interiorColor: "Black cloth",
    mileageKm: 118000,
    priceNgn: 29500000,
    titleStatus: "Duty Paid",
    description:
      "Sample listing: big-body 7-seater SUV with V6 power — a sturdy pick for long trips. Prototype content.",
    features: [
      "Third-row seating",
      "Roof rails",
      "Reverse camera",
      "Cruise control",
      "Tow package",
    ],
    isDemo: true,
    listingRank: 107,
    images: [
      { url: IMG.blackSuvMountain, caption: "Exterior" },
      { url: IMG.blackSuvMountainTwo, caption: "Rear quarter" },
    ],
  },
  {
    slug: "sample-2018-honda-crv-exl",
    make: "Honda",
    model: "CR-V",
    trim: "EX-L",
    year: 2018,
    condition: "Foreign Used",
    bodyType: "SUV",
    transmission: "Automatic (CVT)",
    fuelType: "Petrol",
    drivetrain: "AWD",
    engine: "1.5L Turbo",
    exteriorColor: "White",
    interiorColor: "Beige leather",
    mileageKm: 79000,
    priceNgn: 32500000,
    titleStatus: "Duty Paid",
    description:
      "Sample listing: economical crossover that suits daily Lagos driving. Prototype record for layout demonstration.",
    features: [
      "Reverse camera",
      "Leather seats",
      "Sunroof",
      "Dual-zone climate control",
      "Apple CarPlay",
    ],
    isDemo: true,
    listingRank: 108,
    images: [
      { url: IMG.whiteSuvRoad, caption: "Exterior" },
      { url: IMG.whiteSuvNature, caption: "Front view" },
    ],
  },
  {
    slug: "sample-2020-toyota-highlander-le",
    make: "Toyota",
    model: "Highlander",
    trim: "LE",
    year: 2020,
    condition: "Foreign Used",
    bodyType: "SUV",
    transmission: "Automatic",
    fuelType: "Petrol",
    drivetrain: "FWD",
    engine: "3.5L V6",
    exteriorColor: "Silver",
    interiorColor: "Grey cloth",
    mileageKm: 66000,
    priceNgn: 52500000,
    status: "reserved",
    titleStatus: "Duty Paid",
    description:
      "Sample listing: three-row SUV with ample space. Shown as RESERVED to demonstrate the reservation status flow before online payments go live.",
    features: [
      "Third-row seating",
      "Reverse camera",
      "Power tailgate",
      "Tri-zone climate control",
      "Adaptive cruise control",
    ],
    isDemo: true,
    listingRank: 109,
    images: [
      { url: IMG.lotWhite, caption: "Exterior" },
      { url: IMG.lotRow, caption: "Lot view" },
    ],
    videos: [
      {
        platform: "youtube",
        url: "https://www.youtube.com/results?search_query=toyota+highlander+2020+walkaround",
        caption: "Example: YouTube walkaround slot",
      },
    ],
  },
  {
    slug: "sample-2020-toyota-sienna-xle",
    make: "Toyota",
    model: "Sienna",
    trim: "XLE",
    year: 2020,
    condition: "Foreign Used",
    bodyType: "Minivan",
    transmission: "Automatic",
    fuelType: "Petrol",
    drivetrain: "FWD",
    engine: "3.5L V6",
    exteriorColor: "White",
    interiorColor: "Grey leather",
    mileageKm: 71000,
    priceNgn: 47500000,
    titleStatus: "Duty Paid",
    description:
      "Sample listing: family and shuttle favourite with sliding doors and generous cabin space. Prototype content.",
    features: [
      "Power sliding doors",
      "8 seats",
      "Reverse camera",
      "Rear entertainment screen",
      "Three-zone climate control",
    ],
    isDemo: true,
    listingRank: 110,
    images: [
      { url: IMG.minivan, caption: "Exterior" },
      { url: IMG.minivanTwo, caption: "Interior access" },
    ],
  },
];

export const LOTS_IMAGERY = {
  heroLot: IMG.lotRow,
  heroSuv: IMG.whiteSuvSunset,
  portShip: "/images/port-ship.jpg",
  portRoRo: "/images/port-roro.jpg",
  lotAerial: "/images/lot-aerial.jpg",
  lotShowroom: IMG.lotWhite,
  lotLine: "/images/lot-line.jpg",
};
