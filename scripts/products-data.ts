// Canonical Capilora Professional catalog — sourced from the product stickers (OCR).
// Prices are placeholders until real MRPs are set in the admin panel.

export interface SeedProduct {
  slug: string
  name: string
  tagline: string
  description: string
  benefits: string[]
  ingredients: string
  size: string
  mrp: number
  salePrice: number
  stock: number
  images: string[]
  badge?: string
  isFeatured: boolean
  category: "hair-care" | "skin-care"
  stickerFile: string
}

export const CATEGORIES = [
  {
    slug: "hair-care",
    name: "Hair Care",
    description:
      "Salon-grade shampoos, conditioners and treatments engineered for stronger, healthier hair.",
  },
  {
    slug: "skin-care",
    name: "Skin Care",
    description:
      "Dermat-friendly serums, cleansers and suncare powered by proven, professional actives.",
  },
]

export const PRODUCTS: SeedProduct[] = [
  {
    slug: "water-resistant-sunscreen-spf-50",
    name: "Water Resistant Sunscreen SPF 50",
    tagline: "Broad-spectrum mineral sun defence, built to last.",
    description:
      "A lightweight, water-resistant SPF 50 sunscreen built on Zinc Oxide for broad-spectrum UVA/UVB protection. The silky silicone base glides on weightless with no white cast — perfect for daily use under makeup or long days outdoors.",
    benefits: [
      "SPF 50 broad-spectrum UVA/UVB protection",
      "Water-resistant, sweat-friendly formula",
      "Mineral Zinc Oxide filter — gentle on sensitive skin",
      "Weightless silky finish with no white cast",
    ],
    ingredients:
      "Cyclopentasiloxane & Dimethicone/Vinyl Dimethicone Crosspolymer, Zinc Oxide & Coco-caprylate/Caprate & Polyglyceryl-3 Polyricinoleate & Isostearic Acid, Phenoxyethanol & Ethylhexylglycerin, Fragrance.",
    size: "30 ml",
    mrp: 499,
    salePrice: 399,
    stock: 60,
    images: [],
    badge: "New",
    isFeatured: true,
    category: "skin-care",
    stickerFile: "WhatsApp Image 2026-09-07 at 10.29.47 PM (1).jpeg",
  },
  {
    slug: "vitamin-c-face-serum",
    name: "Vitamin C Face Serum",
    tagline: "Stable Vitamin C glow with deep hydration.",
    description:
      "A brightening daily serum pairing stabilised Vitamin C (AA2G — Ascorbic Acid 2-Glucoside) with Hyaluronic Acid and Moroccan Argan Oil. It visibly evens skin tone, fades dark spots and locks in moisture, while Undecylenoyl Phenylalanine helps reduce pigmentation at the source.",
    benefits: [
      "Stabilised Vitamin C (AA2G) for lasting radiance",
      "Hyaluronic Acid for multi-level hydration",
      "Moroccan Argan Oil + Vitamin E nourishment",
      "Targets dark spots & uneven tone",
    ],
    ingredients:
      "DM Water, Spring Water, Hydroxyethyl Cellulose, Ascorbic Acid 2-Glucoside (AA2G), Moroccan Argan Oil, Hyaluronic Acid, Triethanolamine, Vitamin E, Phenoxyethanol (and) Ethylhexylglycerin, Undecylenoyl Phenylalanine, Fragrance.",
    size: "30 ml",
    mrp: 799,
    salePrice: 649,
    stock: 50,
    images: [],
    badge: "Bestseller",
    isFeatured: true,
    category: "skin-care",
    stickerFile: "WhatsApp Image 2026-09-07 at 10.29.47 PM (2).jpeg",
  },
  {
    slug: "dandruff-control-shampoo",
    name: "Dandruff Control Shampoo — Flake Fighter",
    tagline: "Proven anti-dandruff actives. Zero flakes.",
    description:
      "A professional anti-dandruff shampoo with Piroctone Olamine — the gentle, clinically proven alternative to ZPTO — plus Salicylic Acid to exfoliate flakes and Dimethylsilanol Hyaluronate to keep the scalp balanced and hydrated. Powerful on dandruff, kind to hair.",
    benefits: [
      "Piroctone Olamine fights dandruff at the source",
      "Salicylic Acid gently exfoliates flakes",
      "Hydrates the scalp — no itch, no dryness",
      "Paraben Free & Cruelty Free",
    ],
    ingredients:
      "DM Water, Glycerine, Acrylic Copolymer, Piroctone Olamine, Salicylic Acid, Dimethylsilanol Hyaluronate, Dimethiconol and TEA-Dodecylbenzenesulfonate, Ethylhexylglycerin (and) Phenoxyethanol, Fragrance.",
    size: "200 ml",
    mrp: 599,
    salePrice: 499,
    stock: 70,
    images: [],
    isFeatured: true,
    category: "hair-care",
    stickerFile: "WhatsApp Image 2026-09-07 at 10.29.47 PM.jpeg",
  },
  {
    slug: "foaming-face-wash",
    name: "Foaming Face Wash",
    tagline: "Sulphate-free foam that respects your skin barrier.",
    description:
      "A cloud-soft foaming cleanser built on Apple Amino Acids and French Spring Water. Salicylic Acid keeps pores clear, Hyaluronic Acid and D-Panthenol maintain moisture, and AA2G Vitamin C starts brightening from the very first wash.",
    benefits: [
      "Sulphate-free — no tight, stripped feeling",
      "Apple Amino Acids cleanse gently & thoroughly",
      "Salicylic Acid keeps pores clear",
      "Hyaluronic Acid + D-Panthenol barrier care",
    ],
    ingredients:
      "DM Water, French Spring Water, Sodium Cocoyl Apple Amino Acids, Vitamin E, Sodium Laurylglucosides Hydroxypropylsulfonate, Sodium Lauroyl Sarcosinate, Salicylic Acid, Sodium Cocoyl Glycinate, Xylitylglucoside (and) Anhydroxylitol (and) Xylitol, Hyaluronic Acid, D-Panthenol, Ascorbic Acid 2-Glucoside, Phenoxyethanol and Ethylhexyl Glycerine, Fragrance.",
    size: "150 ml",
    mrp: 449,
    salePrice: 349,
    stock: 80,
    images: [],
    isFeatured: true,
    category: "skin-care",
    stickerFile: "WhatsApp Image 2026-09-07 at 10.29.48 PM (1).jpeg",
  },
  {
    slug: "acne-control-face-serum",
    name: "AC Face Serum — Acne Control",
    tagline: "Salicylic Acid + Tea Tree + Niacinamide.",
    description:
      "A fast-absorbing anti-acne serum combining keratolytic Salicylic Acid, purifying Tea Tree Oil and oil-balancing Niacinamide, calmed by Aloe Vera and D-Panthenol. Visibly reduces active breakouts, unclogs pores and fades post-acne marks over time.",
    benefits: [
      "Salicylic Acid unclogs & refines pores",
      "Tea Tree Oil calms active breakouts",
      "Niacinamide balances oil & fades marks",
      "Aloe Vera + D-Panthenol soothe redness",
    ],
    ingredients:
      "DM Water, EDTA, 1,3-Butylene Glycol, Salicylic Acid, Tea Tree Oil, Niacinamide, Aloe Vera Extract, D-Panthenol, Polyacrylate Crosspolymer-6, Phenoxyethanol (and) Ethylhexylglycerin.",
    size: "30 ml",
    mrp: 699,
    salePrice: 549,
    stock: 55,
    images: [],
    isFeatured: false,
    category: "skin-care",
    stickerFile: "WhatsApp Image 2026-09-07 at 10.29.48 PM.jpeg",
  },
  {
    slug: "hair-fall-control-conditioner",
    name: "Hair Fall Control Conditioner",
    tagline: "Strength therapy with Vitamin E, Niacinamide & B5.",
    description:
      "A rich, salon-strength conditioner formulated to reduce hair fall due to breakage. Niacinamide and Vitamin C nourish the scalp, D-Panthenol (Pro-Vitamin B5) fortifies every strand, and Vitamin E shields hair from environmental stress — for visibly stronger, fuller hair.",
    benefits: [
      "Reduces hair fall due to breakage",
      "Niacinamide + Vitamin C scalp nutrition",
      "D-Panthenol strengthens & thickens strands",
      "Vitamin E antioxidant protection",
    ],
    ingredients:
      "DM Water, EDTA 2Na, Cetostearyl Alcohol, Cetyl Alcohol, Glyceryl Stearate (and) PEG-100 Stearate, Glycerine, Caprylic/Capric Triglyceride, Capryloyl/Caproyl Methyl Glucamide, Niacinamide, D-Panthenol, Vitamin C, Perlite, Zinc Oxide, Xylitylglucoside (and) Anhydroxylitol (and) Xylitol, Phenoxyethanol & Ethylhexylglycerin, Fragrance.",
    size: "200 ml",
    mrp: 599,
    salePrice: 499,
    stock: 65,
    images: [],
    isFeatured: true,
    category: "hair-care",
    stickerFile: "WhatsApp Image 2026-09-07 at 10.29.49 PM (1).jpeg",
  },
  {
    slug: "intense-underarm-cream",
    name: "Intense Underarm Cream",
    tagline: "Brightening care for delicate underarm skin.",
    description:
      "A gentle yet effective brightening cream for underarms, elbows and knees. Glycolic Acid renews, Undecylenoyl Phenylalanine targets stubborn pigmentation, and Shea Butter with Water Lily Extract keeps delicate skin calm, smooth and comfortable.",
    benefits: [
      "Glycolic Acid gently renews dark skin",
      "Targets stubborn pigmentation at the source",
      "Shea Butter deep, non-sticky moisturisation",
      "Caviar Lime + Water Lily soothe & smooth",
    ],
    ingredients:
      "DM Water, French Spring Water, Cetearyl Alcohol (and) Cetearyl Glucoside, Glyceryl Stearate (and) PEG-100 Stearate, Cetyl Alcohol, Shea Butter, Undecylenoyl Phenylalanine, Triethylamine, Glycolic Acid, Xanthan Gum, Sodium Palmitoyl Proline (and) Nymphaea Alba Flower Extract, Glycerin (and) Water (and) Microcitrus Australasica Fruit Extract, Ethylhexyl Glycerine (and) Phenoxyethanol, Fragrance.",
    size: "50 ml",
    mrp: 549,
    salePrice: 449,
    stock: 45,
    images: [],
    isFeatured: false,
    category: "skin-care",
    stickerFile: "WhatsApp Image 2026-09-07 at 10.29.49 PM.jpeg",
  },
  {
    slug: "deep-repair-hair-mask",
    name: "Deep Repair Hair Mask",
    tagline: "Intensive salon repair, powered by Vitamin E.",
    description:
      "A weekly deep-conditioning mask that rebuilds dry, chemically-treated and heat-damaged hair. Vitamin E and emollient-rich conditioners restore softness and shine, reducing breakage and split ends after the very first use.",
    benefits: [
      "Deep repair for damaged & treated hair",
      "Vitamin E restores shine & softness",
      "Reduces breakage & split ends",
      "Salon-grade weekly treatment",
    ],
    ingredients:
      "DM Water, Cetostearyl Alcohol, Glycerine, Caprylic/Capric Triglyceride, Vitamin E, Phenoxyethanol & Ethylhexylglycerin, Fragrance.",
    size: "200 g",
    mrp: 699,
    salePrice: 549,
    stock: 40,
    images: [],
    isFeatured: true,
    category: "hair-care",
    stickerFile: "WhatsApp Image 2026-09-07 at 10.29.50 PM.jpeg",
  },
]

export const DEFAULT_SETTINGS: Record<string, string> = {
  announcement: "Free shipping on orders above ₹499  •  Cash on Delivery available",
  contactPhone: "+91 82628 56278",
  contactWhatsApp: "918262856278",
  contactEmail: "bhors527@gmail.com",
  contactAddress:
    "Marketed by Capilora Professional  •  Mfd. by Purete Laboratoire, Surat - 395009, Gujarat, India  •  Mfg. Lic. No: GC-1473",
  freeShipThreshold: "499",
  shippingFee: "49",
}

export const COUPONS = [
  { code: "WELCOME10", type: "PERCENT", value: 10, minOrder: 0 },
  { code: "FLAT100", type: "FLAT", value: 100, minOrder: 599 },
  { code: "HAIR20", type: "PERCENT", value: 20, minOrder: 999 },
]
