export interface ProductVariant {
  size: string;
  unit: string;
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  image: string;  // Main image used on Home page accordion
  color: string;
  products: Product[];
}

export const CATEGORIES: Category[] = [
  {
    id: "01",
    title: "Crush",
    subtitle: "Pure Botanical Refreshment",
    image: "/images/hero/crush_bottle.webp",
    color: "#c81c6a",
    products: [
      {
        id: "c-1",
        name: "Sample Product 1",
        description: "This is a sample description for product 1.",
        image: "/images/hero/crush_bottle.webp",
        variants: [
          { size: "500", unit: "ML" },
          { size: "100", unit: "ML" },
          { size: "125", unit: "ML" }
        ]
      },
      {
        id: "c-2",
        name: "Sample Product 2",
        description: "This is a sample description for product 2.",
        image: "/images/hero/crush_bottle.webp",
        variants: [
          { size: "500", unit: "ML" },
          { size: "250", unit: "ML" }
        ]
      },
      {
        id: "c-3",
        name: "Sample Product 3",
        description: "This is a sample description for product 3.",
        image: "/images/hero/crush_bottle.webp",
        variants: [
          { size: "500", unit: "ML" }
        ]
      },
      {
        id: "c-4",
        name: "Sample Product 4",
        description: "This is a sample description for product 4.",
        image: "/images/hero/crush_bottle.webp",
        variants: [
          { size: "750", unit: "ML" },
          { size: "250", unit: "ML" }
        ]
      },
      {
        id: "c-5",
        name: "Sample Product 5",
        description: "This is a sample description for product 5.",
        image: "/images/hero/crush_bottle.webp",
        variants: [
          { size: "1000", unit: "ML" },
          { size: "500", unit: "ML" }
        ]
      }
    ]
  },
  {
    id: "02",
    title: "Jams",
    subtitle: "Deliciously Thick & Natural",
    image: "/images/hero/jam_premium.png",
    color: "#9a0c52",
    products: [
      {
        id: "j-1",
        name: "Sample Product 1",
        description: "This is a sample description for product 1.",
        image: "/images/hero/jam_premium.png",
        variants: [{ size: "500", unit: "G" }, { size: "250", unit: "G" }]
      },
      {
        id: "j-2",
        name: "Sample Product 2",
        description: "This is a sample description for product 2.",
        image: "/images/hero/jam_premium.png",
        variants: [{ size: "500", unit: "G" }]
      },
      {
        id: "j-3",
        name: "Sample Product 3",
        description: "This is a sample description for product 3.",
        image: "/images/hero/jam_premium.png",
        variants: [{ size: "300", unit: "G" }]
      },
      {
        id: "j-4",
        name: "Sample Product 4",
        description: "This is a sample description for product 4.",
        image: "/images/hero/jam_premium.png",
        variants: [{ size: "400", unit: "G" }]
      },
      {
        id: "j-5",
        name: "Sample Product 5",
        description: "This is a sample description for product 5.",
        image: "/images/hero/jam_premium.png",
        variants: [{ size: "500", unit: "G" }, { size: "200", unit: "G" }]
      }
    ]
  },
  {
    id: "03",
    title: "Fruits",
    subtitle: "Fresh From Our Gardens",
    image: "/images/hero/fresh_fruits.png",
    color: "#b5e55bc8",
    products: [
      {
        id: "f-1",
        name: "Sample Product 1",
        description: "This is a sample description for product 1.",
        image: "/images/hero/fresh_fruits.png",
        variants: [{ size: "1", unit: "KG" }, { size: "3", unit: "KG" }]
      },
      {
        id: "f-2",
        name: "Sample Product 2",
        description: "This is a sample description for product 2.",
        image: "/images/hero/fresh_fruits.png",
        variants: [{ size: "1", unit: "KG" }]
      },
      {
        id: "f-3",
        name: "Sample Product 3",
        description: "This is a sample description for product 3.",
        image: "/images/hero/fresh_fruits.png",
        variants: [{ size: "500", unit: "G" }]
      },
      {
        id: "f-4",
        name: "Sample Product 4",
        description: "This is a sample description for product 4.",
        image: "/images/hero/fresh_fruits.png",
        variants: [{ size: "1", unit: "KG" }]
      },
      {
        id: "f-5",
        name: "Sample Product 5",
        description: "This is a sample description for product 5.",
        image: "/images/hero/fresh_fruits.png",
        variants: [{ size: "250", unit: "G" }, { size: "500", unit: "G" }]
      }
    ]
  },
  {
    id: "04",
    title: "Plants",
    subtitle: "Grow Your Own Heritage",
    image: "/images/hero/plants_premium.png",
    color: "#7fa23fc8",
    products: [
      {
        id: "p-1",
        name: "Sample Product 1",
        description: "This is a sample description for product 1.",
        image: "/images/hero/plants_premium.png",
        variants: [{ size: "Medium", unit: "Pot" }]
      },
      {
        id: "p-2",
        name: "Sample Product 2",
        description: "This is a sample description for product 2.",
        image: "/images/hero/plants_premium.png",
        variants: [{ size: "Large", unit: "Pot" }]
      },
      {
        id: "p-3",
        name: "Sample Product 3",
        description: "This is a sample description for product 3.",
        image: "/images/hero/plants_premium.png",
        variants: [{ size: "Small", unit: "Pot" }, { size: "Medium", unit: "Pot" }]
      },
      {
        id: "p-4",
        name: "Sample Product 4",
        description: "This is a sample description for product 4.",
        image: "/images/hero/plants_premium.png",
        variants: [{ size: "Large", unit: "Pot" }]
      },
      {
        id: "p-5",
        name: "Sample Product 5",
        description: "This is a sample description for product 5.",
        image: "/images/hero/plants_premium.png",
        variants: [{ size: "Medium", unit: "Pot" }]
      }
    ]
  }
];
