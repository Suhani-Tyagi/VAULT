import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const DeviceContext = createContext(null);

const OVERRIDE_STORAGE_KEY = "vault-device-override";

// Helper: detect OS from userAgentData / userAgent
const detectOS = () => {
  if (typeof window === 'undefined') return 'unknown';

  if (navigator.userAgentData && navigator.userAgentData.platform) {
    const platform = navigator.userAgentData.platform.toLowerCase();
    if (platform.includes('mac')) return 'macos';
    if (platform.includes('win')) return 'windows';
    if (platform.includes('android')) return 'android';
    if (platform.includes('ios') || platform.includes('iphone') || platform.includes('ipad')) return 'ios';
    if (platform.includes('linux')) return 'linux';
  }

  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'macos';
  if (/Windows/i.test(ua)) return 'windows';
  if (/Linux/i.test(ua)) return 'linux';

  return 'unknown';
};

// Helper: detect device type from width
const detectDeviceType = (width) => {
  if (width < 640) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
};

export const DeviceProvider = ({ children }) => {
  const [autoDeviceType, setAutoDeviceType] = useState(() => 
    typeof window !== 'undefined' ? detectDeviceType(window.innerWidth) : 'mobile'
  );
  
  const [autoOS, setAutoOS] = useState(() => detectOS());

  const [override, setOverrideState] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(OVERRIDE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Reactive window resize listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setAutoDeviceType(detectDeviceType(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTouch = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  }, []);

  const setOverride = (newOverride) => {
    setOverrideState(newOverride);
    if (newOverride) {
      localStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify(newOverride));
    } else {
      localStorage.removeItem(OVERRIDE_STORAGE_KEY);
    }
  };

  const clearOverride = () => {
    setOverrideState(null);
    localStorage.removeItem(OVERRIDE_STORAGE_KEY);
  };

  // Compute final effective values (override wins)
  const deviceType = override?.deviceType || autoDeviceType;
  const os = override?.os || autoOS;
  const isOverridden = !!override;
  const modKey = os === 'macos' ? '⌘' : 'Ctrl';

  return (
    <DeviceContext.Provider value={{
      deviceType,
      os,
      isTouch,
      modKey,
      setOverride,
      clearOverride,
      isOverridden,
      activeOverride: override
    }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
