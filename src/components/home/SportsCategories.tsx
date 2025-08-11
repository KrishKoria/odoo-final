import type { SportCategory } from "@/data/sports";
import Image from "next/image";

interface SportsCategoriesProps {
  categories: SportCategory[];
}

const SportsCategories = ({ categories }: SportsCategoriesProps) => {
  return (
    <section id="sports" className="py-14">
      <div className="container">
        <div className="mb-6">
          <h2 className="text-2xl font-bold md:text-3xl">Popular Sports</h2>
          <p className="text-muted-foreground">
            Pick a sport to discover venues near you
          </p>
        </div>
        <div className="qc-section-panel">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((c) => (
              <button
                key={c.slug}
                className="group qc-glow-card hover-scale animate-enter text-left"
              >
                <Image
                  src={c.image}
                  alt={`${c.name} category`}
                  className="h-28 w-full object-cover"
                  loading="lazy"
                  width={400}
                  height={200}
                />
                <div className="p-3">
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-muted-foreground text-xs">
                    Explore courts
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SportsCategories;
