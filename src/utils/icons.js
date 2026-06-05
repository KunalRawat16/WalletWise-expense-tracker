import { 
  Utensils, 
  Home, 
  Car, 
  Zap, 
  Film, 
  HeartPulse, 
  ShoppingBag, 
  GraduationCap, 
  HelpCircle 
} from 'lucide-react';

export const categoryIconMap = {
  food: Utensils,
  rent: Home,
  transportation: Car,
  utilities: Zap,
  entertainment: Film,
  healthcare: HeartPulse,
  shopping: ShoppingBag,
  education: GraduationCap,
  other: HelpCircle
};

export const getCategoryIcon = (id) => {
  return categoryIconMap[id] || HelpCircle;
};
