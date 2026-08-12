import { useDevice } from '../context/DeviceContext';
import { Scan, Fingerprint, ShieldCheck } from 'lucide-react';

export const useBiometricLabel = () => {
  const { os } = useDevice();

  if (os === 'ios') {
    return {
      label: 'Face ID',
      Icon: Scan
    };
  }

  if (os === 'android') {
    return {
      label: 'Fingerprint',
      Icon: Fingerprint
    };
  }

  return {
    label: 'Biometric ID',
    Icon: ShieldCheck
  };
};
