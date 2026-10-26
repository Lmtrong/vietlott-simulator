import React from 'react';
import { Clock, Hash, Loader2, Play, RotateCcw, RefreshCw, Activity } from 'lucide-react';
import { DrawState, GameType } from '../types';
import { GAME_CONFIGS } from '../utils/lottery';

interface DrawControlsProps {
  gameType: GameType;
  drawState: DrawState;
  sessionCode: string;
  lastDrawTime: string | null;
  onStartDraw: () => void;
  onReset: () => void;
}

export const DrawControls: React.FC<DrawControlsProps> = ({
  gameType,
  drawState,
  sessionCode,
  lastDrawTime,
  onStartDraw,
  onReset,
}) => {
  const isBusy = drawState === 'SPINNING' || drawState === 'DRAWING';
  const isFinished = drawState === 'FINISHED';
  const gameConfig = GAME_CONFIGS[gameType];

  const getPrimaryButtonText = () => {
    if (isBusy) return 'ĐANG QUAY...';
    if (isFinished) return 'QUAY LẠI';
    return 'QUAY SỐ NGAY';
  };

  const getStatusLabel = () => {
    if (isBusy) return 'Đang quay';
    if (isFinished) return 'Hoàn tất';
    return 'Sẵn sàng';
  };

  return (
    <div className="draw-controls-section">
      {/* Primary & Secondary Action Buttons */}
      <div className="controls-button-group">
        <button
          type="button"
          className={`btn-primary-draw ${isBusy ? 'is-loading' : ''} ${
            isFinished ? 'is-replay' : ''
          }`}
          onClick={onStartDraw}
          disabled={isBusy}
        >
          <span className="btn-glow-layer" aria-hidden="true" />
          <span className="btn-content">
            {isBusy ? (
              <Loader2 className="btn-icon spin-icon" size={22} />
            ) : isFinished ? (
              <RefreshCw className="btn-icon" size={22} />
            ) : (
              <Play className="btn-icon fill-current" size={22} />
            )}
            <span className="btn-label">{getPrimaryButtonText()}</span>
          </span>
        </button>

        <button
          type="button"
          className="btn-secondary-reset"
          onClick={onReset}
          disabled={isBusy || drawState === 'IDLE'}
          title="Đưa sân khấu về trạng thái ban đầu"
        >
          <RotateCcw size={18} />
          <span>ĐẶT LẠI</span>
        </button>
      </div>

      {/* Subtle Session Info Bar (Section 4.F) */}
      <div className="session-telemetry-bar" aria-label="Thông tin phiên quay">
        <div className="telemetry-item">
          <span className="telemetry-label">CHƯƠNG TRÌNH</span>
          <span className="telemetry-value highlight">{gameConfig.name}</span>
        </div>

        <div className="telemetry-divider" aria-hidden="true" />

        <div className="telemetry-item">
          <span className="telemetry-label">
            <Activity size={12} /> TRẠNG THÁI
          </span>
          <span className={`telemetry-status status-${drawState.toLowerCase()}`}>
            <span className="status-dot" />
            {getStatusLabel()}
          </span>
        </div>

        <div className="telemetry-divider" aria-hidden="true" />

        <div className="telemetry-item">
          <span className="telemetry-label">
            <Hash size={12} /> MÃ PHIÊN
          </span>
          <span className="telemetry-value mono">{sessionCode}</span>
        </div>

        <div className="telemetry-divider" aria-hidden="true" />

        <div className="telemetry-item">
          <span className="telemetry-label">
            <Clock size={12} /> LẦN QUAY GẦN NHẤT
          </span>
          <span className="telemetry-value mono">
            {lastDrawTime ?? 'Chưa thực hiện'}
          </span>
        </div>
      </div>
    </div>
  );
};
