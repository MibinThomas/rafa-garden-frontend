import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";

export async function GET() {
  try {
    await dbConnect();

    const aboutImages = [
      {
        key: "about.hero_logo",
        value: "/images/logo/Rafah logo.webp",
        type: "image",
        group: "about",
        label: "About Hero Logo",
        hint: "The logo appearing in the hero section."
      },
      {
        key: "about.design_background",
        value: "/images/about/Dragon fruit line curved.webp",
        type: "image",
        group: "about",
        label: "Design Background",
        hint: "Curved line background design."
      },
      {
        key: "about.center_composition",
        value: "/images/about/Dragon fruit png.webp",
        type: "image",
        group: "about",
        label: "Main Composition Image",
        hint: "The central floating dragon fruit arrangement."
      },
      {
        key: "about.products_full_image",
        value: "/images/about/All Products.webp",
        type: "image",
        group: "about",
        label: "All Products Overview",
        hint: "The large panoramic image of all products."
      },
      {
        key: "about.farm_panoramic",
        value: "/images/about/farm_panoramic.png",
        type: "image",
        group: "about",
        label: "Farm Panoramic View",
        hint: "The wide panoramic shot of the plantation."
      },
      {
        key: "about.grid_item_1_image",
        value: "/images/hero/crush_bottle.png",
        type: "image",
        group: "about",
        label: "Grid Item 1: Crush",
        hint: "Image for the first grid product."
      },
      {
        key: "about.grid_item_2_image",
        value: "/images/hero/jam_premium.png",
        type: "image",
        group: "about",
        label: "Grid Item 2: Jam",
        hint: "Image for the second grid product."
      },
      {
        key: "about.grid_item_3_image",
        value: "/images/about/Dragon fruit png.webp",
        type: "image",
        group: "about",
        label: "Grid Item 3: Fruit",
        hint: "Image for the third grid product."
      },
      {
        key: "about.grid_item_4_image",
        value: "/products/Plant 1 copy-4CPH7kam37YnVhsUfK3pinxwUeZr1O.webp",
        type: "image",
        group: "about",
        label: "Grid Item 4: Plant",
        hint: "Image for the fourth grid product."
      },
      {
        key: "about.farm_small_1",
        value: "/images/about/farm_small_1.png",
        type: "image",
        group: "about",
        label: "Farm Detail 1",
        hint: "Small farming photo 1."
      },
      {
        key: "about.farm_small_2",
        value: "/images/about/farm_small_2.png",
        type: "image",
        group: "about",
        label: "Farm Detail 2",
        hint: "Small farming photo 2."
      },
      {
        key: "about.farm_small_3",
        value: "/images/about/farm_small_3.png",
        type: "image",
        group: "about",
        label: "Farm Detail 3",
        hint: "Small farming photo 3."
      },
      {
        key: "about.floating_pitaya_1",
        value: "/images/hero/floatingpitaya.png",
        type: "image",
        group: "about",
        label: "Floating Pitaya 1",
        hint: "Small blurred floating asset."
      },
      {
        key: "about.floating_pitaya_2",
        value: "/images/hero/floatingpitaya.png",
        type: "image",
        group: "about",
        label: "Floating Pitaya 2",
        hint: "Small blurred floating asset."
      }
    ];

    for (const item of aboutImages) {
      await SiteContent.findOneAndUpdate(
        { key: item.key },
        { ...item },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true, message: "About page CMS image keys initialized." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
