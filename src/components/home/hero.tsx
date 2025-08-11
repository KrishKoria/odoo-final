import { useEffect } from "react";
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
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / 500) * 100;
      document.documentElement.style.setProperty("--mx", `${x}%`);
      document.documentElement.style.setProperty("--my", `${y}%`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="qc-hero">
      <div className="container py-20 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="bg-background/70 inline-flex items-center gap-3 rounded-full border px-4 py-2 text-base">
              <MapPin className="h-5 w-5 opacity-70" /> QuickCourt — Local
              Sports Booking
            </div>
            <h1 className="mt-6 text-5xl leading-tight font-extrabold md:text-6xl lg:text-7xl">
              Find players & book sports venues nearby
            </h1>
            <p className="text-muted-foreground mt-5 max-w-prose text-xl leading-relaxed">
              Seamlessly explore top-rated courts and play with enthusiasts just
              like you.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Select value={city} onValueChange={onCityChange}>
                <SelectTrigger className="h-14 text-base sm:w-72">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c} className="py-3 text-base">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="lg"
                variant="hero"
                className="h-14 text-base sm:px-10"
              >
                <Search className="h-5 w-5" />
                Book Now
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <Image
              src={"/assets/hero-quickcourt.jpg"}
              alt="People playing multiple sports at modern urban courts"
              className="shadow-glow h-auto w-full rounded-xl object-cover"
              loading="eager"
              width={900}
              height={700}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
