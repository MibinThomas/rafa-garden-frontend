import { FloatingHero } from "@/components/FloatingHero";
import { ProductGrid } from "@/components/ProductGrid";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-obsidian flex flex-col">
      <Navbar />
      <FloatingHero />
      <div className="relative z-10 bg-obsidian/80 backdrop-blur-md">
        <ProductGrid />
      </div>
      <footer className="w-full py-12 text-center text-gray-500 text-sm tracking-widest bg-obsidian border-t border-white/5 relative z-10">
        <p>&copy; {new Date().getFullYear()} DRGN CRUSH. ALL RIGHTS RESERVED.</p>
      </footer>
    </main>
  );
}
