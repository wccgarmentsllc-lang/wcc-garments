export const DEFAULT_BULK_OFFER = {
  enabled: true,
  tagText: "Bulk Garments Order",
  headingStart: "Exclusive Discounts on Bulk Garment",
  headingHighlight: "Orders",
  description: "Large-scale premium clothing production for brands, wholesalers, and businesses with top-quality materials and reliable delivery.",
  discountPercentage: 25,
  discountText: "Flat Discount",
  discountSubText: "On orders above 500 pieces",
  offerEndDate: "June 30, 2026",
  buttonText: "Get Quote",
  slideImages: [
    "/images/bulkoffer/premium_hoodie.png",
    "/images/bulkoffer/premium_jeans.png",
    "/images/bulkoffer/premium_shirt.png",
  ]
}

export const DEFAULT_HERO = {
  campaigns: [
    {
      id: 1,
      center: "/images/products/egyptian_cotton_shirt.png",
      left: "/images/products/cargo_work_pants.png",
      right: "/images/products/chef_uniform.png",
      title: "Industrial Elegance",
      tag: "Campaign 2026"
    },
    {
      id: 2,
      center: "/images/products/hotel_bed_linen.png",
      left: "/images/products/luxury_bath_towels.png",
      right: "/images/products/egyptian_cotton_shirt.png",
      title: "Hospitality & Bedding",
      tag: "Luxury Suite"
    },
    {
      id: 3,
      center: "/images/products/chef_uniform.png",
      left: "/images/products/cargo_work_pants.png",
      right: "/images/products/hotel_bed_linen.png",
      title: "Professional Workwear",
      tag: "Corporate Uniforms"
    }
  ]
}

export const DEFAULT_WHO_WE_ARE = {
  heritageLabel: "Corporate Heritage",
  heading: "WCC FASHIONS",
  subHeading: "Established 2001",
  paragraphs: [
    "Western Clothing Company (WCC Fashions LLC) is a premier UAE-based industrial fashion manufacturing group.",
    "Operating out of our advanced Dubai manufacturing infrastructure, we deliver end-to-end commercial solutions—from precision pattern CAD and fabric sourcing to full-scale container export across 50+ nations worldwide.",
    "Our multi-division capabilities bridge high-end fashion garments, heavy-duty industrial workwear, luxury hotel linens, and authentic Arabian fragrances under strict ISO quality benchmarks."
  ],
  mainImage: "/images/about wcc.png",
  floatingBadgeTitle: "Certified Standards",
  floatingBadgeDesc: "ISO 9001:2015 / OEM Export Grade",
  stats: [
    { value: 25, suffix: "+", label: "Years Expertise", desc: "Unrivaled manufacturing history and procurement experience since our Dubai inception." },
    { value: 50, suffix: "+", label: "Export Nations", desc: "Active global distribution networks spanning GCC, Africa, Europe, and the Americas." },
    { value: 10, suffix: "K+", label: "Monthly Capacity", desc: "Industrial-scale output supporting massive tenders and commercial supply chains." }
  ]
}

export const DEFAULT_GARMENTS = {
  indicator: "OUR MANUFACTURING DIVISIONS",
  headingStart: "Garments we ",
  headingHighlight: "manufacture",
  description: "High-quality garments, linens, and B2B supplies crafted with precision. While garments remain our absolute core business, we have successfully expanded our industrial capacities to serve major developments in hospitality, home decor, fragrance, and household supply.",
  categories: [
    { name: 'Shirts', slug: 'shirts', tagline: 'Crisp, premium tailored fits', count: '140+ Styles', image: '/images/formal-shirts.png' },
    { name: 'T-Shirts', slug: 't-shirts', tagline: 'High-comfort mercerized cotton', count: '320+ Styles', image: '/images/polo tshirts.png' },
    { name: 'Jeans', slug: 'jeans', tagline: 'Durable premium industrial denim', count: '210+ Styles', image: '/images/jeans-denims.png' },
    { name: 'Trousers', slug: 'trousers', tagline: 'Perfect fit corporate trousers', count: '110+ Styles', image: '/images/trousers.png' },
    { name: 'Cargos', slug: 'cargos', tagline: 'Heavy-duty utility cargo workwear', count: '95+ Styles', image: '/images/products/cargo_work_pants.png' },
    { name: 'Track Pants', slug: 'track-pants', tagline: 'Active performance leisure wear', count: '85+ Styles', image: '/images/Blazers and suits.png' },
  ]
}

export const DEFAULT_HOUSEHOLDS = {
  indicator: "OUR HOUSEHOLD DIVISION",
  headingStart: "Household & ",
  headingHighlight: "Kitchenware",
  description: "Explore our premium kitchenware, culinary tools, and home essentials. In collaboration with Aanya Homecraft, we offer tri-ply cookware, artisan table serveware, and smart organization solutions for modern home and commercial kitchens.",
  categories: [
    { name: 'Triply Cookware', slug: 'cookware', tagline: 'Professional triply cookware for healthier, faster and even cooking', count: '100+ MOQ', image: '/images/hh-1.png' },
    { name: 'Premium Cutlery', slug: 'cutlery', tagline: 'Elegant stainless steel cutlery for refined everyday dining', count: '250+ MOQ', image: '/images/hh-2.png' },
    { name: 'Table & Serveware', slug: 'table-top', tagline: 'Stylish serveware to elevate presentation for every meal', count: '100+ MOQ', image: '/images/hh-3.png' },
    { name: 'Storage & Organizer', slug: 'utility', tagline: 'Smart storage and organizers to keep your kitchen clutter-free', count: '200+ MOQ', image: '/images/hh-4.png' }
  ]
}

export const DEFAULT_HOSPITALITY = {
  indicator: "HOSPITALITY DIVISION",
  headingStart: "Shop By ",
  headingHighlight: "Products",
  description: "Outfitting the world's finest hospitality with Horeca24h premium barware, commercial cookware, kitchen utensils, elegant table cutlery, and buffet serving solutions.",
  categories: [
    { name: 'Barware Products', slug: 'barware', tagline: 'Premium ice buckets, coolers & shaker tools', count: '100+ MOQ', image: '/images/hos-1.png' },
    { name: 'Cookware Products', slug: 'cookware', tagline: 'Professional triply stainless steel cook pots', count: '50+ MOQ', image: '/images/hos-2.png' },
    { name: 'Kitchen Tools', slug: 'kitchen-tools', tagline: 'High-end serving tongs and chef prep utensils', count: '200+ MOQ', image: '/images/hos-3.png' },
    { name: 'Table Cutlery', slug: 'cutlery', tagline: 'Mirror polished hotel-grade cutlery sets', count: '250+ MOQ', image: '/images/hos-4.png' },
    { name: 'Storage', slug: 'storage', tagline: 'Wire buffet baskets and wood serving trays', count: '150+ MOQ', image: '/images/hos-5.png' },
    { name: 'Serving', slug: 'serving', tagline: 'Elegant copper and stainless buffet serveware', count: '100+ MOQ', image: '/images/hos-3.png' }
  ]
}

export const DEFAULT_EXPANSION = {
  indicator: "OUR DIVERSIFIED FUTURE",
  headingStart: "Our Strategic",
  headingHighlight: "Expansion",
  description: "While premium garments remain our core business, we have successfully expanded our industrial capacities to serve major developments in uniforms, luxury hospitality textiles, home decor, fragrance, and household supply."
}

export const DEFAULT_DUBAI_PIPELINE = {
  indicator: "MANUFACTURING EXCELLENCE",
  headingStart: "The Dubai manufacturing ",
  headingHighlight: "pipeline",
  subHeading: "Five stages from raw textile to global distribution",
  scenes: [
    { step: '01', title: 'Textile Sourcing & Inspection', desc: 'Uncompromising raw material selection from global yarn mills, verified through rigorous tension and density diagnostics.', image: '/images/manufacturing-pipeline/textstyle sorcing.png' },
    { step: '02', title: 'Precision CAD Pattern Cutting', desc: 'Laser automated fabric slicing ensuring millimeter exactness across thousands of stacked textile layers simultaneously.', image: '/images/manufacturing-pipeline/2pipeline img.png' },
    { step: '03', title: 'Industrial Assembly & Stitching', desc: 'High-speed automated and artisan needlecraft producing reinforced seams engineered for extreme commercial endurance.', image: '/images/manufacturing-pipeline/3pipelineimg.png' },
    { step: '04', title: 'Flawless QA & Finishing', desc: 'Multi-stage optical and mechanical stress tests ensuring zero defects before garment pressing and sanitary enclosure.', image: '/images/manufacturing-pipeline/4pipelineimg.png' },
    { step: '05', title: 'Secure Enclosure & Export', desc: 'Containerized logistics departing from Jebel Ali Port, Dubai directly to corporate hubs and distributors in 50+ countries.', image: '/images/factory.jpeg' }
  ]
}

export const DEFAULT_NEWSLETTER = {
  backgroundImage: "/images/factory.jpeg",
  headline: "Receive exclusive B2B catalog releases, wholesale offers, and custom manufacturing updates across our garments, hospitality, and household divisions."
}

export const DEFAULT_ABOUT = {
  heroImage: "/images/about-hero.jpg",
  heroSince: "Since 2001",
  heroHeading: "25+ Years of Manufacturing Excellence",
  heroDescription: "Founded in Bangalore in 2001, WCC Fashions has grown into a global textile manufacturing partner with headquarters in Dubai. We operate 7 production facilities across 3 countries, delivering export-quality garments, uniforms, hospitality linens, home furnishings, and fragrances for B2B clients worldwide.",
  stats: [
    { value: "50+", label: "Countries" },
    { value: "7", label: "Production Facilities" },
    { value: "6", label: "Specialized Divisions" },
    { value: "25+", label: "Years Experience" }
  ],
  missionTitle: "Our Mission",
  missionDesc: "To provide businesses worldwide with reliable, scalable, and high-quality textile manufacturing solutions. We strive to simplify global procurement for our B2B partners through vertical integration, multi-country production, and an unwavering commitment to export-grade quality.",
  visionTitle: "Our Vision",
  visionDesc: "To be the most trusted global manufacturing partner for corporate, hospitality, and retail sectors, recognized for our quarter-century of expertise, ethical production standards, and ability to deliver exceptional value at an industrial scale.",
  footprintTitle: "Global Footprint",
  footprintDesc: "7 international production and sourcing locations across 3 countries, strategically headquartered in Dubai.",
  locations: [
    { country: 'UAE', city: 'Dubai', role: 'Global Headquarters', detail: 'Strategic hub for sales, customer relations, and export operations to GCC, Africa, and beyond.' },
    { country: 'India', city: '5 Production Centers', role: 'Primary Manufacturing', detail: 'Vertically integrated facilities across Ahmedabad, Ludhiana, Bangalore, Delhi, and Tirupur.' },
    { country: 'Bangladesh', city: 'Dhaka', role: 'Bulk Production', detail: 'High-volume, cost-effective manufacturing facility ensuring competitive pricing.' },
    { country: 'China', city: 'Guangzhou', role: 'Sourcing & Mfg', detail: 'Strategic sourcing operations and specialized raw material manufacturing.' }
  ],
  journeyTitle: "Our Journey",
  journeyDesc: "From our origins in Bangalore in 2001 to our current status as a Dubai-headquartered global manufacturing group, our 25-year journey has been defined by continuous expansion, uncompromised quality, and strong B2B partnerships.",
  timeline: [
    { year: '2001', event: 'WCC Fashions founded in Bangalore, India.' },
    { year: '2005', event: 'Expanded production to key textile hubs: Ahmedabad, Delhi, and Ludhiana.' },
    { year: '2010', event: 'Strategic shift of Headquarters to Dubai, UAE for global export reach.' },
    { year: '2014', event: 'Launched dedicated Uniforms & Workwear and Hospitality textile divisions.' },
    { year: '2018', event: 'International expansion with production facilities in Bangladesh and China.' },
    { year: '2022', event: 'Achieved major export milestones serving B2B clients across 50+ nations.' },
    { year: '2026', event: 'Celebrating 25+ years of industrial-scale manufacturing excellence.' }
  ],
  valuesTitle: "Our Core Values",
  values: [
    { title: 'Quality Assurance', desc: 'Export-grade quality standards in every stitch and thread.' },
    { title: 'Scale & Capability', desc: 'Industrial-scale manufacturing handling small programs to massive contracts.' },
    { title: 'Global Reach', desc: 'Manufacturing across 3 countries, supplying to businesses in 50+ nations.' },
    { title: 'Partnership Approach', desc: 'Building long-term relationships. We grow when you grow.' }
  ],
  galleryTitle: "Warehouse & Production Gallery",
  galleryDesc: "A glimpse into our manufacturing excellence, warehouse operations, and global production capabilities.",
  gallery: [
    { image: "/images/gallery/ourgalleryimage.png", title: "PREMIUM MATERIALS", subtitle: "OUR PROCESS" },
    { image: "/images/gallery/ourgalleryimage4.png", title: "PRECISE PRODUCTION", subtitle: "OUR PROCESS" },
    { image: "/images/gallery/ourgalleryimage3.png", title: "QUALITY ASSURED", subtitle: "OUR PROCESS" },
    { image: "/images/gallery/ourgalleryimage5.png", title: "PREMIUM MATERIALS", subtitle: "OUR PROCESS" }
  ]
}

export const DEFAULT_UNIFORMS = {
  indicator: "UNIFORMS DIVISION",
  headingStart: "Shop By ",
  headingHighlight: "Categories",
  description: "Professional uniform solutions for all sectors. From industrial cargo wear to tactical security suites — bulk uniform solutions engineered for performance and compliance.",
  categories: [
    { name: 'Corporate Workwear', slug: 'corporate-workwear', tagline: 'Premium executive suits, shirts and formal wear', count: '100+ MOQ', image: '/images/uniform-workwear.png' },
    { name: 'Security Attire', slug: 'security-attire', tagline: 'Tactical security uniforms, badges and safety gear', count: '80+ MOQ', image: '/images/uniform-workwear.png' },
    { name: 'Industrial & PPE', slug: 'industrial-ppe', tagline: 'High-visibility safety vests, boots and overalls', count: '120+ MOQ', image: '/images/uniform-workwear.png' },
    { name: 'Chef & Kitchen Wear', slug: 'chef-kitchen-wear', tagline: 'Professional double-breasted chef coats and caps', count: '90+ MOQ', image: '/images/uniform-workwear.png' },
    { name: 'Protective Aprons', slug: 'protective-aprons', tagline: 'Heavy-duty industrial and server waist aprons', count: '70+ MOQ', image: '/images/uniform-workwear.png' },
    { name: 'Medical & Scrubs', slug: 'medical-scrubs', tagline: 'High-comfort antibacterial medical doctor scrubs', count: '60+ MOQ', image: '/images/uniform-workwear.png' }
  ]
}

export const DEFAULT_HOME_SHOWCASE = {
  indicator: "HOME LINEN DIVISION",
  headingStart: "Shop By ",
  headingHighlight: "Categories",
  description: "Luxury home linen and furnishing textiles. Premium bedsheets, flat sheets, bath towels, and luxury throws — built for bulk retail and private-label distribution.",
  categories: [
    { name: 'Bedsheets', slug: 'bedsheets', tagline: 'Fitted sheets, flat sheets and pillow covers up to 600TC', count: '120+ MOQ', image: '/images/home furnishing.png' },
    { name: 'Bath Textiles', slug: 'bath-textiles', tagline: 'Plush ring-spun cotton bath towels and hand towels', count: '90+ MOQ', image: '/images/home furnishing.png' },
    { name: 'Luxury Throws', slug: 'luxury-throws', tagline: 'Cashmere throws and premium merino wool blankets', count: '80+ MOQ', image: '/images/home furnishing.png' },
    { name: 'Table Linen', slug: 'table-linen', tagline: 'Elegant table runners, linen placemats and napkins', count: '50+ MOQ', image: '/images/home furnishing.png' }
  ]
}

export const DEFAULT_FRAGRANCE = {
  indicator: "FRAGRANCE DIVISION",
  headingStart: "Shop By ",
  headingHighlight: "Categories",
  description: "Authentic Arabian Fragrances. Oud, Bakhoor, Eau de Parfum, and raw materials — crafted in the UAE for retail chains, duty-free operators, and private label buyers worldwide.",
  categories: [
    { name: 'Arabian Oud', slug: 'arabian-oud', tagline: 'Pure premium oud oil, warm woody blends and attar', count: '40+ MOQ', image: '/images/fragrance.png' },
    { name: 'Bakhoor & Incense', slug: 'bakhoor-incense', tagline: 'Aromatic home bakhoor chips, incense burners and coals', count: '35+ MOQ', image: '/images/fragrance.png' },
    { name: 'Eau de Parfum', slug: 'eau-de-parfum', tagline: 'Long lasting French and oriental designer perfumes', count: '60+ MOQ', image: '/images/fragrance.png' },
    { name: 'Private Label', slug: 'private-label', tagline: 'Custom perfume bottle design, outer box and labels', count: '20+ MOQ', image: '/images/fragrance.png' },
    { name: 'Raw Materials', slug: 'raw-materials', tagline: 'High-grade perfume ingredients, essential oils and bases', count: '15+ MOQ', image: '/images/fragrance.png' }
  ]
}

