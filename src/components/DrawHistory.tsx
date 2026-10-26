import React from 'react';
import { History, Trash2, Dices, Flame, Zap } from 'lucide-react';
import { DrawRecord } from '../types';
import { LotteryBall } from './LotteryBall';

interface DrawHistoryProps {
  history: DrawRecord[];
  onClearHistory: () => void;
  disabled?: boolean;
}

export const DrawHistory: React.FC<DrawHistoryProps> = ({
  history,
  onClearHistory,
  disabled = false,
}) => {
  return (
    <section className="draw-history-section" aria-label="Lịch sử quay số">
      <div className="history-header">
        <div className="history-title-group">
          <div className="history-icon-box">
            <History size={20} />
          </div>
          <div>
            <h2 className="history-title">LỊCH SỬ QUAY SỐ</h2>
            <p className="history-subtitle">
              Lưu trữ các phiên mô phỏng trong phiên làm việc hiện tại ({history.length} kết quả)
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            className="btn-clear-history"
            onClick={onClearHistory}
            disabled={disabled}
          >
            <Trash2 size={15} />
            <span>Xóa lịch sử</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history-empty-state">
          <div className="empty-state-orb">
            <Dices size={32} className="empty-icon" />
          </div>
          <h3 className="empty-title">Chưa có phiên quay số nào</h3>
          <p className="empty-desc">
            Nhấn nút <strong>“QUAY SỐ NGAY”</strong> ở trên để bắt đầu mô phỏng lồng cầu và xem kết quả được ghi nhận tại đây.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((record) => {
            const isMega = record.gameType === 'MEGA_645';
            return (
              <div
                key={record.id}
                className={`history-card ${isMega ? 'card-mega' : 'card-power'}`}
              >
                <div className="history-card-meta">
                  <span className="history-session-index">
                    Phiên #{record.sessionIndex.toString().padStart(2, '0')}
                  </span>
                  <span className="history-session-code">{record.sessionCode}</span>
                  <span
                    className={`history-game-badge ${
                      isMega ? 'badge-mega' : 'badge-power'
                    }`}
                  >
                    {isMega ? <Flame size={13} /> : <Zap size={13} />}
                    {isMega ? 'MEGA 6/45' : 'POWER 6/55'}
                  </span>
                  <span className="history-timestamp">{record.timestamp}</span>
                </div>

                <div className="history-card-balls">
                  <div className="history-main-balls">
                    {record.mainNumbers.map((num, idx) => (
                      <LotteryBall
                        key={`${record.id}-main-${idx}-${num}`}
                        number={num}
                        size="sm"
                      />
                    ))}
                  </div>

                  {record.powerNumber !== undefined && (
                    <div className="history-power-group">
                      <span className="history-plus" aria-hidden="true">
                        +
                      </span>
                      <LotteryBall
                        number={record.powerNumber}
                        isPowerBall={true}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
