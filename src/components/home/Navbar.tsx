"use client";

import { LogIn, User, LogOut } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <header className="border-border/60 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-md bg-[hsl(var(--brand))]"
            aria-hidden
          />
          <span className="text-xl font-extrabold tracking-tight">
            QUICKCOURT
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-base md:flex">
          <Link
            href="/venues"
            className="font-medium transition-colors hover:text-[hsl(var(--brand))]"
          >
            Book
          </Link>
          <Link
            href="#sports"
            className="font-medium transition-colors hover:text-[hsl(var(--brand))]"
          >
            Sports
          </Link>
          <Link
            href="#about"
            className="font-medium transition-colors hover:text-[hsl(var(--brand))]"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage
                    src={session.user.image ?? ""}
                    alt={session.user.name ?? "User"}
                  />
                  <AvatarFallback className="text-base">
                    {session.user.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 py-3"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-base">Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-3 text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-base">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              className={buttonVariants({ variant: "hero", size: "lg" })}
              href="/auth/login"
            >
              <LogIn className="h-5 w-5" />
              <span className="text-base">Login / Sign Up</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
