import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDashboardPath(role?: string): string {
  switch (role) {
    case "admin":
      return "/admin-dashboard";
    case "faculty":
      return "/faculty-dashboard";
    case "user":
      return "/dashboard";
    default:
      return "/dashboard";
  }
}
