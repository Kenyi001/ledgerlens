import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Reemplaza caracteres cirílicos/homóglifos por equivalentes latinos (evita fake USDC/AVAX) */
export function normalizeToLatin(s: string): string {
  const map: Record<string, string> = {
    "\u0405": "S", "\u0421": "C", "\u0410": "A", "\u0415": "E", "\u041E": "O",
    "\u0420": "P", "\u0425": "X", "\u0443": "y", "\u0435": "e", "\u043e": "o",
    "\u0441": "c", "\u0445": "x", "\u0440": "p", "\u0430": "a",
  }
  let out = ""
  for (const c of s) out += map[c] ?? c
  return out
}
