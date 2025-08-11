import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-24 border-t">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-md bg-[hsl(var(--brand))]"
                aria-hidden
              />
              <span className="text-xl font-extrabold tracking-tight">
                QUICKCOURT
              </span>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-sm text-base leading-relaxed">
              Book top-rated sports venues and connect with players near you.
            </p>
            <div className="text-muted-foreground mt-4 inline-flex items-center gap-3 text-base">
              <MapPin size={20} /> India — multiple cities
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-lg font-semibold">Explore</div>
              <ul className="mt-4 space-y-3 text-base">
                <li>
                  <a className="story-link" href="#venues">
                    Venues
                  </a>
                </li>
                <li>
                  <a className="story-link" href="#sports">
                    Sports
                  </a>
                </li>
                <li>
                  <a className="story-link" href="#">
                    How it works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-lg font-semibold">Company</div>
              <ul className="mt-4 space-y-3 text-base">
                <li>
                  <a className="story-link" href="#">
                    About
                  </a>
                </li>
                <li>
                  <a className="story-link" href="#">
                    Careers
                  </a>
                </li>
                <li>
                  <a className="story-link" href="#">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="text-lg font-semibold">Stay in the loop</div>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">
              Get updates on new venues and offers.
            </p>
            <form className="mt-5 flex gap-3">
              <Input
                type="email"
                placeholder="Your email"
                className="h-12 flex-1 text-base"
              />
              <Button variant="hero" className="h-12 px-8 text-base">
                Subscribe <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
            <p className="text-muted-foreground mt-3 text-sm">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-base">
            © {new Date().getFullYear()} QuickCourt. All rights reserved.
          </p>
          <div className="flex gap-8 text-base">
            <a href="#" className="story-link">
              Privacy
            </a>
            <a href="#" className="story-link">
              Terms
            </a>
            <a href="#" className="story-link">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
