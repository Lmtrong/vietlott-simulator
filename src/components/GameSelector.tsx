import React from 'react';
import { Flame, Zap } from 'lucide-react';
import { GameType } from '../types';

interface GameSelectorProps {
  activeGame: GameType;
  onSelectGame: (game: GameType) => void;
  disabled: boolean;
}

export const GameSelector: React.FC<GameSelectorProps> = ({
  activeGame,
  onSelectGame,
  disabled,
}) => {
  return (
    <div
      className={`game-selector ${disabled ? 'is-disabled' : ''}`}
      role="tablist"
      aria-label="Chọn chương trình quay số"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeGame === 'MEGA_645'}
        disabled={disabled}
        className={`selector-tab tab-mega ${activeGame === 'MEGA_645' ? 'active' : ''}`}
        onClick={() => onSelectGame('MEGA_645')}
      >
        <Flame className="tab-icon" size={16} />
        <span className="tab-title">MEGA 6/45</span>
        <span className="tab-pill">6 Số</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeGame === 'POWER_655'}
        disabled={disabled}
        className={`selector-tab tab-power ${activeGame === 'POWER_655' ? 'active' : ''}`}
        onClick={() => onSelectGame('POWER_655')}
      >
        <Zap className="tab-icon" size={16} />
        <span className="tab-title">POWER 6/55</span>
        <span className="tab-pill">+Power</span>
      </button>
    </div>
  );
};
