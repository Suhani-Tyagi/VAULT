import React from 'react';
import PropTypes from 'prop-types';
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
  Laptop
} from 'lucide-react';

export const CategoryIcon = ({ iconName, category, type, className = "w-4 h-4", bgSize = "w-8 h-8" }) => {
  let IconComponent = Wallet;
  let textClass = "text-vault-ink dark:text-vault-text";
  let bgClass = "bg-vault-surfaceHighlight/50 border border-vault-rule";

  if (type === 'refund') {
    IconComponent = RotateCcw;
    textClass = "text-vault-reserveBlue";
    bgClass = "bg-vault-reserveBlueLight border border-vault-reserveBlue/30";
  } else if (type === 'credit') {
    IconComponent = ArrowDownLeft;
    textClass = "text-vault-emerald";
    bgClass = "bg-vault-emeraldLight border border-vault-emerald/30";
  } else {
    switch (iconName || category) {
      case 'Utensils':
      case 'Food & Dining':
        IconComponent = Utensils;
        textClass = "text-vault-reserveBlue";
        bgClass = "bg-vault-reserveBlueLight border border-vault-reserveBlue/20";
        break;
      case 'Coffee':
        IconComponent = Coffee;
        textClass = "text-vault-reserveBlue";
        bgClass = "bg-vault-reserveBlueLight border border-vault-reserveBlue/20";
        break;
      case 'ShoppingBag':
      case 'Groceries':
        IconComponent = ShoppingBag;
        textClass = "text-vault-emerald";
        bgClass = "bg-vault-emeraldLight border border-vault-emerald/20";
        break;
      case 'Package':
      case 'Shopping':
        IconComponent = Package;
        textClass = "text-amber-600 dark:text-amber-400";
        bgClass = "bg-amber-500/10 border border-amber-500/20";
        break;
      case 'Store':
        IconComponent = Store;
        textClass = "text-amber-600 dark:text-amber-400";
        bgClass = "bg-amber-500/10 border border-amber-500/20";
        break;
      case 'Car':
      case 'Transport':
        IconComponent = Car;
        textClass = "text-vault-emerald";
        bgClass = "bg-vault-emeraldLight border border-vault-emerald/20";
        break;
      case 'Zap':
      case 'Utilities':
        IconComponent = Zap;
        textClass = "text-amber-600 dark:text-amber-400";
        bgClass = "bg-amber-500/10 border border-amber-500/20";
        break;
      case 'Tv':
      case 'Subscriptions':
        IconComponent = Tv;
        textClass = "text-vault-reserveBlue";
        bgClass = "bg-vault-reserveBlueLight border border-vault-reserveBlue/20";
        break;
      case 'Home':
      case 'Rent':
        IconComponent = Home;
        textClass = "text-vault-emerald";
        bgClass = "bg-vault-emeraldLight border border-vault-emerald/20";
        break;
      case 'Activity':
        IconComponent = Activity;
        textClass = "text-vault-emerald";
        bgClass = "bg-vault-emeraldLight border border-vault-emerald/20";
        break;
      case 'Film':
      case 'Entertainment':
        IconComponent = Film;
        textClass = "text-amber-600 dark:text-amber-400";
        bgClass = "bg-amber-500/10 border border-amber-500/20";
        break;
      case 'Plane':
      case 'Travel':
        IconComponent = Plane;
        textClass = "text-vault-reserveBlue";
        bgClass = "bg-vault-reserveBlueLight border border-vault-reserveBlue/20";
        break;
      case 'Laptop':
      case 'Tech':
        IconComponent = Laptop;
        textClass = "text-vault-emerald";
        bgClass = "bg-vault-emeraldLight border border-vault-emerald/20";
        break;
      case 'ArrowUpRight':
      case 'Transfers':
        IconComponent = ArrowUpRight;
        textClass = "text-vault-reserveBlue";
        bgClass = "bg-vault-reserveBlueLight border border-vault-reserveBlue/20";
        break;
      default:
        IconComponent = Wallet;
        textClass = "text-vault-ink dark:text-vault-text";
        bgClass = "bg-vault-paper border border-vault-rule";
    }
  }

  return (
    <div className={`${bgSize} rounded-lg flex items-center justify-center shrink-0 ${bgClass}`}>
      <IconComponent className={`${className} ${textClass}`} />
    </div>
  );
};

CategoryIcon.propTypes = {
  iconName: PropTypes.string,
  category: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  bgSize: PropTypes.string
};
