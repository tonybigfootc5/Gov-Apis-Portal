export type ProductItem = {
  title: string;
  description: string;
  highlights: string[];
  imageSrc: string;
  imageAlt: string;
  imageSlides?: {
    src: string;
    alt: string;
  }[];
};

export const productItems: ProductItem[] = [
  {
    title: "Honey",
    description:
      "The best-known hive product links colony health, floral resources, hygienic harvesting, and value-added packing.",
    highlights: ["Harvested after proper hive management", "Linked to filtration, hygiene, and bottling", "Supports livelihood and market-facing value addition"],
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Honey_extracting.jpg/960px-Honey_extracting.jpg",
    imageAlt: "Honey extraction from capped comb",
  },
  {
    title: "Royal Jelly",
    description:
      "A specialized high-value bee product that depends on queen-cell preparation, collection timing, careful transfer, and sensitive handling.",
    highlights: ["Collected from prepared queen cells", "Requires precise timing", "Handled as a delicate value-added bee product"],
    imageSrc: "/products/royal-jelly.webp",
    imageAlt: "Royal jelly collection and queen cell handling",
    imageSlides: [
      {
        src: "/products/royal-jelly.webp",
        alt: "Royal jelly collection and queen cell handling",
      },
      {
        src: "/products/royal-jelly-1.webp",
        alt: "Close view of royal jelly preparation work",
      },
    ],
  },
  {
    title: "Bee Pollen",
    description:
      "Collected through pollen trapping and then handled for cleaning, drying awareness, storage, and product presentation.",
    highlights: ["Collected with pollen traps", "Needs clean post-collection handling", "Can be packed as a value-added hive product"],
    imageSrc: "/products/bee-pollen.jpg",
    imageAlt: "Bee pollen product collection and handling",
    imageSlides: [
      {
        src: "/products/bee-pollen.jpg",
        alt: "Bee pollen product collection and handling",
      },
      {
        src: "/products/bee-pollen-1.webp",
        alt: "Close view of bee pollen prepared as a hive product",
      },
    ],
  },
  {
    title: "Beeswax",
    description:
      "Wax is recovered from hive operations and can be cleaned, processed, moulded, or used in foundation-related workflows and other value-added product streams.",
    highlights: ["Recovered from hive materials", "Processed through melting and cleaning", "Supports reuse and product diversification"],
    imageSrc: "/products/bee-wax.jpg",
    imageAlt: "Beeswax product preparation and handling",
    imageSlides: [
      {
        src: "/products/bee-wax.jpg",
        alt: "Beeswax product preparation and handling",
      },
      {
        src: "/products/bee-wax-1.jpg",
        alt: "Close view of beeswax product material",
      },
    ],
  },
  {
    title: "Propolis",
    description:
      "This resinous hive product is collected from colonies using controlled collection methods and basic cleaning or separation practices.",
    highlights: ["Collected through specialized methods", "Requires cleaning and handling awareness", "Expands hive-product diversification"],
    imageSrc: "/products/bee-propolis.webp",
    imageAlt: "Bee propolis product collection and handling",
    imageSlides: [
      {
        src: "/products/bee-propolis.webp",
        alt: "Bee propolis product collection and handling",
      },
      {
        src: "/products/bee-propolis-1.webp",
        alt: "Close view of bee propolis product material",
      },
    ],
  },
  {
    title: "Bee Venom",
    description:
      "A specialized product stream that requires controlled methods, equipment awareness, and disciplined safety practice.",
    highlights: ["Specialized collection workflow", "Strong safety emphasis", "Introduces advanced product diversification"],
    imageSrc: "/products/bee-venom.jpg",
    imageAlt: "Bee venom collection and product handling",
    imageSlides: [
      {
        src: "/products/bee-venom.jpg",
        alt: "Bee venom collection and product handling",
      },
      {
        src: "/products/bee-venom-1.jpg",
        alt: "Close view of bee venom collection setup",
      },
    ],
  },
];
