"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Button } from "./ui/button";

export function Search() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        variant="outline"
        className="md:w-[100px] lg:w-[300px] inline-flex justify-start text-muted-foreground cursor-text"
        size="sm"
        onClick={() => setOpen(true)}
      >
        Search...
      </Button>

      {/* <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog> */}
    </div>
  );
}
