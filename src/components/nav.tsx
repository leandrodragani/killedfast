/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { LogIn, X, Menu } from "lucide-react";
import { Dialog } from "./ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import Link from "next/link";
import { Search } from "./search";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const navigation = [{ name: "Categories", href: "/categories" }];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative border-b">
      <div className="container">
        <div className="h-20 items-center hidden lg:flex">
          <Link
            href="/"
            className="font-bold text-2xl text-white flex items-center"
          >
            <Image
              src="/logo-killed-fast.png"
              width="40"
              height="40"
              alt="killedfast"
              className="mr-2"
            />
            KilledFast
          </Link>
          <nav className="flex items-center space-x-4 lg:space-x-6 ml-10">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button variant="secondary">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
        <div className="h-16 items-center lg:hidden flex justify-between">
          <Link
            href="/"
            className="font-bold text-2xl text-white flex items-center"
          >
            <Image
              src="/logo-killed-fast.png"
              width="30"
              height="30"
              alt="killedfast"
              className="mr-2"
            />
            KilledFast
          </Link>
          <Button
            variant="ghost"
            className="px-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
      </div>
      <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DialogContent className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-neutral-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">killedfast</span>
              <Image
                src="/logo-killed-fast.png"
                width="30"
                height="30"
                alt="killedfast"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-neutral-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-neutral-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 leading-7 font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <SignedOut>
                  <SignInButton>
                    <Button variant="secondary">
                      <LogIn className="mr-2 h-4 w-4" /> Login
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
