"use client";
import { venuesData } from "@/data/venues";
import { sportCategories } from "@/data/sports";
import { useMemo, useState } from "react";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/hero";
import VenuesSection from "@/components/home/VenuesSection";
import SportsCategories from "@/components/home/SportsCategories";
import Footer from "@/components/home/footer";

const Index = () => {
  const [city, setCity] = useState("Ahmedabad");

  const topVenues = useMemo(() => {
    return venuesData
      .filter((v) => v.city === city)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [city]);

  return (
    <div>
      <Navbar />
      <main>
        <Hero city={city} onCityChange={setCity} />
        <VenuesSection
          venues={
            topVenues.length
              ? topVenues
              : venuesData.sort((a, b) => b.rating - a.rating).slice(0, 8)
          }
        />
        <SportsCategories categories={sportCategories} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
