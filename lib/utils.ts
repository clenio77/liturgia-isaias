import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLiturgicalDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getLiturgicalColor(liturgicalTime: string): string {
  const colors = {
    'ADVENT': 'purple',
    'CHRISTMAS': 'white',
    'LENT': 'purple',
    'EASTER': 'white',
    'ORDINARY': 'green',
    'SPECIAL': 'red'
  }
  return colors[liturgicalTime as keyof typeof colors] || 'green'
}
