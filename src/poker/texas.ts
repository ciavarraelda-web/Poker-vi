import { Card, Player, TableState, Suit, Rank } from "./types";

// Crea mazzo 52 carte
export function createDeck(): Card[] {
  const suits: Suit[] = ["♠", "♥", "♦", "♣"];
  const ranks: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

// Mescola il mazzo
export function shuffle(deck: Card[]): Card[] {
  const d = deck.slice();
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

// Distribuisci carte ai giocatori
export function dealHands(players: Player[], deck: Card[]): [Player[], Card[]] {
  const newPlayers = players.map(p => ({
    ...p,
    hand: deck.slice(0, 2),
    bet: 0,
    folded: false,
    isActive: true,
  }));
  return [newPlayers, deck.slice(2 * players.length)];
}

// Prepara una nuova mano
export function newTableState(tableId: string, playerNames: string[]): TableState {
  let deck = shuffle(createDeck());
  let players: Player[] = playerNames.map((name, i) => ({
    id: "p" + i,
    name,
    hand: [],
    stack: 1000,
    isActive: true,
    isDealer: i === 0,
    isSmallBlind: i === 1,
    isBigBlind: i === 2,
    bet: 0,
    folded: false,
  }));
  [players, deck] = dealHands(players, deck);
  return {
    tableId,
    players,
    deck,
    community: [],
    pot: 0,
    phase: "preflop",
    dealerPos: 0,
    smallBlindPos: 1,
    bigBlindPos: 2,
    currentPlayerPos: 0,
    smallBlind: 10,
    bigBlind: 20,
  };
}

// Avanza le fasi (solo call/check/fold demo)
export function nextPhase(state: TableState): TableState {
  // Flop
  if (state.phase === "preflop") {
    return { ...state, phase: "flop", community: state.deck.slice(0, 3), deck: state.deck.slice(3) };
  }
  // Turn
  if (state.phase === "flop") {
    return { ...state, phase: "turn", community: [...state.community, state.deck[0]], deck: state.deck.slice(1) };
  }
  // River
  if (state.phase === "turn") {
    return { ...state, phase: "river", community: [...state.community, state.deck[0]], deck: state.deck.slice(1) };
  }
  // Showdown
  if (state.phase === "river") {
    return { ...state, phase: "showdown" };
  }
  // Already at showdown
  return state;
}

// Valutazione mani Texas Hold'em (semplificata)
export function evaluateHand(hand: Card[], community: Card[]): string {
  const all = [...hand, ...community];
  const ranks = all.map(c => c.rank);
  const rankCounts: Record<string, number> = {};
  ranks.forEach(r => { rankCounts[r] = (rankCounts[r] || 0) + 1; });

  const suits = all.map(c => c.suit);
  const suitCounts: Record<string, number> = {};
  suits.forEach(s => { suitCounts[s] = (suitCounts[s] || 0) + 1; });

  // Poker
  if (Object.values(rankCounts).includes(4)) return "Poker!";
  // Full
  if (Object.values(rankCounts).includes(3) && Object.values(rankCounts).includes(2)) return "Full!";
  // Colore
  if (Object.values(suitCounts).some(x => x >= 5)) return "Colore!";
  // Scala (semplificata)
  const rankOrder: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const nums = ranks.map(r => rankOrder.indexOf(r)).sort((a, b) => a - b);
  let straight = false;
  for (let i = 0; i < nums.length - 4; i++) {
    if (nums[i + 4] - nums[i] === 4) straight = true;
  }
  if (straight) return "Scala!";

  // Tris
  if (Object.values(rankCounts).includes(3)) return "Tris!";
  // Doppia coppia
  if (Object.values(rankCounts).filter(x => x === 2).length >= 2) return "Doppia Coppia!";
  // Coppia
  if (Object.values(rankCounts).includes(2)) return "Coppia!";

  return "Carta alta";
}

// Trova il vincitore
export function findWinner(players: Player[], community: Card[]): { winner: Player, hands: string[] } {
  let bestRank = -1;
  let winner = players[0];
  let hands: string[] = [];
  const rankOrder = ["Carta alta", "Coppia!", "Doppia Coppia!", "Tris!", "Scala!", "Colore!", "Full!", "Poker!"];
  for (const p of players) {
    if (p.folded) continue;
    const handType = evaluateHand(p.hand, community);
    hands.push(`${p.name}: ${handType}`);
    const rank = rankOrder.indexOf(handType);
    if (rank > bestRank) {
      bestRank = rank;
      winner = p;
    }
  }
  return { winner, hands };
}
