const { getChainsCoinData, getChainsData } = require('./utils/transfrom');

async function chainGainCoin() {
    // const coin_data = await getChainsCoinData(5, 20);
    const chain_data = await getChainsData()
    // if (handle_data[0] && !handle_data[1]) {
    //     var hd = [handle_data[0],'未输入跌幅'];
    // }else if (!handle_data[0] && handle_data[1]) {
    //     var hd = ['未输入涨幅', handle_data[1]];
    // }
    setTimeout(() => {
        console.log(chain_data)
    }, 3000);
}

chainGainCoin()