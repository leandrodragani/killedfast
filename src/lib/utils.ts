import { ProductStatus } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapStatusToLabel(status: ProductStatus) {
  switch (status) {
    case ProductStatus.ALIVE:
      return "Alive";
    case ProductStatus.DEAD:
      return "Dead";
    case ProductStatus.ALMOST_DEAD:
      return "Almost dead";
    case ProductStatus.BARELY_ALIVE:
      return "Barely alive";
    default:
      return "Unknown";
  }
}
