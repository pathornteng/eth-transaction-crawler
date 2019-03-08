const InputDataDecoder = require('ethereum-input-data-decoder');
const rp = require('request-promise');
const fs = require('fs');

const decoder = new InputDataDecoder(`gateway.json`);

async function queryTX() {
  var options = {
    uri: 'http://api.etherscan.io/api?module=account&action=txlist&address=0x8f8E8b3C4De76A31971Fe6a87297D8f703bE8570&startblock=0&endblock=99999999&sort=asc',
    json: true 
};
  const res = await rp(options)
  const txs = res.result
  const all = []
  for(var i=0; i<txs.length; i++) {
    const data = decoder.decodeData(txs[i].input)
    const createdAt = new Date(txs[i].timeStamp * 1000)
    txs[i].eventName = data.name
    txs[i].amount = ""
    txs[i].createdAt = createdAt
    if (data.inputs[0] != null) {
      txs[i].amount = data.inputs[0].toString()
    }

    if (txs[i].eventName != null) {
      all.push(txs[i])
    } 
  }
  fs.writeFileSync("gateway_tx.json", JSON.stringify(all, null, 4))
}

(async function () {
  try {
    await queryTX()
  }catch(err) {
    console.log(err)
  }
})()
