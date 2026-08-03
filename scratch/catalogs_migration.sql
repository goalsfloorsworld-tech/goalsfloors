CREATE TABLE page_catalogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    image TEXT,
    meta_title TEXT,
    meta_description TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO page_catalogs (name, slug, url, image, meta_title, meta_description, seo_keywords) VALUES
(
    'Upfit Panels Catalog',
    'upfit-panels',
    'https://res.cloudinary.com/def2qsxjg/image/upload/v1781782510/Goals_Floors_Upfit_Panels_Catalogue.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1781695284/Upfit_Panels_Premium_Quality.jpg',
    'Upfit Panels Catalog | Premium Exterior Ceilings in Gurgaon',
    'Download the official Goals Floors Upfit Panels catalog. Explore dimensions, pricing, and premium exterior waterproof ceiling designs in Gurgaon & Delhi NCR.',
    'Upfit panels, exterior ceiling panels, balcony ceiling, waterproof ceiling Gurgaon'
  ),
(
    'Primo Series Catalog',
    'primo-series',
    '/api/pdf?file=Goals Floors PRIMO SERIES.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785046867/Goals_Floors_PRIMO_SERIES.jpg',
    'Primo Series Wall Panels Catalog | Premium Interior Cladding | Goals Floors™',
    'Download the Goals Floors™ Primo Series catalog. Explore our exclusive range of premium interior wall panels designed for modern, luxurious architectural spaces.',
    'Primo series, premium interior cladding, luxury wall panels, modern interior surfaces'
  ),
(
    'Baffle Ceiling Catalog',
    'baffle-ceiling',
    '/api/pdf?file=Goals Floors™ Baffle Ceiling.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785044629/Goals_Floors_Baffle_Ceiling.png',
    'Baffle Ceiling Systems Catalog | Acoustic & Linear Ceilings | Goals Floors™',
    'Explore our Baffle Ceiling catalog by Goals Floors™. Discover high-performance linear and acoustic ceiling systems perfect for commercial and modern residential designs.',
    'Baffle ceiling, acoustic ceilings, linear ceiling systems, commercial ceiling design'
  ),
(
    'Elite Panel Catalog',
    'elite-panel',
    '/api/pdf?file=Goals Floors™ Elite Panel.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785044633/Goals_Floors_Elite_Panel.jpg',
    'Elite Panel Catalog | Luxury Fluted & Flat Panels | Goals Floors™',
    'Download the Elite Panel catalog. Browse Goals Floors™ premium collection of luxury wall panels, featuring durable finishes and sophisticated textures for interiors.',
    'Elite panel, luxury fluted panels, interior wall cladding, decorative interior panels'
  ),
(
    'Exterior Louvers Catalog',
    'exterior-louvers',
    '/api/pdf?file=Goals Floors™ Exterior Louvers.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785044647/Goals_Floors_Exterior_Louvers.jpg',
    'Exterior Louvers & Facades Catalog | Weatherproof Cladding | Goals Floors™',
    'View the Goals Floors™ Exterior Louvers catalog. Discover highly durable, UV-resistant, and weatherproof louver systems designed to elevate modern building facades.',
    'Exterior louvers, weatherproof cladding, building facades, UV resistant louvers'
  ),
(
    'Flute Panel Catalog',
    'flute-panel',
    '/api/pdf?file=Goals Floors™ Flute Panel.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785044596/Goals_Floors_Flute_Panel.jpg',
    'Flute Panel Catalog | Designer Fluted Wall Cladding | Goals Floors™',
    'Download our Flute Panel catalog. Goals Floors™ offers trend-setting fluted wall cladding solutions to add 3D texture, depth, and elegance to any interior space.',
    'Flute panel, designer fluted cladding, 3D texture wall panels, interior elegance'
  ),
(
    'SPC Flooring Catalog',
    'spc-flooring',
    '/api/pdf?file=Goals Floors™ Spc Flooring .pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785044610/Goals_Floors_Spc_Flooring.jpg',
    'SPC Flooring Catalog | 100% Waterproof Rigid Core Floors | Goals Floors™',
    'Browse the Goals Floors™ SPC Flooring catalog. Discover our 100% waterproof, highly durable, and scratch-resistant Stone Plastic Composite flooring options.',
    'SPC flooring, waterproof flooring, rigid core floors, scratch resistant composite flooring'
  ),
(
    'Timber Tubes Catalog',
    'timber-tubes',
    '/api/pdf?file=Goals Floors™ Timber Tubes.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785044610/Goals_Floors_Timber_Tubes.jpg',
    'Timber Tubes Catalog | Architectural Partition Systems | Goals Floors™',
    'Explore the Timber Tubes catalog by Goals Floors™. Innovative hollow timber tube profiles designed for stunning ceilings, room dividers, and modern architectural partitions.',
    'Timber tubes, architectural partitions, hollow timber ceiling, modern room dividers'
  ),
(
    'Tokyo Moulding Catalog',
    'tokyo-moulding',
    '/api/pdf?file=Goals Floors™ Tokyo Moulding.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785044636/Goals_Floors_Tokyo_Moulding.jpg',
    'Tokyo Moulding Catalog | Decorative Architectural Profiles | Goals Floors™',
    'Download the Tokyo Moulding catalog. Discover Goals Floors™ collection of precision-crafted decorative mouldings for seamless and elegant interior transitions.',
    'Tokyo moulding, decorative profiles, architectural mouldings, seamless interior transitions'
  ),
(
    'Versaflute Catalog',
    'versaflute',
    '/api/pdf?file=Goals Floors™ VERSAFLUTE.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785044650/Goals_Floors_VERSAFLUTE.jpg',
    'VERSAFLUTE Catalog | Versatile Fluted Cladding Solutions | Goals Floors™',
    'View the VERSAFLUTE catalog by Goals Floors™. Highly adaptable, flexible, and premium fluted panel systems designed for creative architectural installations.',
    'VERSAFLUTE, versatile fluted cladding, flexible fluted panels, creative architectural installations'
  ),
(
    'Versapanel Catalog',
    'versapanel',
    '/api/pdf?file=Goals Floors™ VERSAPANEL.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785044675/Goals_Floors_VERSAPANEL.jpg',
    'VERSAPANEL Catalog | Heavy-Duty Interior Wall Panels | Goals Floors™',
    'Download the VERSAPANEL catalog. Goals Floors™ provides durable, easy-to-install, and stylish interior paneling solutions for high-traffic and commercial spaces.',
    'VERSAPANEL, heavy duty interior panels, commercial wall paneling, durable stylish cladding'
  ),
(
    'Versasheet Catalog',
    'versasheet',
    '/api/pdf?file=Goals Floors™ VERSASHEET.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785044662/Goals_Floors_VERSASHEET.jpg',
    'VERSASHEET Catalog | UV PVC Marble Alternative Sheets | Goals Floors™',
    'Explore the VERSASHEET catalog. Discover Goals Floors™ premium stone and marble alternative UV PVC cladding sheets for a luxurious, cost-effective interior finish.',
    'VERSASHEET, UV PVC sheets, marble alternative cladding, luxurious interior finish'
  ),
(
    'WPC Decking Catalog',
    'wpc-decking',
    '/api/pdf?file=Goals Floors™ Wpc Decking.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785046857/Goals_Floors_Wpc_Decking_1.jpg',
    'WPC & Co-Extrusion Decking Catalog | Premium Outdoor Floors | Goals Floors™',
    'Download the WPC Decking catalog. Explore our advanced Co-Extrusion (CEO) decking and Wood Plastic Composite solutions for durable, weather-resistant outdoor living spaces.',
    'WPC decking, co-extrusion outdoor floors, weather resistant composite, durable outdoor living'
  ),
(
    'Rustic Royal Oak 12MM',
    'rustic-royal-oak',
    '/api/pdf?file=Goals Floors Rustic Royal Oak 12MM Laminate Flooring.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038414/Goals_Floors_Rustic_Royal_Oak_12MM_Laminate_Flooring.jpg',
    'Rustic Royal Oak 12MM Laminate Flooring Catalog | Goals Floors™',
    'Download the Rustic Royal Oak 12MM Laminate Flooring catalog. Explore premium AC5-rated laminate designs with authentic wood textures for high-end interiors.',
    'Rustic royal oak, 12mm laminate flooring, premium AC5 laminate, authentic wood texture'
  ),
(
    'Radiant Lamiwood AC5',
    'radiant-lamiwood',
    '/api/pdf?file=Goals Floors Radiant_Lamiwood AC5 12mm Made in Germany.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038351/Goals_Floors_Radiant_Lamiwood_AC5_12mm_Made_in_Germany.png',
    'Radiant Lamiwood AC5 12mm Catalog | German Laminate | Goals Floors™',
    'Explore the Radiant Lamiwood catalog. High-performance, German-made AC5 12mm laminate flooring offering unmatched durability and elegant aesthetics.',
    'Radiant lamiwood, AC5 12mm laminate, German made flooring, durable laminate aesthetics'
  ),
(
    'Majesty Grande & Oak Artisan',
    'majesty-grande',
    '/api/pdf?file=Goals Floors Majesty Grande & Oak Artisan Catalogue.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038227/Goals_Floors_Majesty_Grande_Oak_Artisan_Catalogue.png',
    'Majesty Grande & Oak Artisan Catalog | Luxury Floors | Goals Floors™',
    'Download the Majesty Grande & Oak Artisan catalog by Goals Floors™. Discover luxurious, handcrafted-style laminate flooring for sophisticated spaces.',
    'Majesty grande, oak artisan flooring, luxury laminate, handcrafted style floors'
  ),
(
    'Majestic Lamiwood AC4',
    'majestic-lamiwood',
    '/api/pdf?file=Goals Floors Majestic_Lamiwood AC4 8mm Made in Germany.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038231/Goals_Floors_Majestic_Lamiwood_AC4_8mm_Made_in_Germany.png',
    'Majestic Lamiwood AC4 8mm Catalog | German Flooring | Goals Floors™',
    'View the Majestic Lamiwood catalog. Premium German-made AC4 8mm laminate flooring perfect for stylish, modern residential and light commercial use.',
    'Majestic lamiwood, AC4 8mm laminate, German flooring, stylish residential laminate'
  ),
(
    'Herringbone 12mm AC5',
    'herringbone-12mm',
    '/api/pdf?file=Goals Floors Herringbone 12mm - AC5 Laminated Flooring.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785052449/15._Herringbone_12mm_-_AC5_Laminated_Flooring.pdf.jpg',
    'Herringbone 12mm AC5 Laminate Catalog | Premium Floors | Goals Floors™',
    'Download the Herringbone 12mm AC5 Laminate catalog. Elevate your interiors with classic herringbone patterns combined with ultra-durable AC5 performance.',
    'Herringbone 12mm, AC5 laminated flooring, classic herringbone patterns, durable interior floors'
  ),
(
    'Heritage 12mm Laminate',
    'heritage-laminate',
    '/api/pdf?file=Goals Floors Heritage 12mm Laminate Flooring Catalogue.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038249/Goals_Floors_Heritage_12mm_Laminate_Flooring_Catalogue.png',
    'Heritage 12mm Laminate Flooring Catalog | Goals Floors™',
    'Explore the Heritage 12mm Laminate Flooring catalog. Timeless wood-look designs engineered for superior strength and lasting beauty in any room.',
    'Heritage 12mm laminate, timeless wood look floors, superior strength flooring, lasting beauty'
  ),
(
    'Herringbone Marvel Collection',
    'herringbone-marvel',
    '/api/pdf?file=Goals Floors HERRINGBONE 8mm Marvel COLLECTION.pdf.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785037907/Goals_Floors_HERRINGBONE_8mm_Marvel_COLLECTION.png',
    'Herringbone 8mm Marvel Collection Catalog | Goals Floors™',
    'Discover the Herringbone 8mm Marvel Collection. Striking zigzag flooring patterns in a practical 8mm thickness, bringing architectural elegance to your home.',
    'Herringbone 8mm marvel, zigzag flooring patterns, architectural elegance floors, 8mm laminate'
  ),
(
    'Foundation AC4 8mm',
    'foundation-laminate',
    '/api/pdf?file=Goals Floors Foundation AC4 8mm Laminated Flooring.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785044675/Goals_Floors_Foundation_AC4_8mm_Laminated_Flooring.png',
    'Foundation AC4 8mm Laminate Catalog | Reliable Floors | Goals Floors™',
    'Download the Foundation AC4 8mm Laminate catalog. Build your space on a solid foundation of reliable, stylish, and cost-effective laminated flooring.',
    'Foundation AC4 8mm, reliable laminated floors, stylish flooring, cost effective laminate'
  ),
(
    'Velora 8 Planks',
    'velora-planks',
    '/api/pdf?file=Goals Floors Velora 8 PLanks Catalogue.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038268/Goals_Floors_Velora_8_PLanks_Catalogue.png',
    'Velora 8 Planks Catalog | Premium Laminate Planks | Goals Floors™',
    'View the Velora 8 Planks catalog. Discover beautifully crafted 8mm laminate planks designed to bring natural warmth and modern style to your interiors.',
    'Velora 8 planks, premium laminate planks, natural warmth flooring, modern interior styles'
  ),
(
    'Leopoldo 8',
    'leopoldo-catalogue',
    '/api/pdf?file=Goals Floors leopoldo 8 catalogue.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038161/Goals_Floors_leopoldo_8_catalogue.jpg',
    'Leopoldo 8 Catalog | Designer Laminate Floors | Goals Floors™',
    'Download the Leopoldo 8 catalog by Goals Floors™. Explore distinctive textures and rich color palettes in our premium 8mm designer laminate collection.',
    'Leopoldo 8, designer laminate floors, distinctive floor textures, rich laminate colors'
  ),
(
    'Mosaique 8',
    'mosaique-catalogue',
    '/api/pdf?file=Goals Floors mosaique 8 catalogue.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038234/Goals_Floors_mosaique_8_catalogue.png',
    'Mosaique 8 Catalog | Artistic Laminate Flooring | Goals Floors™',
    'Explore the Mosaique 8 catalog. Introduce artistic flair and exceptional durability to your floors with our unique 8mm Mosaique laminate series.',
    'Mosaique 8, artistic laminate flooring, unique floor designs, durable 8mm laminate'
  ),
(
    'Opulent and Refined',
    'opulent-refined',
    '/api/pdf?file=Goals Floors Opulent and refined Catalogue.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038229/Goals_Floors_Opulent_and_refined_Catalogue.png',
    'Opulent & Refined Catalog | Ultra Luxury Flooring | Goals Floors™',
    'Download the Opulent & Refined catalog. Step into luxury with Goals Floors™ exclusive collection of high-end, exquisitely crafted flooring solutions.',
    'Opulent refined, ultra luxury flooring, high end floors, exquisitely crafted laminate'
  ),
(
    'Panorama Collection',
    'panorama-collection',
    '/api/pdf?file=Goals Floors Panorama Collection.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038296/Goals_Floors_Panorama_Collection.png',
    'Panorama Collection Catalog | Wide Plank Flooring | Goals Floors™',
    'Discover the Panorama Collection catalog. Expansive, wide-plank designs that visually open up your spaces while providing robust everyday performance.',
    'Panorama collection, wide plank flooring, expansive floor designs, robust performance laminate'
  ),
(
    'Reserve Collection',
    'reserve-collection',
    '/api/pdf?file=Goals Floors RESERVE.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038311/Goals_Floors_RESERVE.png',
    'Reserve Collection Catalog | Exclusive Laminate | Goals Floors™',
    'View the Goals Floors™ Reserve catalog. Our most exclusive, small-batch curated flooring collection for discerning homeowners and designers.',
    'Reserve collection, exclusive laminate, curated flooring, designer laminate series'
  ),
(
    'Herringbone 3.0 Pietra',
    'herringbone-pietra',
    '/api/pdf?file=Goals Floors Herringbone 3.0 Pietra Collection.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785046866/Goals_Floors_Herringbone_3.0_Pietra_Collection.jpg',
    'Herringbone 3.0 Pietra Catalog | Stone Finish Floors | Goals Floors™',
    'Download the Herringbone 3.0 Pietra Collection. The perfect fusion of classic herringbone layouts with striking, modern stone-finish aesthetics.',
    'Herringbone 3.0 pietra, stone finish floors, modern herringbone layout, striking floor aesthetics'
  ),
(
    'Immenso and Livanti',
    'immenso-livanti',
    '/api/pdf?file=Goals Floors Immenso and Livanti Catalogue.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038258/Goals_Floors_Immenso_and_Livanti_Catalogue.jpg',
    'Immenso & Livanti Catalog | Grand Flooring Designs | Goals Floors™',
    'Explore the Immenso and Livanti catalog. Grand, oversized planks featuring hyper-realistic natural wood details for a truly majestic interior space.',
    'Immenso livanti, grand flooring designs, oversized laminate planks, hyper realistic wood floors'
  ),
(
    'Basic Collection',
    'basic-collection',
    '/api/pdf?file=Goals Floors Basic Collection.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038420/Goals_Floors_Basic_Collection.jpg',
    'Basic Collection Catalog | Essential Laminate Floors | Goals Floors™',
    'Download the Basic Collection catalog. High-quality, essential laminate flooring offering great value, easy installation, and clean, timeless looks.',
    'Basic collection, essential laminate floors, high quality value flooring, easy installation laminate'
  ),
(
    'Chevron Collection',
    'chevron-collection',
    '/api/pdf?file=Goals Floors Chevron collection.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038390/Goals_Floors_Chevron_collection.png',
    'Chevron Collection Catalog | V-Pattern Luxury Floors | Goals Floors™',
    'Discover the Chevron Collection. Add instant architectural prestige to your home with precise, continuous V-pattern luxury laminate flooring.',
    'Chevron collection, v pattern luxury floors, architectural prestige flooring, continuous chevron layout'
  ),
(
    'Elevate AC5 8mm',
    'elevate-ac5',
    '/api/pdf?file=Goals Floors Elevate AC5 8mm.pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038407/Goals_Floors_Elevate_AC5_8mm.jpg',
    'Elevate AC5 8mm Catalog | High Traffic Laminate | Goals Floors™',
    'View the Elevate AC5 8mm catalog by Goals Floors™. Commercial-grade AC5 durability packed into a sleek 8mm profile for high-traffic environments.',
    'Elevate AC5 8mm, high traffic laminate, commercial grade durability, sleek profile floors'
  ),
(
    'Fortezza 8',
    'fortezza-catalogue',
    '/api/pdf?file=Goals Floors Fortezza 8 Catalogue .pdf',
    'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1785038211/Goals_Floors_Fortezza_8_Catalogue.png',
    'Fortezza 8 Catalog | Fortified Laminate Planks | Goals Floors™',
    'Download the Fortezza 8 catalog. Built for resilience, this collection offers fortified 8mm laminate planks that resist wear while looking spectacular.',
    'Fortezza 8, fortified laminate planks, resilient flooring, wear resistant laminate'
  );