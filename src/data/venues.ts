export type Venue = {
  id: string;
  name: string;
  city: string;
  area: string;
  rating: number;
  tags: string[];
  image: string;
};

export const venuesData: Venue[] = [
  {
    id: "1",
    name: "SBR Badminton",
    city: "Ahmedabad",
    area: "Vasna",
    rating: 4.8,
    tags: ["Indoor", "Top Rated"],
    image: "/assets/badminton-venue.jpg",
  },
  {
    id: "2",
    name: "Metro Sports Arena",
    city: "Ahmedabad",
    area: "Ashram Rd",
    rating: 4.6,
    tags: ["Outdoor", "Budget"],
    image: "/assets/badminton-venue.jpg",
  },
  {
    id: "3",
    name: "Indiranagar Courts",
    city: "Bengaluru",
    area: "Indiranagar",
    rating: 4.9,
    tags: ["Indoor", "Premium"],
    image: "/assets/badminton-venue.jpg",
  },
  {
    id: "4",
    name: "Marine Drive Turf",
    city: "Mumbai",
    area: "Marine Lines",
    rating: 4.7,
    tags: ["Outdoor", "Football"],
    image: "/assets/badminton-venue.jpg",
  },
  {
    id: "5",
    name: "Koregaon Sports",
    city: "Pune",
    area: "Koregaon Park",
    rating: 4.5,
    tags: ["Indoor"],
    image: "/assets/badminton-venue.jpg",
  },
  {
    id: "6",
    name: "DLF Courts",
    city: "Delhi",
    area: "DLF Phase 3",
    rating: 4.8,
    tags: ["Indoor", "Badminton"],
    image: "/assets/badminton-venue.jpg",
  },
];
