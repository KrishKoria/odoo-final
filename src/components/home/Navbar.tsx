import { Github, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="border-border/60 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-md bg-[hsl(var(--brand))]"
            aria-hidden
          />
          <span className="text-lg font-extrabold tracking-tight">
            QUICKCOURT
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link
            href="#venues"
            className="transition-colors hover:text-[hsl(var(--brand))]"
          >
            Book
          </Link>
          <Link
            href="#sports"
            className="transition-colors hover:text-[hsl(var(--brand))]"
          >
            Sports
          </Link>
          <Link
            href="#about"
            className="transition-colors hover:text-[hsl(var(--brand))]"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden md:inline-flex">
            <Github />
            Star
          </Button>
          <Button variant="hero">
            <LogIn />
            Login / Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
