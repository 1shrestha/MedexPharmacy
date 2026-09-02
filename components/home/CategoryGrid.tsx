import Link from "next/link";
import { Pill, Sparkles, Droplet, Baby, Cross, Activity, Sun, Stethoscope } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Pill,
  Sparkles,
  Droplet,
  Baby,
  Cross,
  Activity,
  Sun,
  Stethoscope,
};

export function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.icon] ?? Pill;
          return (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-medex-pista hover:bg-medex-pink transition-colors text-center"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-medex-primary card-shadow">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-700">{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
