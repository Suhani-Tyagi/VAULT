import React, { useEffect, useState } from 'react';

export const AnimatedAmount = ({ amount, prefix = "₹", className = "" }) => {
  const [displayAmount, setDisplayAmount] = useState(amount);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = displayAmount;
    const endValue = amount;
    const duration = 600; // ms

    if (startValue === endValue) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Smooth easeOutQuad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const current = startValue + (endValue - startValue) * easedProgress;

      setDisplayAmount(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [amount]);

  const formatted = displayAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}{formatted}
    </span>
  );
};
