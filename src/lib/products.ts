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
      "Honey remains the best-known hive product and represents the most visible link between colony health, floral resources, hygienic harvesting, and value-added packing.",
    highlights: ["Harvested after proper hive management", "Linked to filtration, hygiene, and bottling", "Supports livelihood and market-facing value addition"],
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Honey_extracting.jpg/960px-Honey_extracting.jpg",
    imageAlt: "Honey extraction from capped comb",
  },
  {
    title: "Royal Jelly",
    description:
      "Royal jelly is a specialized high-value bee product that depends on queen-cell preparation, collection timing, careful transfer, and sensitive handling.",
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
      "Bee pollen is collected through pollen trapping and then handled for cleaning, drying awareness, storage, and product presentation.",
    highlights: ["Collected with pollen traps", "Needs clean post-collection handling", "Can be packed as a value-added hive product"],
    imageSrc: "/scientific-foundation-bg.jpg",
    imageAlt: "Scientific beekeeping training visual related to pollen work",
  },
  {
    title: "Beeswax",
    description:
      "Wax is recovered from hive operations and can be cleaned, processed, moulded, or used in foundation-related workflows and other value-added product streams.",
    highlights: ["Recovered from hive materials", "Processed through melting and cleaning", "Supports reuse and product diversification"],
    imageSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Mittelwand_17a.jpg/960px-Mittelwand_17a.jpg",
    imageAlt: "Beeswax foundation frame",
  },
  {
    title: "Propolis",
    description:
      "Propolis is a resinous hive product collected from colonies using controlled collection methods and basic cleaning or separation practices.",
    highlights: ["Collected through specialized methods", "Requires cleaning and handling awareness", "Expands hive-product diversification"],
    imageSrc: "/queen-rearing-bg.jpg",
    imageAlt: "Bee and hive work related to propolis collection",
  },
  {
    title: "Bee Venom",
    description:
      "Bee venom collection is a specialized product stream that requires controlled methods, equipment awareness, and disciplined safety practice.",
    highlights: ["Specialized collection workflow", "Strong safety emphasis", "Introduces advanced product diversification"],
    imageSrc: "/field-beekeeping.jpg",
    imageAlt: "Beekeeper working with hive equipment in the field",
  },
];
