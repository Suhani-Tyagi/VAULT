import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, Camera, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const QrScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const videoRef = useRef(null);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    // Attempt to access user media camera stream
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          setStream(s);
          setCameraAvailable(true);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          setCameraAvailable(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = (recipient) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onScanSuccess(recipient);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm bg-vault-surface border border-vault-border rounded-3xl p-6 shadow-2xl overflow-hidden z-10 text-vault-charcoal text-center"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-vault-muted hover:text-vault-charcoal rounded-full hover:bg-vault-surfaceHighlight"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mt-2 mb-4">
            <h3 className="text-lg font-bold text-vault-charcoal tracking-tight flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-vault-terracotta" />
              <span>Scan UPI QR Code</span>
            </h3>
            <p className="text-xs text-vault-muted mt-0.5">
              Point camera at any merchant or friend's UPI QR code
            </p>
          </div>

          {/* Camera Viewfinder View */}
          <div className="relative w-full h-56 bg-black rounded-2xl overflow-hidden flex items-center justify-center my-4 border-2 border-vault-terracotta/40">
            {cameraAvailable ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="text-center p-4 space-y-2 text-white/80">
                <Camera className="w-10 h-10 mx-auto text-vault-terracotta opacity-80" />
                <p className="text-xs font-semibold text-white">Camera unavailable in this demo</p>
                <p className="text-[11px] text-vault-muted">Tap below to test QR code auto-scan</p>
              </div>
            )}

            {/* Scan animation frame overlay */}
            <div className="absolute inset-8 border-2 border-dashed border-vault-terracotta rounded-xl pointer-events-none animate-pulse" />
          </div>

          {/* Mock QR Scan Presets */}
          <div className="space-y-2 text-xs">
            <p className="text-vault-muted font-bold text-[11px] uppercase tracking-wider">Test QR Scan Payees</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSimulateScan({ name: "Society Tea Kirana", upiId: "societytea@upi" })}
                className="p-2 bg-vault-paper border border-vault-border rounded-xl font-bold text-vault-charcoal hover:border-vault-terracotta"
              >
                Kirana Store QR
              </button>
              <button
                type="button"
                onClick={() => handleSimulateScan({ name: "Third Wave Coffee", upiId: "thirdwave@upi" })}
                className="p-2 bg-vault-paper border border-vault-border rounded-xl font-bold text-vault-charcoal hover:border-vault-terracotta"
              >
                Cafe QR Code
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
