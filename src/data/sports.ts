export type SportCategory = {
  slug: string;
  name: string;
  image: string;
};

export const sportCategories: SportCategory[] = [
  { slug: "badminton", name: "Badminton", image: "/assets/badminton.jpg" },
  { slug: "football", name: "Football", image: "/assets/football.jpg" },
  { slug: "cricket", name: "Cricket", image: "/assets/cricket.jpg" },
  { slug: "swimming", name: "Swimming", image: "/assets/swimming.jpg" },
  { slug: "tennis", name: "Tennis", image: "/assets/tennis.jpg" },
];
