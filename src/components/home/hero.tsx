import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";
import Image from "next/image";

interface HeroProps {
  city: string;
  onCityChange: (city: string) => void;
}

const cities = ["Ahmedabad", "Bengaluru", "Mumbai", "Pune", "Delhi"];

const Hero = ({ city, onCityChange }: HeroProps) => {
  const [mx, setMx] = useState(50);
  const [my, setMy] = useState(50);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / 500) * 100;
      setMx(x);
      setMy(y);
      document.documentElement.style.setProperty("--mx", `${x}%`);
      document.documentElement.style.setProperty("--my", `${y}%`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="qc-hero">
      <div className="container py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="bg-background/70 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              <MapPin className="opacity-70" /> QuickCourt — Local Sports
              Booking
            </div>
            <h1 className="mt-4 text-4xl leading-tight font-extrabold md:text-5xl">
              Find players & book sports venues nearby
            </h1>
            <p className="text-muted-foreground mt-3 max-w-prose text-lg">
              Seamlessly explore top-rated courts and play with enthusiasts just
              like you.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Select value={city} onValueChange={onCityChange}>
                <SelectTrigger className="sm:w-64">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="lg" variant="hero" className="sm:px-8">
                <Search />
                Book Now
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <Image
              src={"/assets/hero-quickcourt.jpg"}
              alt="People playing multiple sports at modern urban courts"
              className="shadow-glow h-auto w-full rounded-lg object-cover"
              loading="eager"
              width={800}
              height={600}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
