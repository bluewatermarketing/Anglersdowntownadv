/* ──────────────────────────────────────────────────────────
   STRUCTURED DATA (JSON-LD) — Angler Watersports

   Schema.org markup describing Angler Watersports as a local
   water-sports rental business. Helpers below are consumed by
   individual pages to attach service/FAQ/breadcrumb schema.

   Independence note: this site is deliberately kept SEO-independent
   from any other brand. Do not add alternateName, sameAs, or
   cross-references to other business identities.
   ────────────────────────────────────────────────────────── */

import {
  ADDRESS,
  ADDRESS_URL,
  PHONE,
  EMAIL,
  BOOKING_URL,
  SOCIAL,
  SITE_NAME,
  SITE_URL,
  GEO,
} from "@/lib/constants";

const BUSINESS_ID = `${SITE_URL}/#business`;

/* sameAs accepts only real URLs. Filter out any empty strings until the
   Angler social accounts go live. */
const sameAsLinks = [SOCIAL.instagram, SOCIAL.facebook, SOCIAL.tiktok].filter(
  (u): u is string => !!u && u.length > 0
);

/* ── LocalBusiness + TouristAttraction schema ── */
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "TouristAttraction", "SportsActivityLocation"],
  "@id": BUSINESS_ID,
  name: SITE_NAME,
  description:
    "Jet ski and pontoon boat rentals in downtown Ocean City, Maryland. Guided jet ski tours and self-captained pontoon cruises on Assateague Bay. See wild horses, dolphins, and stunning sunsets. Brand-new 2026 fleet, free parking.",
  url: SITE_URL,
  telephone: PHONE,
  email: EMAIL,
  priceRange: "$129 - $859",
  currenciesAccepted: "USD",
  paymentAccepted: "Credit Card",
  address: {
    "@type": "PostalAddress",
    streetAddress: "312 Talbot Street",
    addressLocality: "Ocean City",
    addressRegion: "MD",
    postalCode: "21842",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: GEO.lat,
    longitude: GEO.lng,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "08:30",
    closes: "20:30",
  },
  ...(sameAsLinks.length > 0 ? { sameAs: sameAsLinks } : {}),
  hasMap: ADDRESS_URL,
  /* aggregateRating and review are intentionally OMITTED.
     Angler Watersports is launching for the 2026 season and has not yet
     accumulated its own Google reviews. Re-add these blocks ONLY when
     Angler has its own Google Business Profile reviews. Borrowing OC's
     reviews would create a duplicate-content signal and is dishonest. */
  makesOffer: [
    {
      "@type": "Offer",
      name: "Jet Ski Rental - 1 Hour Guided Tour",
      description:
        "1-hour guided jet ski tour on Assateague Bay in Ocean City, MD. Brand-new jet skis, certified guide, see wild horses and dolphins. Up to 3 riders per ski, ages 5+.",
      price: "129.00",
      priceCurrency: "USD",
      url: BOOKING_URL,
      availability: "https://schema.org/InStock",
      validFrom: "2026-06-01",
      category: "Jet Ski Rental",
    },
    {
      "@type": "Offer",
      name: "Pontoon Boat Rental - 2 Hour Self-Guided Cruise",
      description:
        "Self-guided pontoon boat rental on Assateague Bay, Ocean City MD. Explore wild horse beaches, anchor at sandbars, BYOB friendly. Up to 10 guests.",
      price: "329.00",
      priceCurrency: "USD",
      url: BOOKING_URL,
      availability: "https://schema.org/InStock",
      validFrom: "2026-06-01",
      category: "Pontoon Boat Rental",
    },
    {
      "@type": "Offer",
      name: "Pontoon Boat Rental - 4 Hour Self-Guided Cruise",
      description:
        "Most popular pontoon rental. 4 hours exploring Assateague Bay. See wild horses, swim at sandbars, cruise at sunset. Up to 10 guests, BYOB.",
      price: "479.00",
      priceCurrency: "USD",
      url: BOOKING_URL,
      availability: "https://schema.org/InStock",
      validFrom: "2026-06-01",
      category: "Pontoon Boat Rental",
    },
    {
      "@type": "Offer",
      name: "Pontoon Boat Rental - 8 Hour Full Day",
      description:
        "Full-day pontoon boat rental on Assateague Bay. 8 hours of exploring, fishing, swimming, and cruising. Up to 10 guests.",
      price: "859.00",
      priceCurrency: "USD",
      url: BOOKING_URL,
      availability: "https://schema.org/InStock",
      validFrom: "2026-06-01",
      category: "Pontoon Boat Rental",
    },
  ],
  areaServed: {
    "@type": "City",
    name: "Ocean City",
    containedInPlace: {
      "@type": "State",
      name: "Maryland",
    },
  },
  touristType: ["Water Sports", "Family Activities", "Group Activities", "Adventure Tourism"],
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free Parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Life Vests Included", value: true },
    { "@type": "LocationFeatureSpecification", name: "Brand New Equipment", value: true },
    { "@type": "LocationFeatureSpecification", name: "Certified Guides", value: true },
  ],
};

/* ── WebSite schema (for sitelinks search box) ── */
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Book jet ski and pontoon boat rentals in Ocean City, Maryland. Guided jet ski tours and self-guided pontoon cruises on Assateague Bay.",
};

/* ── BreadcrumbList schema helper ── */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/* ── FAQPage schema helper ── */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

/* ── Service schema helper ── */
export function serviceSchema(service: {
  name: string;
  description: string;
  url: string;
  price: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.name,
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      "@id": BUSINESS_ID,
    },
    areaServed: {
      "@type": "City",
      name: "Ocean City",
      containedInPlace: { "@type": "State", name: "Maryland" },
    },
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: "USD",
      url: BOOKING_URL,
    },
    ...(service.image ? { image: service.image } : {}),
  };
}

/* ── Main component — renders in layout.tsx ── */
export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
