"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import Image from "next/image";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "./Navbar";
import Link from "next/link";
import {
  getTopVenuesByLocation,
  getSportsCategories,
} from "@/actions/venue-actions";
import type { VenueListItem } from "@/lib/venue-transformers";
import Footer from "./footer";
import Hero from "./hero";

// Types for our data
interface SportCategory {
  name: string;
  image: string;
  venues: number;
}

export default function Home() {
  const [currentVenueIndex, setCurrentVenueIndex] = useState(0);
  const [location, setLocation] = useState("Ahmedabad");
  // State for dynamic data
  const [topVenues, setTopVenues] = useState<VenueListItem[]>([]);
  const [sportsCategories, setSportsCategories] = useState<SportCategory[]>([]);

  // Loading states
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [sportsLoading, setSportsLoading] = useState(true);

  // Fetch top venues based on location
  const fetchTopVenues = async (selectedLocation: string) => {
    setVenuesLoading(true);
    try {
      const venues = await getTopVenuesByLocation(selectedLocation, 4);
      setTopVenues(venues);
    } catch (error) {
      console.error("Error fetching venues:", error);
      // Fallback to empty array
      setTopVenues([]);
    } finally {
      setVenuesLoading(false);
    }
  };

  // Fetch sports categories
  const fetchSportsCategories = async () => {
    setSportsLoading(true);
    try {
      const categories = await getSportsCategories();
      // Transform to match UI expectations
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

  // Fetch platform statistics

  // Initial data fetching
  useEffect(() => {
    void fetchSportsCategories();
  }, []);

  // Refetch venues when location changes
  useEffect(() => {
    void fetchTopVenues(location);
  }, [location]);

  const nextVenues = () => {
    setCurrentVenueIndex(
      (prev) => (prev + 1) % Math.max(1, topVenues.length - 3),
    );
  };

  const prevVenues = () => {
    setCurrentVenueIndex(
      (prev) =>
        (prev - 1 + Math.max(1, topVenues.length - 3)) %
        Math.max(1, topVenues.length - 3),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <Navbar />
      {/* Hero Section */}
      <Hero location={location} setLocation={setLocation} />
      {/* Book Venues Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
                Book Venues
              </h2>
              <p className="text-lg text-gray-600">
                Top rated venues in {location}
              </p>
            </div>
            <Link
              href="/venues"
              className={buttonVariants({
                variant: "outline",
                class:
                  "group border-emerald-200 bg-transparent text-emerald-700 hover:bg-emerald-50",
              })}
            >
              See all venues
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative">
            {/* Navigation Buttons - only show if we have venues */}
            {!venuesLoading && topVenues.length > 4 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 transform border-emerald-200 bg-white shadow-lg hover:bg-emerald-50"
                  onClick={prevVenues}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 transform border-emerald-200 bg-white shadow-lg hover:bg-emerald-50"
                  onClick={nextVenues}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Venues Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {venuesLoading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, index) => (
                  <Card
                    key={index}
                    className="animate-pulse overflow-hidden border-emerald-100"
                  >
                    <div className="h-48 bg-gray-200" />
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="h-4 w-3/4 rounded bg-gray-200" />
                        <div className="h-3 w-1/2 rounded bg-gray-200" />
                        <div className="h-3 w-2/3 rounded bg-gray-200" />
                        <div className="h-8 rounded bg-gray-200" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : topVenues.length === 0 ? (
                // Empty state
                <div className="col-span-full py-12 text-center">
                  <div className="text-lg text-gray-500">
                    No venues found in {location}
                  </div>
                  <p className="mt-2 text-gray-400">
                    Try searching for a different location
                  </p>
                </div>
              ) : (
                topVenues
                  .slice(currentVenueIndex, currentVenueIndex + 4)
                  .map((venue) => (
                    <Card
                      key={venue.id}
                      className="group overflow-hidden border-emerald-100 transition-all duration-300 hover:shadow-xl"
                    >
                      <div className="relative">
                        <Image
                          src={venue.image || "/placeholder.svg"}
                          alt={venue.name}
                          width={300}
                          height={200}
                          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">
                            <Clock className="mr-1 h-3 w-3" />
                            {venue.availability}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>

                      <CardContent className="p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <h3 className="text-lg font-semibold transition-colors group-hover:text-emerald-600">
                            {venue.name}
                          </h3>
                          <div className="flex items-center space-x-1 text-sm">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{venue.rating}</span>
                            <span className="text-gray-500">
                              ({venue.reviews})
                            </span>
                          </div>
                        </div>

                        <div className="mb-3 flex items-center text-gray-600">
                          <MapPin className="mr-1 h-4 w-4" />
                          <span className="text-sm">{venue.location}</span>
                        </div>

                        <div className="mb-3 flex flex-wrap gap-1">
                          {venue.sports.map((sport) => (
                            <Badge
                              key={sport}
                              variant="outline"
                              className="border-emerald-200 text-xs text-emerald-700"
                            >
                              {sport}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <span className="text-2xl font-bold text-emerald-600">
                              ₹{venue.price}
                            </span>
                            <span className="text-sm text-gray-500">/hour</span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Sports Section */}
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
      <Footer />
    </div>
  );
}
