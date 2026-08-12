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

export const CategoryIcon = ({ iconName, category, type, className = "w-5 h-5", bgSize = "w-10 h-10" }) => {
  let IconComponent = Wallet;
  let bgClass = "bg-vault-surfaceHighlight text-vault-charcoal dark:text-vault-text border border-vault-border";

  if (type === 'refund') {
    IconComponent = RotateCcw;
    bgClass = "bg-vault-bronzeLight text-vault-bronze border border-vault-bronze/30";
  } else if (type === 'credit') {
    IconComponent = ArrowDownLeft;
    bgClass = "bg-vault-tealLight text-vault-teal border border-vault-teal/30";
  } else {
    switch (iconName || category) {
      case 'Utensils':
      case 'Food & Dining':
        IconComponent = Utensils;
        bgClass = "bg-vault-bronzeLight text-vault-bronze border border-vault-bronze/30";
        break;
      case 'Coffee':
        IconComponent = Coffee;
        bgClass = "bg-vault-bronzeLight text-vault-bronze border border-vault-bronze/30";
        break;
      case 'ShoppingBag':
      case 'Groceries':
        IconComponent = ShoppingBag;
        bgClass = "bg-vault-tealLight text-vault-teal border border-vault-teal/30";
        break;
      case 'Package':
      case 'Shopping':
        IconComponent = Package;
        bgClass = "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30";
        break;
      case 'Store':
        IconComponent = Store;
        bgClass = "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30";
        break;
      case 'Car':
      case 'Transport':
        IconComponent = Car;
        bgClass = "bg-vault-tealLight text-vault-teal border border-vault-teal/30";
        break;
      case 'Zap':
      case 'Utilities':
        IconComponent = Zap;
        bgClass = "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30";
        break;
      case 'Tv':
      case 'Subscriptions':
        IconComponent = Tv;
        bgClass = "bg-vault-bronzeLight text-vault-bronze border border-vault-bronze/30";
        break;
      case 'Home':
      case 'Rent':
        IconComponent = Home;
        bgClass = "bg-vault-tealLight text-vault-teal border border-vault-teal/30";
        break;
      case 'Activity':
        IconComponent = Activity;
        bgClass = "bg-vault-tealLight text-vault-teal border border-vault-teal/30";
        break;
      case 'Film':
      case 'Entertainment':
        IconComponent = Film;
        bgClass = "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30";
        break;
      case 'Plane':
      case 'Travel':
        IconComponent = Plane;
        bgClass = "bg-vault-bronzeLight text-vault-bronze border border-vault-bronze/30";
        break;
      case 'Laptop':
      case 'Tech':
        IconComponent = Laptop;
        bgClass = "bg-vault-tealLight text-vault-teal border border-vault-teal/30";
        break;
      case 'ArrowUpRight':
      case 'Transfers':
        IconComponent = ArrowUpRight;
        bgClass = "bg-vault-bronzeLight text-vault-bronze border border-vault-bronze/30";
        break;
      default:
        IconComponent = Wallet;
        bgClass = "bg-vault-paper text-vault-charcoal dark:text-vault-text border border-vault-border";
    }
  }

  return (
    <div className={`${bgSize} rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}>
      <IconComponent className={className} />
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
