import React, { memo } from 'react';

export const SkeminoLogo = memo(() => {
  return (
    <div className="skemino-logo-container">
      {/* Diamante nero centrale con triangoli colorati negli angoli */}
      <div className="skemino-diamond">
        {/* Triangoli colorati posizionati negli angoli del diamante */}
        <div className="diamond-triangle diamond-triangle-top" />
        <div className="diamond-triangle diamond-triangle-right" />
        <div className="diamond-triangle diamond-triangle-bottom" />
        <div className="diamond-triangle diamond-triangle-left" />

        {/* Logo Skèmino in rosso al centro */}
        <div className="logo-text">Skèmino</div>
      </div>
    </div>
  );
});

SkeminoLogo.displayName = 'SkeminoLogo';