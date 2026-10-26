import React from 'react';
import { Sparkles } from 'lucide-react';
import { GameType } from '../types';
import { GameSelector } from './GameSelector';

interface HeaderProps {
  activeGame: GameType;
  onSelectGame: (game: GameType) => void;
  disabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeGame,
  onSelectGame,
  disabled,
}) => {
  return (
    <header className="studio-header">
      <div className="header-inner">
        <div className="brand-block">
          <div className="brand-emblem" aria-hidden="true">
            <Sparkles size={22} className="brand-icon" />
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <span className="brand-title">VIETLOTT SIMULATOR</span>
              <span className="studio-live-badge">STUDIO 3D</span>
            </div>
            <p className="brand-subtitle">Lottery Draw Experience</p>
          </div>
        </div>

        <GameSelector
          activeGame={activeGame}
          onSelectGame={onSelectGame}
          disabled={disabled}
        />
      </div>
    </header>
  );
};
