export interface ProductVariant {
  size: string;
  unit: string;
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  image: string;
  category?: string;
  variants: ProductVariant[];
  active?: boolean;
  highlights?: string[];
  cta_url?: string;
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
    accentColor: "#5d5f61"
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
    mobileActiveDesc: "Crafted from handpicked heritage Dragon fruit and natural ingredients, our Crush delivers a vibrant burst of flavor with every sip. Refreshingly rich, naturally delicious, and made to awaken your senses.",
    products: [
      {
        id: "c-1",
        name: "Crush 1",
        subtitle: "100% Pure & Refreshing Drink Concentrate",
        description: "Refreshing and delicious dragon fruit juice concentrate. Packed with natural flavor and nutrition. Perfect for smoothies, cocktails, or direct consumption with water.",
        highlights: ["No Added Sugar Option", "100% Pure Dragon Fruit", "Ready to Mix", "Long Shelf Life"],
        image: "/products/crush_bottle.png",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Crush.%20Please%20share%20pricing%20and%20availability.",
        variants: [
          { size: "500", unit: "ML", price: 599 },
          { size: "100", unit: "ML", price: 199 }
        ]
      },
      {
        id: "c-2",
        name: "Crush 2",
        subtitle: "Artisanal Dragon Fruit Nectar",
        description: "Refreshing and delicious dragon fruit juice concentrate. Packed with natural flavor and nutrition. Perfect for smoothies, cocktails, or direct consumption with water.",
        highlights: ["No Added Sugar Option", "100% Pure Dragon Fruit", "Ready to Mix", "Long Shelf Life"],
        image: "/products/crush_bottle.png",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Crush.%20Please%20share%20pricing%20and%20availability.",
        variants: [
          { size: "500", unit: "ML", price: 599 },
          { size: "250", unit: "ML", price: 349 }
        ]
      },
      {
        id: "c-3",
        name: "Crush 3",
        subtitle: "Pure Kasaragod Dragon Fruit Concentrate",
        description: "Refreshing and delicious dragon fruit juice concentrate. Packed with natural flavor and nutrition. Perfect for smoothies, cocktails, or direct consumption with water.",
        highlights: ["No Added Sugar Option", "100% Pure Dragon Fruit", "Ready to Mix", "Long Shelf Life"],
        image: "/products/crush_bottle.png",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Crush.%20Please%20share%20pricing%20and%20availability.",
        variants: [
          { size: "500", unit: "ML", price: 599 }
        ]
      },
      {
        id: "c-4",
        name: "Crush 4",
        subtitle: "Family Reserve Dragon Fruit Crush",
        description: "Refreshing and delicious dragon fruit juice concentrate. Packed with natural flavor and nutrition. Perfect for smoothies, cocktails, or direct consumption with water.",
        highlights: ["No Added Sugar Option", "100% Pure Dragon Fruit", "Ready to Mix", "Long Shelf Life"],
        image: "/products/crush_bottle.png",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Crush.%20Please%20share%20pricing%20and%20availability.",
        variants: [
          { size: "750", unit: "ML", price: 799 },
          { size: "250", unit: "ML", price: 349 }
        ]
      },
      {
        id: "c-5",
        name: "Crush 5",
        subtitle: "Bulk Reserve Dragon Fruit Crush",
        description: "Refreshing and delicious dragon fruit juice concentrate. Packed with natural flavor and nutrition. Perfect for smoothies, cocktails, or direct consumption with water.",
        highlights: ["No Added Sugar Option", "100% Pure Dragon Fruit", "Ready to Mix", "Long Shelf Life"],
        image: "/products/crush_bottle.png",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Crush.%20Please%20share%20pricing%20and%20availability.",
        variants: [
          { size: "1000", unit: "ML", price: 999 },
          { size: "500", unit: "ML", price: 599 }
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
    mobileActiveDesc: "Made from farm-fresh fruits and traditional recipes, our jams bring authentic homemade taste to your table. Smooth, flavorful, and packed with natural goodness in every spoonful.",
    products: [
      {
        id: "j-1",
        name: "Jam 1",
        subtitle: "Handcrafted Small-Batch Artisanal Jam",
        description: "Handcrafted in small batches, our dragon fruit jam is made with love and pure ingredients. Spread on toast, mix with yogurt, or use as a filling for desserts.",
        highlights: ["Small Batch Artisanal", "Natural Pectin Setting", "No Preservatives Added", "Perfect Gift Option"],
        image: "/products/jam_premium.png",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Jam.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "500", unit: "G", price: 599 }, { size: "250", unit: "G", price: 349 }]
      },
      {
        id: "j-2",
        name: "Jam 2",
        subtitle: "Pure Fruit Artisanal Spread",
        description: "Handcrafted in small batches, our dragon fruit jam is made with love and pure ingredients. Spread on toast, mix with yogurt, or use as a filling for desserts.",
        highlights: ["Small Batch Artisanal", "Natural Pectin Setting", "No Preservatives Added", "Perfect Gift Option"],
        image: "/products/jam_premium.png",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Jam.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "500", unit: "G", price: 599 }]
      },
      {
        id: "j-3",
        name: "Jam 3",
        subtitle: "Artisanal Dragon Fruit Preserve",
        description: "Handcrafted in small batches, our dragon fruit jam is made with love and pure ingredients. Spread on toast, mix with yogurt, or use as a filling for desserts.",
        highlights: ["Small Batch Artisanal", "Natural Pectin Setting", "No Preservatives Added", "Perfect Gift Option"],
        image: "/products/jam_premium.png",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Jam.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "300", unit: "G", price: 399 }]
      },
      {
        id: "j-4",
        name: "Jam 4",
        subtitle: "Heritage Recipe Dragon Fruit Jam",
        description: "Handcrafted in small batches, our dragon fruit jam is made with love and pure ingredients. Spread on toast, mix with yogurt, or use as a filling for desserts.",
        highlights: ["Small Batch Artisanal", "Natural Pectin Setting", "No Preservatives Added", "Perfect Gift Option"],
        image: "/products/jam_premium.png",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Jam.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "400", unit: "G", price: 499 }]
      },
      {
        id: "j-5",
        name: "Jam 5",
        subtitle: "Signature Kasaragod Jam Reserve",
        description: "Handcrafted in small batches, our dragon fruit jam is made with love and pure ingredients. Spread on toast, mix with yogurt, or use as a filling for desserts.",
        highlights: ["Small Batch Artisanal", "Natural Pectin Setting", "No Preservatives Added", "Perfect Gift Option"],
        image: "/products/jam_premium.png",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Jam.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "500", unit: "G", price: 599 }, { size: "200", unit: "G", price: 299 }]
      }
    ]
  },
  {
    id: "03",
    title: "Fruits",
    subtitle: "Fresh From Our Gardens",
    image: "/products/Dragon fruit png.webp",
    color: "#b5e55bc8",
    mobileActiveDesc: "Carefully grown with love and harvested at peak freshness, our fruits offer natural sweetness and premium quality straight from the garden to your home.",
    products: [
      {
        id: "f-1",
        name: "Fresh Dragon Fruits",
        subtitle: "Handpicked Red Sweety Variety",
        description: "Handpicked red sweety dragon fruits at peak ripeness. Rich in vitamins, fiber, and antioxidants. Perfect for fresh consumption or making your own smoothies and desserts.",
        highlights: ["100% Fresh & Organic", "Rich Red Sweety Variety", "Peak Ripeness Guaranteed", "Farm Fresh Delivery"],
        image: "/products/Dragon fruit png.webp",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Fresh%20Dragon%20Fruits.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "1", unit: "KG", price: 299 }, { size: "3", unit: "KG", price: 799 }]
      },
      {
        id: "f-2",
        name: "Fruit 2",
        subtitle: "Premium Red Sweety Harvest",
        description: "Handpicked red sweety dragon fruits at peak ripeness. Rich in vitamins, fiber, and antioxidants. Perfect for fresh consumption or making your own smoothies and desserts.",
        highlights: ["100% Fresh & Organic", "Rich Red Sweety Variety", "Peak Ripeness Guaranteed", "Farm Fresh Delivery"],
        image: "/products/Dragon fruit png.webp",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Fresh%20Dragon%20Fruits.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "1", unit: "KG", price: 299 }]
      },
      {
        id: "f-3",
        name: "Fruit 3",
        subtitle: "Single Serve Red Pitaya",
        description: "Handpicked red sweety dragon fruits at peak ripeness. Rich in vitamins, fiber, and antioxidants. Perfect for fresh consumption or making your own smoothies and desserts.",
        highlights: ["100% Fresh & Organic", "Rich Red Sweety Variety", "Peak Ripeness Guaranteed", "Farm Fresh Delivery"],
        image: "/products/Dragon fruit png.webp",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Fresh%20Dragon%20Fruits.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "500", unit: "G", price: 169 }]
      },
      {
        id: "f-4",
        name: "Fruit 4",
        subtitle: "Organic Kasaragod Farm Harvest",
        description: "Handpicked red sweety dragon fruits at peak ripeness. Rich in vitamins, fiber, and antioxidants. Perfect for fresh consumption or making your own smoothies and desserts.",
        highlights: ["100% Fresh & Organic", "Rich Red Sweety Variety", "Peak Ripeness Guaranteed", "Farm Fresh Delivery"],
        image: "/products/Dragon fruit png.webp",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Fresh%20Dragon%20Fruits.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "1", unit: "KG", price: 299 }]
      },
      {
        id: "f-5",
        name: "Fruit 5",
        subtitle: "Artisanal Pitaya Harvest Pack",
        description: "Handpicked red sweety dragon fruits at peak ripeness. Rich in vitamins, fiber, and antioxidants. Perfect for fresh consumption or making your own smoothies and desserts.",
        highlights: ["100% Fresh & Organic", "Rich Red Sweety Variety", "Peak Ripeness Guaranteed", "Farm Fresh Delivery"],
        image: "/products/Dragon fruit png.webp",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Fresh%20Dragon%20Fruits.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "250", unit: "G", price: 99 }, { size: "500", unit: "G", price: 169 }]
      }
    ]
  },
  {
    id: "04",
    title: "Plants",
    subtitle: "Grow Your Own Heritage",
    image: "/images/hero/Plant.webp",
    color: "#7fa23fc8",
    mobileActiveDesc: "Bring nature closer with our healthy, organically nurtured plants. Perfect for homes and gardens, each plant is grown with care to preserve heritage and freshness naturally.",
    products: [
      {
        id: "p-1",
        name: "Dragon Fruit Plant",
        subtitle: "Disease-Resistant High-Yielding Sapling",
        description: "High-quality, disease-resistant dragon fruit saplings & plants. Grown in our Kasaragod plantation, ideal for home gardening or commercial cultivation.",
        highlights: ["High Yielding Red Sweety Variety", "Disease Resistant Saplings", "Rooted & Ready for Planting", "Expert Cultivation Guidance"],
        image: "/images/hero/Plant.webp",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Plant.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "Medium", unit: "Pot", price: 349 }]
      },
      {
        id: "p-2",
        name: "Plant 2",
        subtitle: "Large Cultivation Ready Pot",
        description: "High-quality, disease-resistant dragon fruit saplings & plants. Grown in our Kasaragod plantation, ideal for home gardening or commercial cultivation.",
        highlights: ["High Yielding Red Sweety Variety", "Disease Resistant Saplings", "Rooted & Ready for Planting", "Expert Cultivation Guidance"],
        image: "/images/hero/Plant.webp",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Plant.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "Large", unit: "Pot", price: 499 }]
      },
      {
        id: "p-3",
        name: "Plant 3",
        subtitle: "Home Garden Starter Plant",
        description: "High-quality, disease-resistant dragon fruit saplings & plants. Grown in our Kasaragod plantation, ideal for home gardening or commercial cultivation.",
        highlights: ["High Yielding Red Sweety Variety", "Disease Resistant Saplings", "Rooted & Ready for Planting", "Expert Cultivation Guidance"],
        image: "/images/hero/Plant.webp",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Plant.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "Small", unit: "Pot", price: 199 }, { size: "Medium", unit: "Pot", price: 349 }]
      },
      {
        id: "p-4",
        name: "Plant 4",
        subtitle: "Mature Heritage Pitaya Plant",
        description: "High-quality, disease-resistant dragon fruit saplings & plants. Grown in our Kasaragod plantation, ideal for home gardening or commercial cultivation.",
        highlights: ["High Yielding Red Sweety Variety", "Disease Resistant Saplings", "Rooted & Ready for Planting", "Expert Cultivation Guidance"],
        image: "/images/hero/Plant.webp",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Plant.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "Large", unit: "Pot", price: 499 }]
      },
      {
        id: "p-5",
        name: "Plant 5",
        subtitle: "Boutique Orchard Sapling",
        description: "High-quality, disease-resistant dragon fruit saplings & plants. Grown in our Kasaragod plantation, ideal for home gardening or commercial cultivation.",
        highlights: ["High Yielding Red Sweety Variety", "Disease Resistant Saplings", "Rooted & Ready for Planting", "Expert Cultivation Guidance"],
        image: "/images/hero/Plant.webp",
        cta_url: "https://wa.me/917021932982?text=Hi!%20I%20would%20like%20to%20order%20Dragon%20Fruit%20Plant.%20Please%20share%20pricing%20and%20availability.",
        variants: [{ size: "Medium", unit: "Pot", price: 349 }]
      }
    ]
  }
];
