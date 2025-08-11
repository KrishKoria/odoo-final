"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Star,
  Filter,
  Heart,
  Share2,
  Clock,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Navbar from "@/components/home/Navbar";

const venues = [
  {
    id: 1,
    name: "Elite Sports Arena",
    image: "/assets/modern-badminton-court.png",
    sports: ["Badminton", "Tennis"],
    price: 450,
    location: "Vastrapur, Ahmedabad",
    rating: 4.8,
    reviews: 124,
    type: "Indoor",
    amenities: ["AC", "Parking", "Changing Room"],
    availability: "Available Now",
  },
  {
    id: 2,
    name: "Champions Turf Ground",
    image: "/assets/football-turf-ground.png",
    sports: ["Football", "Cricket"],
    price: 800,
    location: "Satellite, Ahmedabad",
    rating: 4.6,
    reviews: 89,
    type: "Outdoor",
    amenities: ["Floodlights", "Parking", "Cafeteria"],
    availability: "2 slots left",
  },
  {
    id: 3,
    name: "Ace Tennis Club",
    image: "/assets/indoor-tennis-court.png",
    sports: ["Tennis", "Squash"],
    price: 600,
    location: "Bodakdev, Ahmedabad",
    rating: 4.9,
    reviews: 156,
    type: "Indoor",
    amenities: ["AC", "Pro Shop", "Coaching"],
    availability: "Available Now",
  },
  {
    id: 4,
    name: "Urban Sports Complex",
    image: "/assets/outdoor-basketball-court.png",
    sports: ["Basketball", "Volleyball"],
    price: 350,
    location: "Navrangpura, Ahmedabad",
    rating: 4.4,
    reviews: 67,
    type: "Outdoor",
    amenities: ["Parking", "Water Cooler"],
    availability: "Available Now",
  },
  {
    id: 5,
    name: "Premier Badminton Center",
    image: "/assets/professional-badminton-court.png",
    sports: ["Badminton"],
    price: 400,
    location: "Paldi, Ahmedabad",
    rating: 4.7,
    reviews: 203,
    type: "Indoor",
    amenities: ["AC", "Equipment Rental", "Parking"],
    availability: "3 slots left",
  },
  {
    id: 6,
    name: "Riverside Cricket Ground",
    image: "/assets/cricket-ground-pavilion.png",
    sports: ["Cricket"],
    price: 1200,
    location: "Sabarmati, Ahmedabad",
    rating: 4.5,
    reviews: 45,
    type: "Outdoor",
    amenities: ["Pavilion", "Scoreboard", "Parking"],
    availability: "Available Now",
  },
];

const sportTypes = [
  "All Sports",
  "Badminton",
  "Tennis",
  "Football",
  "Cricket",
  "Basketball",
  "Volleyball",
  "Squash",
];
const venueTypes = ["All Types", "Indoor", "Outdoor"];

export default function VenuesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [selectedVenueType, setSelectedVenueType] = useState("All Types");
  const [priceRange, setPriceRange] = useState([100, 1500]);
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport =
      selectedSport === "All Sports" || venue.sports.includes(selectedSport);
    const matchesType =
      selectedVenueType === "All Types" || venue.type === selectedVenueType;
    const matchesPrice =
      priceRange[0] &&
      priceRange[1] &&
      venue.price >= priceRange[0] &&
      venue.price <= priceRange[1];
    const matchesRating = venue.rating >= minRating;

    return (
      matchesSearch &&
      matchesSport &&
      matchesType &&
      matchesPrice &&
      matchesRating
    );
  });

  const sortedVenues = [...filteredVenues].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating; // Highest rating first
      case "price-low":
        return a.price - b.price; // Lowest price first
      case "price-high":
        return b.price - a.price; // Highest price first
      case "name":
        return a.name.localeCompare(b.name); // Alphabetical order
      default:
        return 0;
    }
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(sortedVenues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVenues = sortedVenues.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-semibold">Sport Type</h3>
        <Select value={selectedSport} onValueChange={setSelectedSport}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sportTypes.map((sport) => (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Venue Type</h3>
        <Select value={selectedVenueType} onValueChange={setSelectedVenueType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {venueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Price Range (per hour)</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={2000}
            min={100}
            step={50}
            className="mb-2"
          />
          <div className="text-muted-foreground flex justify-between text-sm">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Minimum Rating</h3>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={(checked) =>
                  setMinRating(checked ? rating : 0)
                }
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="flex items-center space-x-1"
              >
                <span>{rating}</span>
                <div className="flex">
                  {[...Array<number>(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">& up</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Sports Venues in <span className="text-emerald-600">Ahmedabad</span>
          </h1>
          <p className="text-lg text-gray-600">
            Discover and book nearby venues for your favorite sports
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search venues by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-10"
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden items-center space-x-4 lg:flex">
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sportTypes.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedVenueType}
                onValueChange={setSelectedVenueType}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {venueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="bg-transparent lg:hidden">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Venues</SheetTitle>
                  <SheetDescription>
                    Refine your search to find the perfect venue
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden w-80 lg:block">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="mb-4 flex items-center text-lg font-semibold">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </h2>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, sortedVenues.length)} of{" "}
                {sortedVenues.length} venues
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Sort by Rating</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Venue Grid */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginatedVenues.map((venue) => (
                <Card
                  key={venue.id}
                  className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative">
                    <Image
                      src={venue.image || "/placeholder.svg"}
                      alt={venue.name}
                      width={300}
                      height={200}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 bg-white/80 p-0 hover:bg-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 bg-white/80 p-0 hover:bg-white"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant={
                          venue.type === "Indoor" ? "default" : "secondary"
                        }
                        className="bg-white/90 text-gray-800"
                      >
                        {venue.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge
                        variant="secondary"
                        className="border-emerald-200 bg-emerald-100 text-emerald-800"
                      >
                        <Zap className="mr-1 h-3 w-3" />
                        {venue.availability}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="text-lg font-semibold transition-colors group-hover:text-emerald-600">
                        {venue.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{venue.rating}</span>
                        <span className="text-gray-500">({venue.reviews})</span>
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
                          className="text-xs"
                        >
                          {sport}
                        </Badge>
                      ))}
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-2xl font-bold text-emerald-600">
                          ₹{venue.price}
                        </span>
                        <span className="text-sm text-gray-500">/hour</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="mr-1 h-4 w-4" />
                        <span>{venue.amenities.length} amenities</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => router.push(`/venues/${venue.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {[...Array<number>(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(i + 1)}
                    className={
                      currentPage === i + 1
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : ""
                    }
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
