import { Star, MapPin, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Venue } from "@/data/venues";
import Image from "next/image";
import Link from "next/link";

interface VenuesSectionProps {
  venues: Venue[];
}

const VenueCard = ({ v }: { v: Venue }) => (
  <Card className="border-border/60 qc-glow-card overflow-hidden transition-colors hover:border-[hsl(var(--brand))]">
    <CardHeader className="p-0">
      <Image
        src={v.image}
        alt={`${v.name} venue in ${v.city}`}
        className="h-52 w-full object-cover"
        loading="lazy"
        width={450}
        height={300}
      />
    </CardHeader>
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{v.name}</h3>
        <div className="inline-flex items-center gap-2 text-base">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>{v.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-base">
        <MapPin size={18} />
        {v.area}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {v.tags.map((t) => (
          <span key={t} className="qc-badge px-3 py-1">
            {t}
          </span>
        ))}
      </div>
    </CardContent>
    <CardFooter className="p-5 pt-0">
      <Button className="h-11 w-full text-base" variant="secondary">
        View Details
      </Button>
    </CardFooter>
  </Card>
);

const VenuesSection = ({ venues }: VenuesSectionProps) => {
  return (
    <section id="venues" className="container py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Book Venues
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Top rated around your location
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/venues"
            className="story-link flex items-center text-base font-medium"
          >
            <span>See all venues</span>
          </Link>
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>
      <div className="qc-section-panel">
        <Carousel>
          <CarouselContent className="gap-2">
            {venues.map((v, idx) => (
              <CarouselItem
                key={v.id}
                className="animate-fade-in basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <VenueCard v={v} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="h-12 w-12" />
          <CarouselNext className="h-12 w-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default VenuesSection;
