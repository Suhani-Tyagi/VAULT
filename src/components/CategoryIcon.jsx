import React from 'react';
import { 
  Utensils, 
  ShoppingBag, 
  RotateCcw, 
  Car, 
  Package, 
  Store, 
  Coffee, 
  ArrowDownLeft, 
  ArrowUpRight,
  Zap, 
  Tv, 
  Home, 
  Wallet, 
  Activity, 
  Film,
  Plane,
  Laptop,
  Target,
  ShieldCheck,
  CreditCard,
  Building,
  UserCheck
} from 'lucide-react';

export const CategoryIcon = ({ iconName, category, type, className = "w-5 h-5", bgSize = "w-10 h-10" }) => {
  let IconComponent = Wallet;
  let bgClass = "bg-vault-surfaceHighlight text-vault-charcoal border border-vault-border";

  if (type === 'refund') {
    IconComponent = RotateCcw;
    bgClass = "bg-vault-terracottaLight text-vault-terracotta border border-vault-terracotta/30";
  } else if (type === 'credit') {
    IconComponent = ArrowDownLeft;
    bgClass = "bg-vault-sageLight text-vault-sage border border-vault-sage/30";
  } else {
    switch (iconName || category) {
      case 'Utensils':
      case 'Food & Dining':
        IconComponent = Utensils;
        bgClass = "bg-vault-terracottaLight text-vault-terracotta border border-vault-terracotta/30";
        break;
      case 'Coffee':
        IconComponent = Coffee;
        bgClass = "bg-vault-terracottaLight text-vault-terracotta border border-vault-terracotta/30";
        break;
      case 'ShoppingBag':
      case 'Groceries':
        IconComponent = ShoppingBag;
        bgClass = "bg-vault-sageLight text-vault-sage border border-vault-sage/30";
        break;
      case 'Package':
      case 'Shopping':
        IconComponent = Package;
        bgClass = "bg-vault-amberLight text-vault-amber border border-vault-amber/30";
        break;
      case 'Store':
        IconComponent = Store;
        bgClass = "bg-vault-amberLight text-vault-amber border border-vault-amber/30";
        break;
      case 'Car':
      case 'Transport':
        IconComponent = Car;
        bgClass = "bg-vault-sageLight text-vault-sage border border-vault-sage/30";
        break;
      case 'Zap':
      case 'Utilities':
        IconComponent = Zap;
        bgClass = "bg-vault-amberLight text-vault-amber border border-vault-amber/30";
        break;
      case 'Tv':
      case 'Subscriptions':
        IconComponent = Tv;
        bgClass = "bg-vault-terracottaLight text-vault-terracotta border border-vault-terracotta/30";
        break;
      case 'Home':
      case 'Rent':
        IconComponent = Home;
        bgClass = "bg-vault-sageLight text-vault-sage border border-vault-sage/30";
        break;
      case 'Activity':
        IconComponent = Activity;
        bgClass = "bg-vault-sageLight text-vault-sage border border-vault-sage/30";
        break;
      case 'Film':
      case 'Entertainment':
        IconComponent = Film;
        bgClass = "bg-vault-amberLight text-vault-amber border border-vault-amber/30";
        break;
      case 'Plane':
      case 'Travel':
        IconComponent = Plane;
        bgClass = "bg-vault-terracottaLight text-vault-terracotta border border-vault-terracotta/30";
        break;
      case 'Laptop':
      case 'Tech':
        IconComponent = Laptop;
        bgClass = "bg-vault-sageLight text-vault-sage border border-vault-sage/30";
        break;
      case 'ArrowUpRight':
      case 'Transfers':
        IconComponent = ArrowUpRight;
        bgClass = "bg-vault-terracottaLight text-vault-terracotta border border-vault-terracotta/30";
        break;
      default:
        IconComponent = Wallet;
        bgClass = "bg-vault-paper text-vault-charcoal border border-vault-border";
    }
  }

  return (
    <div className={`${bgSize} rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}>
      <IconComponent className={className} />
    </div>
  );
};
