"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./footer";
import Hero from "./hero";
import SportsCategories from "./SportsCategories";
import VenuesSection from "./VenuesSection";

export default function Home() {
  const [location, setLocation] = useState("Ahmedabad");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Navbar />
      <Hero location={location} setLocation={setLocation} />
      <VenuesSection location={location} />
      <SportsCategories />
      <Footer />
    </div>
  );
}
