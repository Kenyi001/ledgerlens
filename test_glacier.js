import 'dotenv/config';

async function checkGlacier() {
  const apiKey = process.env.GLACIER_API_KEY;
  const address = "0x498552077b491e00c6317043c47428885a4f015e";
  const url = `https://glacier-api.avax.network/v1/chains/43114/addresses/${address}/transactions?pageSize=5`;

  const res = await fetch(url, {
    headers: { "x-glacier-api-key": apiKey }
  });
  const data = await res.json();
  console.log(JSON.stringify(data.transactions[0], null, 2));
}

checkGlacier();
