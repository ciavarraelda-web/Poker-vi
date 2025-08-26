import React from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import PokerTable from "./components/PokerTable";
import Subscription from "./components/Subscription";

const wallets = [new PhantomWalletAdapter()];
const endpoint = "https://api.mainnet-beta.solana.com";

export default function App() {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <h1>Poker Texas Hold'em Solana</h1>
            <WalletMultiButton />
            <Subscription />
            <PokerTable />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
