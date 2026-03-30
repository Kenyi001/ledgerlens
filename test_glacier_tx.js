import 'dotenv/config';

async function checkGlacierTx() {
  const apiKey = process.env.GLACIER_API_KEY;
  const txHash = "0x0b6c42bdda9a34368ac536b5915eb85a0f2b27e0f047d0520a944e9bebbd50d9"; // From user's log
  const url = `https://glacier-api.avax.network/v1/chains/43114/transactions/${txHash}`;

  const res = await fetch(url, {
    headers: { "x-glacier-api-key": apiKey }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

checkGlacierTx();
