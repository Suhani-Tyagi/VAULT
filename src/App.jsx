import React from 'react';
import { VaultProvider, useVault } from './context/VaultContext';
import { MobileContainer } from './components/MobileContainer';
import { BottomNav } from './components/BottomNav';

import { HomeScreen } from './screens/HomeScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { SendMoneyScreen } from './screens/SendMoneyScreen';
import { SplitBillScreen } from './screens/SplitBillScreen';
import { SavingsGoalsScreen } from './screens/SavingsGoalsScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { ProfileScreen } from './screens/ProfileScreen';

const MainContent = () => {
  const { activeTab } = useVault();

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'transactions':
        return <TransactionsScreen />;
      case 'send':
        return <SendMoneyScreen />;
      case 'split':
        return <SplitBillScreen />;
      case 'goals':
        return <SavingsGoalsScreen />;
      case 'insights':
        return <InsightsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <>
      {renderScreen()}
      <BottomNav />
    </>
  );
};

export default function App() {
  return (
    <VaultProvider>
      <MobileContainer>
        <MainContent />
      </MobileContainer>
    </VaultProvider>
  );
}
