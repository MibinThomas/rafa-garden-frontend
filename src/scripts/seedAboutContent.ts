import dbConnect from "../lib/mongodb";
import SiteContent from "../models/SiteContent";

const aboutContent = [
  // HERO
  {
    key: "about.hero_subtitle",
    value: "About us.",
    type: "text",
    group: "about",
    label: "Hero Subtitle",
    maxLength: 15
  },
  {
    key: "about.hero_title",
    value: "Rafah Garden.",
    type: "text",
    group: "about",
    label: "Hero Main Title",
    maxLength: 20
  },
  {
    key: "about.hero_logo",
    value: "/images/logo/Rafah logo.webp",
    type: "image",
    group: "about",
    label: "Brand Logo",
    hint: "Recommended: 216x72px (Transparent WebP)"
  },
  {
    key: "about.hero_description",
    value: "Rafah Garden believes that true health and happiness begin with nature’s sweetness. Nestled in our farm, we lovingly cultivate fresh red sweety dragon fruits, known for their rich taste and powerful health benefits.",
    type: "text",
    group: "about",
    label: "Hero Description"
  },
  {
    key: "about.section_1_5_label_jam",
    value: "Dragon\nFruit Jam",
    type: "text",
    group: "about",
    label: "Floating Label: Jam"
  },
  {
    key: "about.section_1_5_label_plant",
    value: "Dragon\nFruit Plant",
    type: "text",
    group: "about",
    label: "Floating Label: Plant"
  },
  {
    key: "about.section_1_5_label_crush",
    value: "Dragon\nFruit Crush",
    type: "text",
    group: "about",
    label: "Floating Label: Crush"
  },
  {
    key: "about.section_1_5_label_fruit",
    value: "Dragon\nFruit Fruit",
    type: "text",
    group: "about",
    label: "Floating Label: Fruit"
  },
  { key: "about.floating_pitaya_1", value: "/images/hero/floatingpitaya.png", type: "image", group: "about", label: "Floating Asset 1 (Top Right)", hint: "Blurred background asset" },
  { key: "about.floating_pitaya_2", value: "/images/hero/floatingpitaya.png", type: "image", group: "about", label: "Floating Asset 2 (Bottom Right)", hint: "Blurred background asset" },
  { key: "about.floating_pitaya_3", value: "/images/hero/floatingpitaya.png", type: "image", group: "about", label: "Floating Asset 3 (Top Left)", hint: "Blurred background asset" },
  { key: "about.floating_pitaya_4", value: "/images/hero/floatingpitaya.png", type: "image", group: "about", label: "Floating Asset 4 (Bottom Left)", hint: "Blurred background asset" },
  {
    key: "about.center_composition",
    value: "/images/about/Dragon fruit png.webp",
    type: "image",
    group: "about",
    label: "Center Hero Composition",
    hint: "Primary product focus"
  },
  {
    key: "about.design_background",
    value: "/images/about/Dragon fruit line curved.webp",
    type: "image",
    group: "about",
    label: "Hero Design Element",
    hint: "Curved line design illustration"
  },
  {
    key: "about.design_center_image",
    value: "/images/about/Dragon fruit png.webp",
    type: "image",
    group: "about",
    label: "Hero Center Product",
    hint: "Recommended: 700x700px High-Fidelity PNG"
  },

  // PRODUCTS SHOWCASE
  {
    key: "about.products_heading_1",
    value: "Dragon Fruit.",
    type: "text",
    group: "about",
    label: "Showcase Heading Row 1",
    maxLength: 15
  },
  {
    key: "about.products_heading_2",
    value: "Products",
    type: "text",
    group: "about",
    label: "Showcase Heading Row 2",
    maxLength: 15
  },
  {
    key: "about.products_description",
    value: "What began as a small family initiative has blossomed into a thriving agricultural enterprise. With every season, we've perfected our techniques, deepened our commitment to sustainable farming.",
    type: "text",
    group: "about",
    label: "Showcase Description"
  },
  {
    key: "about.narrative_paragraph",
    value: "Rafah Garden is more than just a farm – it's a passion project born from love for nature and commitment to quality. Nestled in the lush landscapes of Kasaragod, Kerala, we have dedicated ourselves to cultivating the finest dragon fruits.",
    type: "text",
    group: "about",
    label: "About Narrative Story"
  },
  {
    key: "about.products_full_image",
    value: "/images/about/All Products.webp",
    type: "image",
    group: "about",
    label: "Full Products Group Shot",
    hint: "Large composition of all bottles/jars"
  },

  // GRID ITEMS
  { key: "about.grid_item_1_label", value: "Dragon Fruit Crush", type: "text", group: "about", label: "Grid Item 1: Label" },
  { key: "about.grid_item_1_image", value: "/images/hero/crush_bottle.png", type: "image", group: "about", label: "Grid Item 1: Image", hint: "Transparent PNG bottle" },
  
  { key: "about.grid_item_2_label", value: "Dragon Fruit Jam", type: "text", group: "about", label: "Grid Item 2: Label" },
  { key: "about.grid_item_2_image", value: "/images/hero/jam_premium.png", type: "image", group: "about", label: "Grid Item 2: Image", hint: "Transparent PNG jar" },
  
  { key: "about.grid_item_3_label", value: "Dragon Fruit Fruit", type: "text", group: "about", label: "Grid Item 3: Label" },
  { key: "about.grid_item_3_image", value: "/images/about/Dragon fruit png.webp", type: "image", group: "about", label: "Grid Item 3: Image" },
  
  { key: "about.grid_item_4_label", value: "Dragon Fruit Plant", type: "text", group: "about", label: "Grid Item 4: Label" },
  { key: "about.grid_item_4_image", value: "/products/Plant 1 copy-4CPH7kam37YnVhsUfK3pinxwUeZr1O.webp", type: "image", group: "about", label: "Grid Item 4: Image", hint: "H-Fi Plant asset" },

  // FARMING SECTION
  { key: "about.farm_small_1", value: "/images/about/farm_small_1.png", type: "image", group: "about", label: "Farm Gallery 1", hint: "Recommended: 800x600px (4:3)" },
  { key: "about.farm_small_2", value: "/images/about/farm_small_2.png", type: "image", group: "about", label: "Farm Gallery 2", hint: "Recommended: 800x600px (4:3)" },
  { key: "about.farm_small_3", value: "/images/about/farm_small_3.png", type: "image", group: "about", label: "Farm Gallery 3", hint: "Recommended: 800x600px (4:3)" },
  { key: "about.farm_panoramic", value: "/images/about/farm_panoramic.png", type: "image", group: "about", label: "Farm Panoramic Vista", hint: "Recommended: 1920x1080px (16:9)" },
  
  { key: "about.watermark_own", value: "Own", type: "text", group: "about", label: "Watermark: Own", maxLength: 8 },
  { key: "about.watermark_farming_split", value: "Farming", type: "text", group: "about", label: "Watermark: Farming (Left)", maxLength: 12 },
  { key: "about.farm_split_image", value: "/images/about/farm_rows.png", type: "image", group: "about", label: "Farm Landscape Overlay", hint: "Horizontal focus next to 'Own'" },
  
  { key: "about.watermark_farming_vertical", value: "Farming", type: "text", group: "about", label: "Watermark: Farming (Right Vertical)", maxLength: 12 },
  { key: "about.technique_heading", value: "Nature's\nSweetness", type: "text", group: "about", label: "Technique Box Heading" },
  { key: "about.technique_subheading", value: "Natural\nFarming\nTechniques", type: "text", group: "about", label: "Technique Box Subheading" },
  { key: "about.technique_plant", value: "/products/Plant 1 copy-4CPH7kam37YnVhsUfK3pinxwUeZr1O.webp", type: "image", group: "about", label: "Technique Plant Image", hint: "Recommended: 448x704px Vertical" },

  // OUR STORY & MISSION (FROM LIVE SITE)
  { key: "about.our_story_title", value: "Crafting Nature's Sweetness Since Day One", type: "text", group: "about", label: "Our Story Title" },
  { key: "about.our_story_text_1", value: "Rafah Garden is more than just a farm – it's a passion project born from love for nature and commitment to quality. Nestled in the lush landscapes of Kasaragod, Kerala, we have dedicated ourselves to cultivating the finest dragon fruits and crafting premium products that bring the true taste of nature to your home.", type: "text", group: "about", label: "Our Story Text 1" },
  { key: "about.our_story_text_2", value: "What began as a small family initiative has blossomed into a thriving agricultural enterprise. With every season, we've perfected our techniques, deepened our commitment to sustainable farming, and expanded our range of delicious dragon fruit products – from fresh whole fruits to our signature Dragon Fruit Crush and Dragon Fruit Jam.", type: "text", group: "about", label: "Our Story Text 2" },
  
  { key: "about.mission_title", value: "Our Mission", type: "text", group: "about", label: "Our Mission Title" },
  { key: "about.mission_text", value: "To bring the purest, freshest, and most delicious dragon fruit products straight from our farm to families across India. We believe in celebrating nature's sweetness while maintaining the highest standards of quality, hygiene, and sustainability. Every product we create is a testament to our dedication to your health and happiness.", type: "text", group: "about", label: "Our Mission Statement" },

  // TEAM & EXPERTISE
  { key: "about.team_title", value: "We Grow, Handpick & Craft", type: "text", group: "about", label: "Team Section Title" },
  { key: "about.team_text_1", value: "Our team is comprised of passionate farming experts and product enthusiasts who understand the nuances of dragon fruit cultivation. From soil preparation to harvest, from crushing to packaging – we are personally involved in every step of the process.", type: "text", group: "about", label: "Team Text 1" },
  { key: "about.team_text_2", value: "Each team member brings years of experience and an unwavering commitment to excellence. This family-driven approach ensures that every batch of our products meets our stringent quality standards and carries the personal care that only dedicated experts can provide.", type: "text", group: "about", label: "Team Text 2" },

  // CORE VALUES
  { key: "about.value_1_title", value: "Guaranteed Freshness", type: "text", group: "about", label: "Core Value 1 Title" },
  { key: "about.value_1_text", value: "Every dragon fruit is harvested at peak ripeness from our Kasaragod farm. We ensure freshness through careful timing, proper storage, and swift delivery to our valued customers.", type: "text", group: "about", label: "Core Value 1 Text" },
  { key: "about.value_2_title", value: "Pure Ingredients", type: "text", group: "about", label: "Core Value 2 Title" },
  { key: "about.value_2_text", value: "No artificial colors, flavors, or preservatives. We use only real dragon fruit and natural ingredients in all our products – nothing more, nothing less.", type: "text", group: "about", label: "Core Value 2 Text" },
  { key: "about.value_3_title", value: "Sustainability", type: "text", group: "about", label: "Core Value 3 Title" },
  { key: "about.value_3_text", value: "We practice eco-friendly farming methods and are committed to preserving the environment for future generations. Our farm operates with respect for nature's balance.", type: "text", group: "about", label: "Core Value 3 Text" },
  { key: "about.value_4_title", value: "Customer Care", type: "text", group: "about", label: "Core Value 4 Title" },
  { key: "about.value_4_text", value: "Your satisfaction is our priority. We're always available to answer questions, address concerns, and ensure you have the best experience with our products.", type: "text", group: "about", label: "Core Value 4 Text" },

  // WHY CHOOSE US
  { key: "about.why_1_title", value: "Farm Fresh", type: "text", group: "about", label: "Why Choose 1 Title" },
  { key: "about.why_1_desc", value: "Direct from our farm to your door – no middlemen, maximum freshness", type: "text", group: "about", label: "Why Choose 1 Description" },
  { key: "about.why_2_title", value: "Quality Assured", type: "text", group: "about", label: "Why Choose 2 Title" },
  { key: "about.why_2_desc", value: "Every product undergoes rigorous quality checks", type: "text", group: "about", label: "Why Choose 2 Description" },
  { key: "about.why_3_title", value: "Family Expertise", type: "text", group: "about", label: "Why Choose 3 Title" },
  { key: "about.why_3_desc", value: "20+ years of combined farming experience", type: "text", group: "about", label: "Why Choose 3 Description" },
  { key: "about.why_4_title", value: "Transparent Operations", type: "text", group: "about", label: "Why Choose 4 Title" },
  { key: "about.why_4_desc", value: "We believe in honesty and transparency in all dealings", type: "text", group: "about", label: "Why Choose 4 Description" },
  { key: "about.why_5_title", value: "Customer Focused", type: "text", group: "about", label: "Why Choose 5 Title" },
  { key: "about.why_5_desc", value: "Your feedback helps us improve constantly", type: "text", group: "about", label: "Why Choose 5 Description" },
];

async function seed() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    for (const item of aboutContent) {
      await SiteContent.findOneAndUpdate(
        { key: item.key },
        item,
        { upsert: true, new: true }
      );
    }

    console.log("About page content seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
