import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-20 border-t">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-md bg-[hsl(var(--brand))]"
                aria-hidden
              />
              <span className="text-lg font-extrabold tracking-tight">
                QUICKCOURT
              </span>
            </Link>
            <p className="text-muted-foreground mt-3 max-w-sm text-sm">
              Book top-rated sports venues and connect with players near you.
            </p>
            <div className="text-muted-foreground mt-3 inline-flex items-center gap-2 text-sm">
              <MapPin size={16} /> India — multiple cities
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="font-semibold">Explore</div>
              <ul className="mt-3 space-y-2 text-sm">
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
              <div className="font-semibold">Company</div>
              <ul className="mt-3 space-y-2 text-sm">
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
            <div className="font-semibold">Stay in the loop</div>
            <p className="text-muted-foreground mt-2 text-sm">
              Get updates on new venues and offers.
            </p>
            <form className="mt-4 flex gap-2">
              <Input type="email" placeholder="Your email" className="flex-1" />
              <Button variant="hero" className="px-6">
                Subscribe <ArrowRight />
              </Button>
            </form>
            <p className="text-muted-foreground mt-2 text-xs">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} QuickCourt. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
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
