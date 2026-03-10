import { FloatingHero } from "@/components/FloatingHero";
import { ProductGrid } from "@/components/ProductGrid";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white dark:bg-obsidian transition-colors duration-300 flex flex-col">
      <Navbar />
      <FloatingHero />
      <div className="relative z-10 bg-white/80 dark:bg-obsidian/80 backdrop-blur-md transition-colors duration-300">
        <ProductGrid />
      </div>
      <footer className="w-full py-12 text-center text-gray-500 text-sm tracking-widest bg-white dark:bg-obsidian border-t border-black/5 dark:border-white/5 relative z-10 transition-colors duration-300">
        <p>&copy; {new Date().getFullYear()} RAFA GARDEN. ALL RIGHTS RESERVED.</p>
      </footer>
    </main>
  );
}
