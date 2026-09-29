import { ArrowLeftRight, Calculator, Code2, Image as ImageIcon, Type, Wallet, Zap, type LucideIcon } from 'lucide-react';

export type CategoryId =
  | 'finance' | 'calculators' | 'image-tools' | 'text-tools' | 'converters' | 'developer-tools' | 'productivity';

export interface Category {
  id: CategoryId; // also the URL slug: /categories/:id
  name: string;
  description: string;
  icon: LucideIcon;
}

// To add a category: add its id to CategoryId, then add an entry here.
export const categories: Category[] = [
  { id: 'finance', name: 'Finance', description: 'Loans, EMIs and tax calculations.', icon: Wallet },
  { id: 'calculators', name: 'Calculators', description: 'Quick maths for everyday questions.', icon: Calculator },
  { id: 'image-tools', name: 'Image Tools', description: 'Compress and resize images in your browser.', icon: ImageIcon },
  { id: 'text-tools', name: 'Text Tools', description: 'Count, clean up and reformat text.', icon: Type },
  { id: 'converters', name: 'Converters', description: 'Convert between units and formats.', icon: ArrowLeftRight },
  { id: 'developer-tools', name: 'Developer Tools', description: 'Small utilities for building and sharing.', icon: Code2 },
  { id: 'productivity', name: 'Productivity', description: 'Small helpers that save time.', icon: Zap },
];

export const getCategory = (id: CategoryId): Category => categories.find((c) => c.id === id)!;
export const findCategory = (id?: string) => categories.find((c) => c.id === id);
