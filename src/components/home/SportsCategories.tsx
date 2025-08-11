import type { SportCategory } from "@/data/sports";
import Image from "next/image";

interface SportsCategoriesProps {
  categories: SportCategory[];
}

const SportsCategories = ({ categories }: SportsCategoriesProps) => {
  return (
    <section id="sports" className="py-20">
      <div className="container">
        <div className="mb-10">
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Popular Sports
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Pick a sport to discover venues near you
          </p>
        </div>
        <div className="qc-section-panel">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((c) => (
              <button
                key={c.slug}
                className="group qc-glow-card hover-scale animate-enter text-left"
              >
                <Image
                  src={c.image}
                  alt={`${c.name} category`}
                  className="h-36 w-full rounded-t-lg object-cover"
                  loading="lazy"
                  width={400}
                  height={250}
                />
                <div className="p-4">
                  <div className="text-base font-semibold">{c.name}</div>
                  <div className="text-muted-foreground mt-1 text-sm">
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
