import React, { useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { FEE_WALLET, SUBSCRIPTION_COST_SOL } from "../config";

export default function Subscription() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const paySubscription = useCallback(async () => {
    if (!publicKey) return;
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(FEE_WALLET),
        lamports: Math.floor(SUBSCRIPTION_COST_SOL * 1_000_000_000),
      })
    );
    const signature = await sendTransaction(tx, connection);
    alert("Abbonamento pagato! Signature: " + signature);
  }, [connection, publicKey, sendTransaction]);

  return <button onClick={paySubscription} disabled={!publicKey}>Paga abbonamento</button>;
}
