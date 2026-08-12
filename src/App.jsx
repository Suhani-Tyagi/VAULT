import React, { useEffect } from 'react';
import { DeviceProvider, useDevice } from './context/DeviceContext';
import { VaultProvider, useVault } from './context/VaultContext';

import { MobileShell } from './components/shells/MobileShell';
import { TabletShell } from './components/shells/TabletShell';
import { DesktopShell } from './components/shells/DesktopShell';

import { HomeScreen } from './screens/HomeScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { SendMoneyScreen } from './screens/SendMoneyScreen';
import { SplitBillScreen } from './screens/SplitBillScreen';
import { SavingsGoalsScreen } from './screens/SavingsGoalsScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { ProfileScreen } from './screens/ProfileScreen';

const MainScreenRouter = () => {
  const { activeTab } = useVault();

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

const AdaptiveShellContainer = () => {
  const { deviceType } = useDevice();

  useEffect(() => {
    // Restore dark theme on initial mount if saved in localStorage
    const savedTheme = localStorage.getItem("vault-theme");
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  if (deviceType === 'tablet') {
    return (
      <TabletShell>
        <MainScreenRouter />
      </TabletShell>
    );
  }

  if (deviceType === 'desktop') {
    return (
      <DesktopShell>
        <MainScreenRouter />
      </DesktopShell>
    );
  }

  // Default: mobile shell
  return (
    <MobileShell>
      <MainScreenRouter />
    </MobileShell>
  );
};

export default function App() {
  return (
    <DeviceProvider>
      <VaultProvider>
        <AdaptiveShellContainer />
      </VaultProvider>
    </DeviceProvider>
  );
}
