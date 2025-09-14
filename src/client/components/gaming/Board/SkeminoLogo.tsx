import React, { memo } from 'react';

export const SkeminoLogo = memo(() => {
  return (
    <div className="skemino-logo-container">
      <div className="skemino-diamond">
        <div className="diamond-quadrant diamond-blue" />
        <div className="diamond-quadrant diamond-green" />
        <div className="diamond-quadrant diamond-red" />
        <div className="diamond-quadrant diamond-yellow" />
        <div className="logo-text">Skèmino</div>
      </div>
    </div>
  );
});

SkeminoLogo.displayName = 'SkeminoLogo';