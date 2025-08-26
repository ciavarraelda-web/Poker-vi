export type Suit = "♠" | "♥" | "♦" | "♣";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";
export interface Card {
  suit: Suit;
  rank: Rank;
}
export interface Player {
  id: string;
  name: string;
  hand: Card[];
  stack: number;
  isActive: boolean;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
  bet: number;
  folded: boolean;
}
export interface TableState {
  tableId: string;
  players: Player[];
  deck: Card[];
  community: Card[];
  pot: number;
  phase: "preflop" | "flop" | "turn" | "river" | "showdown";
  dealerPos: number;
  smallBlindPos: number;
  bigBlindPos: number;
  currentPlayerPos: number;
  smallBlind: number;
  bigBlind: number;
}
