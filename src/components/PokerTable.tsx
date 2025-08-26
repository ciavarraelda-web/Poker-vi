import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { newTableState, nextPhase, findWinner } from "../poker/texas";
import type { TableState } from "../poker/types";

const DEFAULT_PLAYERS = ["Tu", "Bot1", "Bot2"];

export default function PokerTable() {
  const { publicKey } = useWallet();

  const [tableId, setTableId] = useState<string | null>(null);
  const [state, setState] = useState<TableState | null>(null);
  const [phase, setPhase] = useState<"preflop" | "flop" | "turn" | "river" | "showdown" | "">("");
  const [winnerInfo, setWinnerInfo] = useState<string>("");

  // Crea tavolo e mano
  function createTable() {
    if (!publicKey) return;
    const names = [publicKey.toBase58(), ...DEFAULT_PLAYERS.slice(1)];
    const tableState = newTableState("table-" + Math.round(Math.random() * 100000), names);
    setTableId(tableState.tableId);
    setState(tableState);
    setPhase(tableState.phase);
    setWinnerInfo("");
  }

  // Avanza fase
  function goNextPhase() {
    if (!state) return;
    const next = nextPhase(state);
    setState(next);
    setPhase(next.phase);
    if (next.phase === "showdown") {
      const { winner, hands } = findWinner(next.players, next.community);
      setWinnerInfo(`Vincitore: ${winner.name}\n${hands.join("\n")}`);
    }
  }

  // Fold (solo demo: il player folda)
  function fold() {
    if (!state || !publicKey) return;
    const idx = state.players.findIndex(p => p.name === publicKey.toBase58());
    const newPlayers = state.players.map((p, i) =>
      i === idx ? { ...p, folded: true, isActive: false } : p
    );
    setState({ ...state, players: newPlayers });
  }

  // Render
  return (
    <div style={{ marginTop: 40 }}>
      <button onClick={createTable} disabled={!publicKey}>Nuova mano Texas Hold'em</button>
      {state && (
        <div>
          <div style={{ margin: "20px 0" }}>
            <b>Fase:</b> {phase}
            <br />
            <b>Carta comunità:</b> {state.community.map(c => `${c.rank}${c.suit}`).join(", ")}
          </div>
          <div>
            {state.players.map((p, i) =>
              <div key={i} style={{ marginBottom: 8, color: p.folded ? "gray" : "black" }}>
                <b>{p.name === publicKey?.toBase58() ? "Tu" : p.name}</b>: 
                {p.hand.map(c => ` ${c.rank}${c.suit}`)}
                {p.folded && " (Fold)"}
              </div>
            )}
          </div>
          <div style={{ marginTop: 20 }}>
            <button onClick={goNextPhase}>Avanza fase</button>
            <button onClick={fold} disabled={phase === "showdown"}>Fold</button>
          </div>
          {winnerInfo && (
            <div style={{ marginTop: 20, whiteSpace: "pre-line" }}>
              <b>{winnerInfo}</b>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
