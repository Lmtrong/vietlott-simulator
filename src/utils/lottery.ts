import { DrawResultData, GameConfig, GameType } from '../types';

export const GAME_CONFIGS: Record<GameType, GameConfig> = {
  MEGA_645: {
    id: 'MEGA_645',
    name: 'MEGA 6/45',
    subtitle: 'Xổ số tự chọn số điện toán',
    description: 'Chọn 6 số từ 01 đến 45',
    maxNumber: 45,
    mainBallCount: 6,
    hasPowerBall: false,
    badgeText: '6 QUẢ CẦU (01 – 45)',
  },
  POWER_655: {
    id: 'POWER_655',
    name: 'POWER 6/55',
    subtitle: 'Xổ số tự chọn số điện toán + Số đặc biệt',
    description: 'Chọn 6 số chính từ 01 đến 55 và 1 số Power',
    maxNumber: 55,
    mainBallCount: 6,
    hasPowerBall: true,
    badgeText: '6 SỐ CHÍNH + 1 SỐ POWER (01 – 55)',
  },
};

/**
 * Formats a lottery number as a 2-digit string: 01, 02, ..., 55
 */
export function formatBallNumber(num: number): string {
  return num.toString().padStart(2, '0');
}

/**
 * Generates a short random session code at the frontend (e.g., #VL-4829)
 */
export function generateSessionCode(gameType: GameType): string {
  const prefix = gameType === 'MEGA_645' ? 'M45' : 'P55';
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `#${prefix}-${rand}`;
}

/**
 * Formats a Date object into Vietnamese time & date string
 */
export function formatTimestamp(date: Date = new Date()): string {
  const time = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const day = date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return `${time} - ${day}`;
}

/**
 * Samples unique numbers without replacement using Fisher-Yates partial shuffle
 */
export function generateDrawResult(gameType: GameType): DrawResultData {
  const config = GAME_CONFIGS[gameType];
  const pool: number[] = Array.from({ length: config.maxNumber }, (_, i) => i + 1);

  const totalToPick = config.hasPowerBall ? config.mainBallCount + 1 : config.mainBallCount;

  // Fisher-Yates shuffle for sampling without replacement
  for (let i = 0; i < totalToPick; i++) {
    const randomIndex = i + Math.floor(Math.random() * (pool.length - i));
    const temp = pool[i];
    pool[i] = pool[randomIndex];
    pool[randomIndex] = temp;
  }

  const drawnOrder = pool.slice(0, config.mainBallCount);
  const mainNumbers = [...drawnOrder].sort((a, b) => a - b);
  const powerNumber = config.hasPowerBall ? pool[config.mainBallCount] : undefined;

  return {
    mainNumbers,
    drawnOrder,
    powerNumber,
  };
}

/**
 * Returns a consistent color palette class for a lottery ball based on its number or Power status
 */
export type BallColorVariant = 'crimson' | 'amber' | 'cobalt' | 'emerald' | 'violet' | 'power-gold';

export function getBallColorVariant(num: number, isPowerBall = false): BallColorVariant {
  if (isPowerBall) {
    return 'power-gold';
  }
  // Group ball colors by range so they look vivid and recognizable like real studio balls
  if (num <= 10) return 'crimson';
  if (num <= 20) return 'amber';
  if (num <= 30) return 'emerald';
  if (num <= 40) return 'cobalt';
  return 'violet';
}
