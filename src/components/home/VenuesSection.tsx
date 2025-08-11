import { Star, MapPin } from "lucide-react";
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

interface VenuesSectionProps {
  venues: Venue[];
}

const VenueCard = ({ v }: { v: Venue }) => (
  <Card className="border-border/60 qc-glow-card overflow-hidden transition-colors hover:border-[hsl(var(--brand))]">
    <CardHeader className="p-0">
      <Image
        src={v.image}
        alt={`${v.name} venue in ${v.city}`}
        className="h-44 w-full object-cover"
        loading="lazy"
        width={400}
        height={200}
      />
    </CardHeader>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{v.name}</h3>
        <div className="inline-flex items-center gap-1 text-sm">
          <Star className="text-yellow-500" />
          <span>{v.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
        <MapPin size={16} />
        {v.area}
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {v.tags.map((t) => (
          <span key={t} className="qc-badge">
            {t}
          </span>
        ))}
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Button className="w-full" variant="secondary">
        View Details
      </Button>
    </CardFooter>
  </Card>
);

const VenuesSection = ({ venues }: VenuesSectionProps) => {
  return (
    <section id="venues" className="container py-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">Book Venues</h2>
          <p className="text-muted-foreground">
            Top rated around your location
          </p>
        </div>
        <a href="/venues" className="story-link text-sm">
          See all venues
        </a>
      </div>
      <div className="qc-section-panel">
        <Carousel>
          <CarouselContent>
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
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default VenuesSection;
