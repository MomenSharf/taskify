import { avatarColors } from "@/constants";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fakePromise<T = void>(result?: T, delay = 1000): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result as T);
    }, delay);
  });
}

export const getRandomAvatarColor = () => {
  return avatarColors[Math.floor(Math.random() * avatarColors.length)]
}