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
  mobileTitle?: string;
  mobileShortDesc?: string;
  mobileActiveDesc?: string;
  desktopFeaturedProductId?: string;
  mobileFeaturedProductId?: string;
  desktopHeroImage?: string;
  mobileHeroImage?: string;
  products: Product[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  readingTime: string;
  category: string;
  accentColor: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    slug: "growing-pitaya-at-home",
    title: "The Ultimate Guide to Growing Heritage Pitaya at Home",
    subtitle: "From Seedling to Splendor",
    excerpt: "Discover the secrets of the ancients as we walk through the meticulous process of nurturing the majestic dragon fruit plant in your own garden sanctuary.",
    content: "Growing Pitaya is an art form that rewards the patient soul. Starting with the right variety is crucial—Heritage Pitaya varieties are chosen for their resilience and vibrant fruit quality. Whether you're starting from a cutting or a seedling, the key lies in the soil: a well-draining mix of cacti soil and organic compost provides the perfect foundation. Dragon fruits are climbers by nature, so providing a sturdy vertical support system is essential for a bountiful harvest. In this guide, we dive deep into the specific watering schedules, sunlight requirements, and organic fertilizing techniques that ensure your home garden produces fruits as vibrant as the ones found in our Rafah sanctuaries.",
    image: "/images/blog/growing_pitaya.png",
    date: "April 10, 2026",
    readingTime: "6 min read",
    category: "Garden Sage",
    accentColor: "#7fa23f"
  },
  {
    id: "b2",
    slug: "dragon-fruit-superfood",
    title: "Why Red Dragon Fruit is the Superfood Your Diet Needs",
    subtitle: "Nature's Vibrant Nutrient Bomb",
    excerpt: "Explore the profound health benefits locked within the deep magenta flesh of our premium red dragon fruits, from antioxidant power to heart health.",
    content: "The vibrant magenta hue of our red dragon fruit isn't just for show—it's a signal of its incredible antioxidant profile. Rich in betalains and vitamin C, these fruits are natural powerhouses for boosting the immune system and fighting oxidative stress. Beyond the surface, the tiny black seeds provide a serving of healthy fatty acids, while the high fiber content supports digestive wellness. Unlike many tropical fruits, dragon fruit maintains a low glycemic index, making it an ideal choice for sustained energy. In this article, we break down the latest nutritional research that places Pitaya at the top of the superfood hierarchy, alongside kale and blueberries.",
    image: "/images/blog/superfood_pitaya.png",
    date: "April 08, 2026",
    readingTime: "4 min read",
    category: "Health & Vitality",
    accentColor: "#c81c6a"
  },
  {
    id: "b3",
    slug: "sustainable-farming-philosophy",
    title: "Sustainable Farming: The Philosophy Behind Rafah Garden",
    subtitle: "Earth First, Fruit Second",
    excerpt: "Go behind the scenes at Rafah Garden to see how we blend ancient wisdom with modern technology to cultivate land that gives back.",
    content: "At Rafah Garden, sustainability isn't a trend; it's our foundational law. We believe that to produce the most vibrant fruits, we must first nurture a vibrant ecosystem. Our vertical farming techniques maximize space and minimize land disturbance, while our closed-loop irrigation systems ensure every drop of water is used with surgical precision. We avoid synthetic pesticides in favor of botanical solutions that respect the local bees and beneficial insects. By working with nature instead of against it, we've created a sanctuary that produces fruits of unparalleled purity. This post explores our 'Earth First' philosophy and how it shapes every harvest we bring to your table.",
    image: "/images/blog/farming_philosophy.png",
    date: "April 05, 2026",
    readingTime: "7 min read",
    category: "Ethos",
    accentColor: "#9a0c52"
  },
  {
    id: "b4",
    slug: "exotic-dessert-recipes",
    title: "Exotic Dessert Recipes using Premium Cold-Pressed Crush",
    subtitle: "Culinary Magic with Pitaya",
    excerpt: "Elevate your dining experience with these five curated dessert recipes featuring our signature cold-pressed Dragon Fruit Crush.",
    content: "The deep, concentrated flavor of Rafah Garden Cold-Pressed Crush is a versatile companion in the kitchen. From refreshing Pitaya sorbets to elegant dragon fruit panna cottas, the possibilities are limited only by your imagination. One of our favorites is the 'Heritage Magenta Mousse'—a light, airy dessert that pairs the tartness of our crush with creamy mascarpone. For those seeking something cooling, our Pitaya Granite offers a sophisticated alternative to traditional ice cream. In this culinary feature, we present five step-by-step recipes that will turn your next dinner party into a cinematic gastronomic event.",
    image: "/images/blog/dessert_recipes.png",
    date: "April 01, 2026",
    readingTime: "5 min read",
    category: "Culinary Arts",
    accentColor: "#bbbdbf"
  },
  {
    id: "b5",
    slug: "botanical-living-wellness",
    title: "Benefits of Botanical Living: A Wellness Guide",
    subtitle: "Finding Balance in Nature",
    excerpt: "Learn how integrating botanical elements and nutrient-dense fruits into your daily rhythm can transform your physical and mental well-being.",
    content: "Botanical living is more than just keeping house plants; it's a holistic approach to wellness. Studies show that proximity to greenery reduces cortisol levels and enhances creative focus. When combined with a diet rich in exotic, high-vibrancy fruits like the dragon fruit, the result is a profound shift in energy levels. At Rafah Garden, we advocate for a rhythm that aligns with the seasons, encouraging our community to embrace natural lighting, fresh air, and authentic food sources. This wellness guide provides actionable tips on how to create a personal sanctuary in your home and why the botanical lifestyle is the ultimate antidote to modern burnout.",
    image: "/images/blog/botanical_wellness.png",
    date: "March 28, 2026",
    readingTime: "8 min read",
    category: "Lifestyle",
    accentColor: "#7fa23f"
  }
];

export const CATEGORIES: Category[] = [
  {
    id: "01",
    title: "Crush",
    subtitle: "Pure Botanical Refreshment",
    image: "/images/hero/crush_bottle.png",
    color: "#c81c6a",
    products: [
      {
        id: "c-1",
        name: "Sample Product 1",
        description: "This is a sample description for product 1.",
        image: "/products/crush_bottle.png",
        variants: [
          { size: "500", unit: "ML" },
          { size: "100", unit: "ML" }
        ]
      },
      {
        id: "c-2",
        name: "Sample Product 2",
        description: "This is a sample description for product 2.",
        image: "/products/crush_bottle.png",
        variants: [
          { size: "500", unit: "ML" },
          { size: "250", unit: "ML" }
        ]
      },
      {
        id: "c-3",
        name: "Sample Product 3",
        description: "This is a sample description for product 3.",
        image: "/products/crush_bottle.png",
        variants: [
          { size: "500", unit: "ML" }
        ]
      },
      {
        id: "c-4",
        name: "Sample Product 4",
        description: "This is a sample description for product 4.",
        image: "/products/crush_bottle.png",
        variants: [
          { size: "750", unit: "ML" },
          { size: "250", unit: "ML" }
        ]
      },
      {
        id: "c-5",
        name: "Sample Product 5",
        description: "This is a sample description for product 5.",
        image: "/products/crush_bottle.png",
        variants: [
          { size: "1000", unit: "ML" },
          { size: "500", unit: "ML" }
        ]
      }
    ]
  },
  {
    id: "02",
    title: "jams",
    subtitle: "Deliciously Thick & Natural",
    image: "/images/hero/jam_premium.png",
    color: "#9a0c52",
    products: [
      {
        id: "j-1",
        name: "Sample Product 1",
        description: "This is a sample description for product 1.",
        image: "/products/jam_premium.png",
        variants: [{ size: "500", unit: "G" }, { size: "250", unit: "G" }]
      },
      {
        id: "j-2",
        name: "Sample Product 2",
        description: "This is a sample description for product 2.",
        image: "/products/jam_premium.png",
        variants: [{ size: "500", unit: "G" }]
      },
      {
        id: "j-3",
        name: "Sample Product 3",
        description: "This is a sample description for product 3.",
        image: "/products/jam_premium.png",
        variants: [{ size: "300", unit: "G" }]
      },
      {
        id: "j-4",
        name: "Sample Product 4",
        description: "This is a sample description for product 4.",
        image: "/products/jam_premium.png",
        variants: [{ size: "400", unit: "G" }]
      },
      {
        id: "j-5",
        name: "Sample Product 5",
        description: "This is a sample description for product 5.",
        image: "/products/jam_premium.png",
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
        image: "/products/fresh_fruits.png",
        variants: [{ size: "1", unit: "KG" }, { size: "3", unit: "KG" }]
      },
      {
        id: "f-2",
        name: "Sample Product 2",
        description: "This is a sample description for product 2.",
        image: "/products/fresh_fruits.png",
        variants: [{ size: "1", unit: "KG" }]
      },
      {
        id: "f-3",
        name: "Sample Product 3",
        description: "This is a sample description for product 3.",
        image: "/products/fresh_fruits.png",
        variants: [{ size: "500", unit: "G" }]
      },
      {
        id: "f-4",
        name: "Sample Product 4",
        description: "This is a sample description for product 4.",
        image: "/products/fresh_fruits.png",
        variants: [{ size: "1", unit: "KG" }]
      },
      {
        id: "f-5",
        name: "Sample Product 5",
        description: "This is a sample description for product 5.",
        image: "/products/fresh_fruits.png",
        variants: [{ size: "250", unit: "G" }, { size: "500", unit: "G" }]
      }
    ]
  },
  {
    id: "04",
    title: "Plants",
    subtitle: "Grow Your Own Heritage",
    image: "/images/hero/Plant.webp",
    color: "#7fa23fc8",
    products: [
      {
        id: "p-1",
        name: "Sample Product 1",
        description: "This is a sample description for product 1.",
        image: "/images/hero/Plant.webp",
        variants: [{ size: "Medium", unit: "Pot" }]
      },
      {
        id: "p-2",
        name: "Sample Product 2",
        description: "This is a sample description for product 2.",
        image: "/images/hero/Plant.webp",
        variants: [{ size: "Large", unit: "Pot" }]
      },
      {
        id: "p-3",
        name: "Sample Product 3",
        description: "This is a sample description for product 3.",
        image: "/images/hero/Plant.webp",
        variants: [{ size: "Small", unit: "Pot" }, { size: "Medium", unit: "Pot" }]
      },
      {
        id: "p-4",
        name: "Sample Product 4",
        description: "This is a sample description for product 4.",
        image: "/images/hero/Plant.webp",
        variants: [{ size: "Large", unit: "Pot" }]
      },
      {
        id: "p-5",
        name: "Sample Product 5",
        description: "This is a sample description for product 5.",
        image: "/images/hero/Plant.webp",
        variants: [{ size: "Medium", unit: "Pot" }]
      }
    ]
  }
];
