import { Navbar } from "@/components/Navbar";
import { ExperienceCanvas } from "@/components/ExperienceCanvas";
import { ProductGrid } from "@/components/ProductGrid";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black transition-colors duration-300 flex flex-col font-sans">
      <Navbar />

      {/* The 400vh Scroll Sequence */}
      <ExperienceCanvas />

      {/* Products continue below the scrollytelling section */}
      <div className="relative z-10 bg-black backdrop-blur-md transition-colors duration-300 pt-20">
        <ProductGrid />
      </div>

      <footer className="w-full py-12 text-center text-gray-500 text-sm tracking-widest bg-black border-t border-white/10 relative z-10 transition-colors duration-300">
        <p>&copy; {new Date().getFullYear()} RAFA GARDEN. ALL RIGHTS RESERVED.</p>
      </footer>
    </main>
  );
}
