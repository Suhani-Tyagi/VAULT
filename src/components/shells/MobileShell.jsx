import React from 'react';
import { MobileContainer } from '../MobileContainer';

export const MobileShell = ({ children }) => {
  return (
    <div className="w-full min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <MobileContainer>
        {children}
      </MobileContainer>
    </div>
  );
};
