import type {
  SeedAllergen,
  SeedSupplier,
  SeedIngredient,
  SeedProduct,
  SeedStore,
  SeedRecall,
} from "../src/types/seed.ts";

export const allergens: SeedAllergen[] = [
  { name: "peanut" },
  { name: "gluten" },
  { name: "dairy" },
  { name: "soy" },
  { name: "egg" },
  { name: "sesame" },
];

export const stores: SeedStore[] = [
  { name: "FreshMart Andheri", chain: "FreshMart", city: "Mumbai" },
  { name: "FreshMart Bandra", chain: "FreshMart", city: "Mumbai" },
  { name: "FreshMart Koregaon Park", chain: "FreshMart", city: "Pune" },
  { name: "FreshMart Indiranagar", chain: "FreshMart", city: "Bengaluru" },
  { name: "FreshMart Gachibowli", chain: "FreshMart", city: "Hyderabad" },
  { name: "GreenGrocer Powai", chain: "GreenGrocer", city: "Mumbai" },
  { name: "GreenGrocer Viman Nagar", chain: "GreenGrocer", city: "Pune" },
  { name: "GreenGrocer Jubilee Hills", chain: "GreenGrocer", city: "Hyderabad" },
  { name: "GreenGrocer Vasant Kunj", chain: "GreenGrocer", city: "Delhi" },
  { name: "ValueSave Connaught Place", chain: "ValueSave", city: "Delhi" },
  { name: "ValueSave Saket", chain: "ValueSave", city: "Delhi" },
  { name: "ValueSave Whitefield", chain: "ValueSave", city: "Bengaluru" },
  { name: "ValueSave HSR Layout", chain: "ValueSave", city: "Bengaluru" },
  { name: "MetroFoods Salt Lake", chain: "MetroFoods", city: "Kolkata" },
  { name: "MetroFoods Park Street", chain: "MetroFoods", city: "Kolkata" },
  { name: "MetroFoods T Nagar", chain: "MetroFoods", city: "Chennai" },
  { name: "MetroFoods Adyar", chain: "MetroFoods", city: "Chennai" },
  { name: "CornerStop Satellite", chain: "CornerStop", city: "Ahmedabad" },
  { name: "CornerStop Navrangpura", chain: "CornerStop", city: "Ahmedabad" },
  { name: "CornerStop Kothrud", chain: "CornerStop", city: "Pune" },
];

export const ingredients: SeedIngredient[] = [

  { name: "peanut oil", category: "oil", allergens: ["peanut"] },
  { name: "peanut paste", category: "nut", allergens: ["peanut"] },
  { name: "roasted peanut pieces", category: "nut", allergens: ["peanut"] },

  { name: "whey powder", category: "dairy", allergens: ["dairy"] },
  { name: "skimmed milk powder", category: "dairy", allergens: ["dairy"] },
  { name: "butterfat", category: "dairy", allergens: ["dairy"] },
  { name: "cream powder", category: "dairy", allergens: ["dairy"] },

  { name: "wheat flour", category: "grain", allergens: ["gluten"] },
  { name: "semolina", category: "grain", allergens: ["gluten"] },
  { name: "malted barley extract", category: "grain", allergens: ["gluten"] },

  { name: "oat flakes", category: "grain", allergens: ["gluten"] },
  { name: "rice flour", category: "grain", allergens: [] },

  { name: "cocoa mass", category: "cocoa", allergens: [] },
  { name: "cocoa butter", category: "cocoa", allergens: [] },
  { name: "cocoa powder", category: "cocoa", allergens: [] },

  { name: "soy lecithin", category: "additive", allergens: ["soy"] },
  { name: "soy protein isolate", category: "additive", allergens: ["soy"] },

  { name: "cane sugar", category: "sweetener", allergens: [] },
  { name: "glucose syrup", category: "sweetener", allergens: [] },
  { name: "invert sugar syrup", category: "sweetener", allergens: [] },

  { name: "sesame paste", category: "seed", allergens: ["sesame"] },
  { name: "sesame seeds", category: "seed", allergens: ["sesame"] },

  { name: "egg powder", category: "egg", allergens: ["egg"] },

  { name: "palm oil", category: "oil", allergens: [] },
  { name: "sunflower oil", category: "oil", allergens: [] },

  { name: "ascorbic acid", category: "additive", allergens: [] },
  { name: "sodium bicarbonate", category: "additive", allergens: [] },
  { name: "xanthan gum", category: "additive", allergens: [] },
  { name: "natural vanilla flavouring", category: "additive", allergens: [] },
  { name: "caramel colour", category: "additive", allergens: [] },
  { name: "citric acid", category: "additive", allergens: [] },
  { name: "orange oil", category: "additive", allergens: [] },

  { name: "cinnamon powder", category: "spice", allergens: [] },
  { name: "cardamom powder", category: "spice", allergens: [] },
  { name: "chilli powder", category: "spice", allergens: [] },

  { name: "dried cranberries", category: "fruit", allergens: [] },
];

export const suppliers: SeedSupplier[] = [
  {
    name: "Gujarat Peanut Co",
    country: "India",
    certification: "FSSAI Certified",
    supplies: [
      { ingredient: "peanut oil", batchCode: "PO-26-0713", suppliedOn: "2026-07-13" },
      { ingredient: "peanut oil", batchCode: "PO-26-0728", suppliedOn: "2026-07-28" },
      { ingredient: "peanut paste", batchCode: "PP-26-0705", suppliedOn: "2026-07-05" },
      { ingredient: "roasted peanut pieces", batchCode: "RP-26-0719", suppliedOn: "2026-07-19" },
    ],
  },
  {
    name: "Nordic Dairy AS",
    country: "Norway",
    certification: "EU Organic",
    supplies: [
      { ingredient: "whey powder", batchCode: "WP-26-0621", suppliedOn: "2026-06-21" },
      { ingredient: "skimmed milk powder", batchCode: "SMP-26-0704", suppliedOn: "2026-07-04" },
      { ingredient: "butterfat", batchCode: "BF-26-0612", suppliedOn: "2026-06-12" },
      { ingredient: "cream powder", batchCode: "CP-26-0630", suppliedOn: "2026-06-30" },
    ],
  },
  {
    name: "Punjab Wheat Mills",
    country: "India",
    certification: "ISO 22000",
    supplies: [
      { ingredient: "wheat flour", batchCode: "WF-26-0708", suppliedOn: "2026-07-08" },
      { ingredient: "semolina", batchCode: "SM-26-0710", suppliedOn: "2026-07-10" },
      { ingredient: "malted barley extract", batchCode: "MB-26-0626", suppliedOn: "2026-06-26" },
      { ingredient: "rice flour", batchCode: "RF-26-0715", suppliedOn: "2026-07-15" },
    ],
  },
  {
    name: "Ivory Coast Cocoa Union",
    country: "Côte d'Ivoire",
    certification: "Fairtrade",
    supplies: [
      { ingredient: "cocoa mass", batchCode: "CM-26-0602", suppliedOn: "2026-06-02" },
      { ingredient: "cocoa butter", batchCode: "CB-26-0609", suppliedOn: "2026-06-09" },
      { ingredient: "cocoa powder", batchCode: "CPW-26-0617", suppliedOn: "2026-06-17" },
    ],
  },
  {
    name: "Mekong Soy Collective",
    country: "Vietnam",
    certification: "ISO 22000",
    supplies: [
      { ingredient: "soy lecithin", batchCode: "SL-26-0722", suppliedOn: "2026-07-22" },
      { ingredient: "soy lecithin", batchCode: "SL-26-0805", suppliedOn: "2026-08-05" },
      { ingredient: "soy protein isolate", batchCode: "SPI-26-0718", suppliedOn: "2026-07-18" },
    ],
  },
  {
    name: "Karnataka Cane Sugar Ltd",
    country: "India",
    certification: "FSSAI Certified",
    supplies: [
      { ingredient: "cane sugar", batchCode: "CS-26-0520", suppliedOn: "2026-05-20" },
      { ingredient: "glucose syrup", batchCode: "GS-26-0611", suppliedOn: "2026-06-11" },
      { ingredient: "invert sugar syrup", batchCode: "IS-26-0624", suppliedOn: "2026-06-24" },
    ],
  },
  {
    name: "Anatolia Sesame Works",
    country: "Turkey",
    certification: "BRCGS",
    supplies: [
      { ingredient: "sesame paste", batchCode: "SP-26-0701", suppliedOn: "2026-07-01" },
      { ingredient: "sesame seeds", batchCode: "SS-26-0703", suppliedOn: "2026-07-03" },
    ],
  },
  {
    name: "Bretagne Egg Farms",
    country: "France",
    certification: "EU Organic",
    supplies: [{ ingredient: "egg powder", batchCode: "EP-26-0714", suppliedOn: "2026-07-14" }],
  },
  {
    name: "Rotterdam Additives BV",
    country: "Netherlands",
    certification: "ISO 22000",
    supplies: [
      { ingredient: "palm oil", batchCode: "PLO-26-0629", suppliedOn: "2026-06-29" },
      { ingredient: "sunflower oil", batchCode: "SO-26-0706", suppliedOn: "2026-07-06" },
      { ingredient: "ascorbic acid", batchCode: "AA-26-0518", suppliedOn: "2026-05-18" },
      { ingredient: "sodium bicarbonate", batchCode: "SB-26-0522", suppliedOn: "2026-05-22" },
      { ingredient: "xanthan gum", batchCode: "XG-26-0607", suppliedOn: "2026-06-07" },
      { ingredient: "natural vanilla flavouring", batchCode: "NV-26-0616", suppliedOn: "2026-06-16" },
      { ingredient: "caramel colour", batchCode: "CC-26-0619", suppliedOn: "2026-06-19" },
    ],
  },
  {
    name: "Valencia Citrus Groves",
    country: "Spain",
    certification: "GlobalG.A.P.",
    supplies: [
      { ingredient: "citric acid", batchCode: "CA-26-0605", suppliedOn: "2026-06-05" },
      { ingredient: "orange oil", batchCode: "OO-26-0613", suppliedOn: "2026-06-13" },
      { ingredient: "dried cranberries", batchCode: "DC-26-0627", suppliedOn: "2026-06-27" },
    ],
  },
  {
    name: "Andhra Spice Traders",
    country: "India",
    certification: "FSSAI Certified",
    supplies: [
      { ingredient: "cinnamon powder", batchCode: "CIN-26-0610", suppliedOn: "2026-06-10" },
      { ingredient: "cardamom powder", batchCode: "CAR-26-0614", suppliedOn: "2026-06-14" },
      { ingredient: "chilli powder", batchCode: "CHI-26-0618", suppliedOn: "2026-06-18" },
    ],
  },
  {
    name: "Highland Oats Ltd",
    country: "Scotland",
    certification: "Red Tractor",
    supplies: [{ ingredient: "oat flakes", batchCode: "OF-26-0709", suppliedOn: "2026-07-09" }],
  },
];

export const products: SeedProduct[] = [

  {

    name: "chocolate coating",
    brand: "Acme Foods (internal)",
    batchCode: "INT-CHC-2608",
    category: "intermediate",
    fromIngredients: {
      "cocoa mass": "310 g/kg",
      "cocoa butter": "180 g/kg",
      "cane sugar": "420 g/kg",
      "soy lecithin": "5 g/kg",
      "peanut oil": "80 g/kg",
      "natural vanilla flavouring": "5 g/kg",
    },
  },
  {
    name: "biscuit base",
    brand: "Acme Foods (internal)",
    batchCode: "INT-BSC-2608",
    category: "intermediate",
    fromIngredients: {
      "wheat flour": "560 g/kg",
      "palm oil": "180 g/kg",
      "cane sugar": "170 g/kg",
      "malted barley extract": "40 g/kg",
      "egg powder": "30 g/kg",
      "sodium bicarbonate": "12 g/kg",
      "ascorbic acid": "0.3 g/kg",
    },
  },
  {
    name: "caramel filling",
    brand: "Acme Foods (internal)",
    batchCode: "INT-CRM-2607",
    category: "intermediate",
    fromIngredients: {
      "glucose syrup": "400 g/kg",
      butterfat: "160 g/kg",
      "skimmed milk powder": "120 g/kg",
      "whey powder": "90 g/kg",
      "cane sugar": "220 g/kg",
      "caramel colour": "3 g/kg",
    },
  },
  {
    name: "peanut butter filling",
    brand: "Acme Foods (internal)",
    batchCode: "INT-PBF-2607",
    category: "intermediate",
    fromIngredients: {
      "peanut paste": "680 g/kg",
      "palm oil": "180 g/kg",
      "cane sugar": "130 g/kg",
    },
  },
  {
    name: "oat cluster base",
    brand: "Acme Foods (internal)",
    batchCode: "INT-OAT-2607",
    category: "intermediate",
    fromIngredients: {
      "oat flakes": "520 g/kg",
      "invert sugar syrup": "260 g/kg",
      "sunflower oil": "120 g/kg",
      "soy protein isolate": "80 g/kg",
      "cinnamon powder": "6 g/kg",
    },
  },
  {
    name: "wafer sheet",
    brand: "Acme Foods (internal)",
    batchCode: "INT-WFR-2607",
    category: "intermediate",
    fromIngredients: {
      "wheat flour": "620 g/kg",
      "rice flour": "180 g/kg",
      "sunflower oil": "140 g/kg",
      "soy lecithin": "4 g/kg",
    },
  },
  {
    name: "sesame brittle slab",
    brand: "Acme Foods (internal)",
    batchCode: "INT-SES-2607",
    category: "intermediate",
    fromIngredients: {
      "sesame paste": "300 g/kg",
      "sesame seeds": "280 g/kg",
      "cane sugar": "260 g/kg",
      "glucose syrup": "160 g/kg",
    },
  },
  {
    name: "vanilla cream filling",
    brand: "Acme Foods (internal)",
    batchCode: "INT-VNL-2607",
    category: "intermediate",
    fromIngredients: {
      "cream powder": "210 g/kg",
      "whey powder": "80 g/kg",
      "cane sugar": "440 g/kg",
      "palm oil": "250 g/kg",
      "natural vanilla flavouring": "8 g/kg",
    },
  },
  {
    name: "milk chocolate drops",
    brand: "Acme Foods (internal)",
    batchCode: "INT-MCD-2607",
    category: "intermediate",
    fromIngredients: {
      "cocoa mass": "220 g/kg",
      "cocoa butter": "200 g/kg",
      "skimmed milk powder": "180 g/kg",
      "cane sugar": "395 g/kg",
      "soy lecithin": "5 g/kg",
    },
  },
  {
    name: "cranberry compote",
    brand: "Acme Foods (internal)",
    batchCode: "INT-CRB-2607",
    category: "intermediate",
    fromIngredients: {
      "dried cranberries": "560 g/kg",
      "cane sugar": "380 g/kg",
      "citric acid": "12 g/kg",
      "xanthan gum": "6 g/kg",
      "orange oil": "2 g/kg",
    },
  },
  {
    name: "sponge cake base",
    brand: "Acme Foods (internal)",
    batchCode: "INT-SPG-2607",
    category: "intermediate",
    fromIngredients: {
      "wheat flour": "400 g/kg",
      "egg powder": "150 g/kg",
      "cane sugar": "300 g/kg",
      "sunflower oil": "130 g/kg",
      "sodium bicarbonate": "10 g/kg",
      "cardamom powder": "4 g/kg",
    },
  },
  {
    name: "seasoning mix",
    brand: "Acme Foods (internal)",
    batchCode: "INT-SSN-2607",
    category: "intermediate",
    fromIngredients: {
      "chilli powder": "380 g/kg",
      "cinnamon powder": "120 g/kg",
      "citric acid": "90 g/kg",
      "sodium bicarbonate": "40 g/kg",
      semolina: "370 g/kg",
    },
  },

  {

    name: "granola bar",
    brand: "Morning Crunch",
    batchCode: "GB-2608-114",
    category: "bar",
    fromProducts: { "oat cluster base": "620 g/kg", "chocolate coating": "300 g/kg" },
    fromIngredients: { "dried cranberries": "80 g/kg" },
    soldAt: [
      { store: "FreshMart Andheri", since: "2026-03-01" },
      { store: "FreshMart Koregaon Park", since: "2026-03-01" },
      { store: "GreenGrocer Powai", since: "2026-04-12" },
      { store: "ValueSave Whitefield", since: "2026-02-18" },
      { store: "MetroFoods T Nagar", since: "2026-05-06" },
    ],
  },
  {

    name: "chocolate digestive biscuit",
    brand: "Hearth & Home",
    batchCode: "CDB-2608-207",
    category: "biscuit",
    fromProducts: { "biscuit base": "700 g/kg", "chocolate coating": "300 g/kg" },
    soldAt: [
      { store: "FreshMart Bandra", since: "2026-01-15" },
      { store: "FreshMart Indiranagar", since: "2026-01-15" },
      { store: "GreenGrocer Vasant Kunj", since: "2026-02-02" },
      { store: "ValueSave Connaught Place", since: "2026-01-20" },
      { store: "ValueSave Saket", since: "2026-01-20" },
      { store: "MetroFoods Salt Lake", since: "2026-03-11" },
      { store: "CornerStop Satellite", since: "2026-04-03" },
    ],
  },
  {

    name: "peanut butter cookie",
    brand: "Hearth & Home",
    batchCode: "PBC-2608-031",
    category: "biscuit",
    fromProducts: { "biscuit base": "620 g/kg", "peanut butter filling": "380 g/kg" },
    soldAt: [
      { store: "FreshMart Andheri", since: "2026-02-09" },
      { store: "GreenGrocer Jubilee Hills", since: "2026-03-22" },
      { store: "ValueSave HSR Layout", since: "2026-02-28" },
      { store: "MetroFoods Adyar", since: "2026-04-17" },
    ],
  },
  {
    name: "caramel wafer bar",
    brand: "Morning Crunch",
    batchCode: "CWB-2608-088",
    category: "bar",
    fromProducts: {
      "wafer sheet": "380 g/kg",
      "caramel filling": "320 g/kg",
      "chocolate coating": "300 g/kg",
    },
    soldAt: [
      { store: "FreshMart Gachibowli", since: "2026-03-14" },
      { store: "GreenGrocer Viman Nagar", since: "2026-03-14" },
      { store: "ValueSave Saket", since: "2026-04-01" },
      { store: "MetroFoods Park Street", since: "2026-05-19" },
      { store: "CornerStop Kothrud", since: "2026-02-25" },
    ],
  },
  {
    name: "sesame energy bar",
    brand: "Morning Crunch",
    batchCode: "SEB-2608-052",
    category: "bar",
    fromProducts: { "sesame brittle slab": "540 g/kg", "oat cluster base": "460 g/kg" },
    soldAt: [
      { store: "GreenGrocer Powai", since: "2026-04-05" },
      { store: "ValueSave Whitefield", since: "2026-04-05" },
      { store: "MetroFoods T Nagar", since: "2026-06-01" },
    ],
  },
  {
    name: "vanilla sandwich biscuit",
    brand: "Hearth & Home",
    batchCode: "VSB-2608-163",
    category: "biscuit",
    fromProducts: { "biscuit base": "660 g/kg", "vanilla cream filling": "340 g/kg" },
    soldAt: [
      { store: "FreshMart Bandra", since: "2026-01-08" },
      { store: "GreenGrocer Vasant Kunj", since: "2026-01-08" },
      { store: "ValueSave Connaught Place", since: "2026-02-14" },
      { store: "CornerStop Navrangpura", since: "2026-03-30" },
    ],
  },
  {
    name: "cranberry oat cookie",
    brand: "Hearth & Home",
    batchCode: "COC-2608-119",
    category: "biscuit",
    fromProducts: {
      "biscuit base": "500 g/kg",
      "cranberry compote": "260 g/kg",
      "oat cluster base": "240 g/kg",
    },
    soldAt: [
      { store: "FreshMart Koregaon Park", since: "2026-05-02" },
      { store: "GreenGrocer Jubilee Hills", since: "2026-05-02" },
      { store: "MetroFoods Adyar", since: "2026-06-10" },
    ],
  },
  {
    name: "chocolate chip muffin",
    brand: "Daily Bake",
    batchCode: "CCM-2608-244",
    category: "cake",
    fromProducts: { "sponge cake base": "780 g/kg", "milk chocolate drops": "220 g/kg" },
    fromIngredients: { "cocoa powder": "18 g/kg" },
    soldAt: [
      { store: "FreshMart Andheri", since: "2026-06-15" },
      { store: "FreshMart Gachibowli", since: "2026-06-15" },
      { store: "ValueSave HSR Layout", since: "2026-06-20" },
      { store: "CornerStop Satellite", since: "2026-07-01" },
    ],
  },
  {
    name: "spiced snack mix",
    brand: "Namkeen Co",
    batchCode: "SSM-2608-076",
    category: "snack",
    fromProducts: { "seasoning mix": "120 g/kg" },
    fromIngredients: { "roasted peanut pieces": "380 g/kg", "rice flour": "420 g/kg", "sunflower oil": "80 g/kg" },
    soldAt: [
      { store: "CornerStop Satellite", since: "2026-02-11" },
      { store: "CornerStop Navrangpura", since: "2026-02-11" },
      { store: "CornerStop Kothrud", since: "2026-02-11" },
      { store: "MetroFoods Salt Lake", since: "2026-03-08" },
      { store: "GreenGrocer Viman Nagar", since: "2026-04-22" },
    ],
  },
  {
    name: "birthday sponge cake",
    brand: "Daily Bake",
    batchCode: "BSC-2608-019",
    category: "cake",
    fromProducts: {
      "sponge cake base": "620 g/kg",
      "vanilla cream filling": "260 g/kg",
      "chocolate coating": "120 g/kg",
    },
    soldAt: [
      { store: "FreshMart Indiranagar", since: "2026-05-25" },
      { store: "ValueSave Whitefield", since: "2026-05-25" },
      { store: "MetroFoods Park Street", since: "2026-07-04" },
    ],
  },

  {
    name: "variety pack",
    brand: "Morning Crunch",
    batchCode: "VP-2608-401",
    category: "multipack",
    fromProducts: {
      "granola bar": "4 units",
      "chocolate digestive biscuit": "4 units",
      "caramel wafer bar": "4 units",
    },
    soldAt: [
      { store: "FreshMart Andheri", since: "2026-06-01" },
      { store: "FreshMart Bandra", since: "2026-06-01" },
      { store: "ValueSave Connaught Place", since: "2026-06-08" },
      { store: "MetroFoods Salt Lake", since: "2026-06-14" },
    ],
  },
  {
    name: "lunchbox snack pack",
    brand: "Morning Crunch",
    batchCode: "LSP-2608-412",
    category: "multipack",
    fromProducts: {
      "peanut butter cookie": "3 units",
      "granola bar": "3 units",
      "cranberry oat cookie": "3 units",
    },
    soldAt: [
      { store: "GreenGrocer Powai", since: "2026-07-02" },
      { store: "ValueSave HSR Layout", since: "2026-07-02" },
      { store: "MetroFoods T Nagar", since: "2026-07-10" },
    ],
  },
  {
    name: "festive biscuit tin",
    brand: "Hearth & Home",
    batchCode: "FBT-2608-433",
    category: "multipack",
    fromProducts: {
      "vanilla sandwich biscuit": "6 units",
      "chocolate digestive biscuit": "6 units",
      "sesame energy bar": "4 units",
    },
    soldAt: [
      { store: "FreshMart Koregaon Park", since: "2026-07-18" },
      { store: "GreenGrocer Jubilee Hills", since: "2026-07-18" },
      { store: "ValueSave Saket", since: "2026-07-25" },
      { store: "CornerStop Navrangpura", since: "2026-08-01" },
    ],
  },
  {
    name: "movie night bundle",
    brand: "Namkeen Co",
    batchCode: "MNB-2608-447",
    category: "multipack",
    fromProducts: {
      "spiced snack mix": "2 units",
      "chocolate chip muffin": "4 units",
      "caramel wafer bar": "4 units",
    },
    soldAt: [
      { store: "CornerStop Kothrud", since: "2026-07-20" },
      { store: "MetroFoods Adyar", since: "2026-07-20" },
      { store: "GreenGrocer Vasant Kunj", since: "2026-08-05" },
    ],
  },
  {
    name: "breakfast box",
    brand: "Morning Crunch",
    batchCode: "BB-2608-455",
    category: "multipack",
    fromProducts: {
      "granola bar": "5 units",
      "cranberry oat cookie": "5 units",
      "chocolate chip muffin": "2 units",
    },
    soldAt: [
      { store: "FreshMart Gachibowli", since: "2026-08-02" },
      { store: "GreenGrocer Viman Nagar", since: "2026-08-02" },
      { store: "ValueSave Whitefield", since: "2026-08-09" },
    ],
  },

  {

    name: "family hamper",
    brand: "Hearth & Home",
    batchCode: "FH-2608-500",
    category: "multipack",
    fromProducts: {
      "variety pack": "1 unit",
      "festive biscuit tin": "1 unit",
      "movie night bundle": "1 unit",
    },
    soldAt: [
      { store: "FreshMart Andheri", since: "2026-08-10" },
      { store: "ValueSave Connaught Place", since: "2026-08-10" },
      { store: "MetroFoods Park Street", since: "2026-08-12" },
    ],
  },
];

export const recalls: SeedRecall[] = [
  {
    id: "RC-2026-001",
    reason:
      "Aflatoxin B1 detected at 14.2 µg/kg, above the 8 µg/kg regulatory limit, in groundnut oil pressed from monsoon-season stock.",
    severity: "critical",
    issuedAt: "2026-08-03",
    affects: [{ ingredient: "peanut oil", affectedBatches: "PO-26-0713, PO-26-0728" }],
  },
  {
    id: "RC-2026-002",
    reason:
      "Ethylene oxide residues detected above the EU maximum residue limit in soy lecithin used as an emulsifier.",
    severity: "critical",
    issuedAt: "2026-08-11",
    affects: [{ ingredient: "soy lecithin", affectedBatches: "SL-26-0722, SL-26-0805" }],
  },
  {
    id: "RC-2026-003",
    reason:
      "Listeria monocytogenes isolated during routine environmental swabbing of the whey drying line.",
    severity: "high",
    issuedAt: "2026-07-21",
    affects: [{ ingredient: "whey powder", affectedBatches: "WP-26-0621" }],
  },
  {
    id: "RC-2026-004",
    reason:
      "Undeclared sesame: cross-contamination from a shared roasting line was not captured on the specification sheet.",
    severity: "high",
    issuedAt: "2026-07-09",
    affects: [{ ingredient: "sesame seeds", affectedBatches: "SS-26-0703" }],
  },
  {
    id: "RC-2026-005",
    reason:
      "Elevated moisture on intake causing visible mould growth before the stated best-before date.",
    severity: "moderate",
    issuedAt: "2026-06-28",
    affects: [{ ingredient: "oat flakes", affectedBatches: "OF-26-0709" }],
  },
  {
    id: "RC-2026-006",
    reason:
      "Foreign body: metal fragments up to 2 mm reported by two customers, traced to a worn sifter mesh.",
    severity: "moderate",
    issuedAt: "2026-05-30",
    affects: [{ ingredient: "cane sugar", affectedBatches: "CS-26-0520" }],
  },
];
