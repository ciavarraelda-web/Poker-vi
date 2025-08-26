# Poker Texas Hold'em Solana (Vite)

Poker peer-to-peer con **Texas Hold'em reale** (logica semplificata, estendibile), pagamenti Solana, fee e abbonamento,  
**pronto per deploy su Vercel senza errori 404!**

## Funzionalità
- Login wallet Solana (Phantom)
- Pagamento abbonamento
- Logica Texas Hold'em (carta alta, coppia, tris, scala, colore, full, poker, showdown)
- Crea tavolo, nuova mano, avanza fasi, fold, vincitore

## Deploy
1. Installa dipendenze:
   ```
   npm install
   ```
2. Avvia in locale:
   ```
   npm run dev
   ```
3. Build per deploy:
   ```
   npm run build
   ```
4. Deploy su Vercel:
   - Assicurati che ci sia `vercel.json`
   - Imposta output dir `dist` su Vercel
   - Deploy!

## Risoluzione errori 404
- Il file `vercel.json` forza tutte le route su `index.html` per SPA.
---
