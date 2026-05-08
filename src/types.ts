export type GameState = 'TITLE' | 'PLAYING' | 'GAMEOVER' | 'GARAGE' | 'LEADERBOARD';

export interface ScoreData {
    distance: number;
    score: number;
    combo: number;
}
