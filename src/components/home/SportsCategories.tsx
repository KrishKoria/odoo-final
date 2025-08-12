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

// Sports category image mapping
const SPORT_IMAGE_MAP: Record<string, string> = {
  Badminton: "/assets/sports/badminton.jpg",
  Tennis: "/assets/sports/tennis.jpg",
  Football: "/assets/sports/football.jpg",
  Cricket: "/assets/sports/cricket.jpg",
  Basketball: "/assets/sports/basketball.jpg",
  Swimming: "/assets/sports/swimming.jpg",
  "Table Tennis": "/assets/sports/tabletennis.jpg",
  Volleyball: "/assets/sports/volleyball.jpg",
  Squash: "/assets/sports/squash.jpg",
};

// Function to get sport image with fallback
const getSportImage = (sportName: string, originalImage?: string): string => {
  // If there's an original image and it's not placeholder, use it
  if (originalImage && !originalImage.includes("placeholder")) {
    return originalImage;
  }

  // Try to find exact match in the map
  const exactMatch = SPORT_IMAGE_MAP[sportName];
  if (exactMatch) {
    return exactMatch;
  }

  // Try to find partial match (case insensitive)
  const partialMatch = Object.keys(SPORT_IMAGE_MAP).find(
    (key) =>
      key.toLowerCase().includes(sportName.toLowerCase()) ||
      sportName.toLowerCase().includes(key.toLowerCase()),
  );

  if (partialMatch) {
    return SPORT_IMAGE_MAP[partialMatch];
  }

  // Default fallback
  return "/assets/sports/badminton.jpg";
};
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
                    src={getSportImage(sport.name, sport.image)}
                    alt={sport.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="text-lg font-bold drop-shadow-lg">
                      {sport.name}
                    </div>
                    <div className="text-xs opacity-90 drop-shadow-md">
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
