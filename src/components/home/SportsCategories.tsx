"use client";
import { getSportsCategories } from "@/actions/venue-actions";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
interface SportCategory {
  name: string;
  image: string;
  venues: number;
}
const SportsCategories = () => {
  const [sportsCategories, setSportsCategories] = useState<SportCategory[]>([]);
  const [sportsLoading, setSportsLoading] = useState(true);
  const fetchSportsCategories = async () => {
    setSportsLoading(true);
    try {
      const categories = await getSportsCategories();
      const formattedCategories = categories.map((cat) => ({
        name: cat.name,
        image: cat.image,
        venues: cat.venues,
      }));
      setSportsCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching sports categories:", error);
      setSportsCategories([]);
    } finally {
      setSportsLoading(false);
    }
  };
  useEffect(() => {
    void fetchSportsCategories();
  }, []);
  return (
    <section className="bg-gradient-to-br from-gray-50 to-emerald-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
            Popular Sports
          </h2>
          <p className="text-lg text-gray-600">
            Choose your favorite sport and find the perfect venue
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {sportsLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="animate-pulse overflow-hidden border-0"
              >
                <div className="h-32 bg-gray-200" />
              </Card>
            ))
          ) : sportsCategories.length === 0 ? (
            // Empty state
            <div className="col-span-full py-12 text-center">
              <div className="text-gray-500">
                No sports categories available
              </div>
            </div>
          ) : (
            sportsCategories.map((sport) => (
              <Card
                key={sport.name}
                className="group cursor-pointer overflow-hidden border-0 transition-all duration-300 hover:shadow-xl"
              >
                <div className={`relative h-32`}>
                  <Image
                    src={sport.image || "/placeholder.svg"}
                    alt={sport.name}
                    fill
                    className="object-cover mix-blend-overlay transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="text-lg font-bold">{sport.name}</div>
                    <div className="text-xs opacity-90">
                      {sport.venues} venues
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SportsCategories;
