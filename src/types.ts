export type GameType = 'MEGA_645' | 'POWER_655';

export type DrawState = 'IDLE' | 'SPINNING' | 'DRAWING' | 'FINISHED';

export interface DrawResultData {
  mainNumbers: number[]; // Sorted ascending
  drawnOrder: number[];  // Random order as picked from the chamber
  powerNumber?: number;  // Only for POWER_655, distinct from mainNumbers
}

export interface DrawRecord {
  id: string;
  sessionIndex: number;
  sessionCode: string;
  gameType: GameType;
  mainNumbers: number[];
  powerNumber?: number;
  timestamp: string;
}

export interface GameConfig {
  id: GameType;
  name: string;
  subtitle: string;
  description: string;
  maxNumber: number;
  mainBallCount: number;
  hasPowerBall: boolean;
  badgeText: string;
}
