"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Users,
  Trophy,
  Clock,
  Shield,
  Zap,
} from "lucide-react";
import Image from "next/image";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "./Navbar";
import Link from "next/link";

const topVenues = [
  {
    id: 1,
    name: "SBR Badminton",
    image: "/assets/modern-badminton-court.png",
    rating: 4.5,
    reviews: 124,
    location: "Vastrapur, Cir",
    price: 450,
    sports: ["Badminton", "Outdoor"],
    availability: "Available Now",
  },
  {
    id: 2,
    name: "Elite Sports Arena",
    image: "/assets/professional-badminton-court.png",
    rating: 4.8,
    reviews: 89,
    location: "Satellite, Cir",
    price: 600,
    sports: ["Tennis", "Indoor"],
    availability: "2 slots left",
  },
  {
    id: 3,
    name: "Champions Ground",
    image: "/assets/football-turf-ground.png",
    rating: 4.6,
    reviews: 156,
    location: "Bodakdev, Cir",
    price: 800,
    sports: ["Football", "Cricket"],
    availability: "Available Now",
  },
  {
    id: 4,
    name: "Urban Sports Hub",
    image: "/assets/outdoor-basketball-court.png",
    rating: 4.7,
    reviews: 67,
    location: "Navrangpura, Cir",
    price: 350,
    sports: ["Basketball", "Volleyball"],
    availability: "Available Now",
  },
];

const sportsCategories = [
  {
    name: "Badminton",
    image: "/assets/professional-badminton-court.png",
    venues: 45,
  },
  {
    name: "Football",
    image: "/assets/football-turf-ground.png",
    venues: 32,
  },
  {
    name: "Cricket",
    image: "/assets/cricket-ground-pavilion.png",
    venues: 28,
  },
  {
    name: "Swimming",
    image: "/swimming-pool-lanes.png",
    venues: 15,
  },
  {
    name: "Tennis",
    image: "/tennis-court-overhead.png",
    venues: 22,
  },
  {
    name: "Table Tennis",
    image: "/table-tennis-tournament.png",
    venues: 38,
  },
];

export default function Home() {
  const [location, setLocation] = useState("Ahmedabad");
  const [currentVenueIndex, setCurrentVenueIndex] = useState(0);

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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="border-emerald-200 bg-emerald-100 px-4 py-2 text-emerald-800">
                  <Zap className="mr-2 h-4 w-4" />
                  Book Instantly
                </Badge>
                <h1 className="text-4xl leading-tight font-bold text-gray-900 lg:text-6xl">
                  FIND PLAYERS &{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    VENUES
                  </span>{" "}
                  NEARBY
                </h1>
                <p className="text-xl leading-relaxed text-gray-600">
                  Seamlessly explore sports venues and play with sports
                  enthusiasts just like you! Connect, compete, and create
                  unforgettable moments.
                </p>
              </div>

              {/* Location Search */}
              <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <MapPin className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-emerald-600" />
                    <Input
                      placeholder="Enter your location..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-14 border-emerald-200 pl-12 text-lg focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <Button className="h-14 bg-gradient-to-r from-emerald-600 to-teal-600 px-8 text-lg font-semibold hover:from-emerald-700 hover:to-teal-700">
                    <Search className="mr-2 h-5 w-5" />
                    Find Venues
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">
                    500+
                  </div>
                  <div className="text-gray-600">Venues</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">
                    10K+
                  </div>
                  <div className="text-gray-600">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">25+</div>
                  <div className="text-gray-600">Sports</div>
                </div>
              </div>
            </div>

            {/* Right Image - Hidden on mobile */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 rotate-6 transform rounded-3xl bg-gradient-to-br from-emerald-400/20 to-teal-400/20" />
                <div className="relative -rotate-2 transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-transform duration-500 hover:rotate-0">
                  <Image
                    src="/assets/modern-badminton-court.png"
                    alt="Sports venue"
                    width={600}
                    height={400}
                    className="h-96 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="text-2xl font-bold">
                      Premium Sports Facilities
                    </div>
                    <div className="text-emerald-200">
                      Book your perfect venue today
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 animate-bounce rounded-2xl bg-white p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <div>
                    <div className="text-sm font-semibold">Top Rated</div>
                    <div className="text-xs text-gray-500">4.8★ Average</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-emerald-600 p-4 text-white shadow-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6" />
                  <div>
                    <div className="text-sm font-semibold">Active Now</div>
                    <div className="text-xs text-emerald-200">
                      2.3K+ Players
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            {/* Navigation Buttons */}
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

            {/* Venues Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {topVenues
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
                ))}
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
            {sportsCategories.map((sport) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-2xl font-bold text-transparent">
                QuickCourt
              </div>
              <p className="text-gray-400">
                Your ultimate platform for booking sports venues and connecting
                with fellow sports enthusiasts.
              </p>
              <div className="flex space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Quick Links</h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-gray-400 transition-colors hover:text-emerald-400"
                >
                  Find Venues
                </a>
                <a
                  href="#"
                  className="block text-gray-400 transition-colors hover:text-emerald-400"
                >
                  Sports Categories
                </a>
                <a
                  href="#"
                  className="block text-gray-400 transition-colors hover:text-emerald-400"
                >
                  How it Works
                </a>
                <a
                  href="#"
                  className="block text-gray-400 transition-colors hover:text-emerald-400"
                >
                  Pricing
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Support</h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-gray-400 transition-colors hover:text-emerald-400"
                >
                  Help Center
                </a>
                <a
                  href="#"
                  className="block text-gray-400 transition-colors hover:text-emerald-400"
                >
                  Contact Us
                </a>
                <a
                  href="#"
                  className="block text-gray-400 transition-colors hover:text-emerald-400"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="block text-gray-400 transition-colors hover:text-emerald-400"
                >
                  Privacy Policy
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 hello@quickcourt.com</p>
                <p>📞 +91 98765 43210</p>
                <p>📍 Ahmedabad, Gujarat</p>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-gray-400">
              © 2024 QuickCourt. All rights reserved.
            </p>
            <div className="mt-4 flex items-center space-x-4 md:mt-0">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span className="text-gray-400">Secure & Trusted Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
