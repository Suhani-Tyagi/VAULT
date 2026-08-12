import React, { useEffect, lazy, Suspense } from 'react';
import { MotionConfig } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { DeviceProvider, useDevice } from './context/DeviceContext';
import { VaultProvider, useVault } from './context/VaultContext';
import { ErrorBoundary } from './components/ErrorBoundary';

import { MobileShell } from './components/shells/MobileShell';
import { TabletShell } from './components/shells/TabletShell';
import { DesktopShell } from './components/shells/DesktopShell';

// Code-split screen components via React.lazy
const HomeScreen = lazy(() => import('./screens/HomeScreen').then(m => ({ default: m.HomeScreen })));
const TransactionsScreen = lazy(() => import('./screens/TransactionsScreen').then(m => ({ default: m.TransactionsScreen })));
const SendMoneyScreen = lazy(() => import('./screens/SendMoneyScreen').then(m => ({ default: m.SendMoneyScreen })));
const SplitBillScreen = lazy(() => import('./screens/SplitBillScreen').then(m => ({ default: m.SplitBillScreen })));
const SavingsGoalsScreen = lazy(() => import('./screens/SavingsGoalsScreen').then(m => ({ default: m.SavingsGoalsScreen })));
const InsightsScreen = lazy(() => import('./screens/InsightsScreen').then(m => ({ default: m.InsightsScreen })));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })));

const LoadingFallback = () => (
  <div className="py-20 flex flex-col items-center justify-center space-y-3 text-vault-muted">
    <Loader2 className="w-8 h-8 text-vault-terracotta animate-spin" />
    <p className="text-xs font-semibold">Loading Vault Screen...</p>
  </div>
);

const MainScreenRouter = () => {
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
    <Suspense fallback={<LoadingFallback />}>
      {renderScreen()}
    </Suspense>
  );
};

const AdaptiveShellContainer = () => {
  const { deviceType } = useDevice();

  useEffect(() => {
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

  return (
    <MobileShell>
      <MainScreenRouter />
    </MobileShell>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <DeviceProvider>
          <VaultProvider>
            <AdaptiveShellContainer />
          </VaultProvider>
        </DeviceProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
