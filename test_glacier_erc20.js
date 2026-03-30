import 'dotenv/config';

async function checkGlacierErc20() {
  const apiKey = process.env.GLACIER_API_KEY;
  const address = "0x498552077b491e00c6317043c47428885a4f015e";
  
  const urls = [
    `https://glacier-api.avax.network/v1/chains/43114/addresses/${address}/transactions:listErc20`,
  ];

  for (const url of urls) {
    const res = await fetch(url, { headers: { "x-glacier-api-key": apiKey }});
    if (res.ok) {
        const data = await res.json();
        console.log("Data: ", JSON.stringify(data, null, 2));
        return;
    }
  }
}

checkGlacierErc20();
