import 'dotenv/config';

async function findActiveWallet() {
  const apiKey = process.env.GLACIER_API_KEY;
  // Trader Joe Router on Avalanche C-Chain
  const router = "0x60ae616a2155ee3d9a68541ba4544862310933d4"; // TJ V1 Router
  
  const res = await fetch(`https://glacier-api.avax.network/v1/chains/43114/addresses/${router}/transactions?pageSize=5`, {
    headers: { "x-glacier-api-key": apiKey }
  });
  const data = await res.json();
  if (data.transactions && data.transactions.length > 0) {
      console.log("Found active wallet doing a swap:", data.transactions[0].nativeTransaction.from.address);
  }
}

findActiveWallet();
