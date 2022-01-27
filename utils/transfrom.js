const _ = require('lodash');
const { getUrlName } = require('../utils/urlName');
const { axios } = require('../../blockcrypto/utils/request');
const { config } = require('../config/index');

async function getChainsCoinUrl(url_name) {
    const { difi_base_data_url } = config;
    const url_set = [];
    _.forEach(url_name, d => {
        const difi_coin_url = `${difi_base_data_url}chain/${d}.json`;
        url_set.push(difi_coin_url);
    })
    // setTimeout(() => {
    //     console.log(url_set)
    // }, 5000);
    return url_set
}

async function getChainsUrl(url_name) {
    const { difi_chain_base_url } = config;
    const url_set = [];
    _.forEach(url_name, u => {
        const difi_chain_url = `${difi_chain_base_url}${u}`
        const hd = [u, difi_chain_url]
        url_set.push(hd);
    })
    return url_set
}

async function getChainsCoinData(gain_1, gain_7, drop_1, drop_7) {
    const url_name = await getUrlName();
    const url_set = await getChainsCoinUrl(url_name);
    const up_coin = [];
    // const down_coin = [];
    // const coin = [up_coin,down_coin];
    _.forEach(url_set, async u => {
        const row_data = await axios(u);
        const data = await transformDate(row_data);
        _.forEach(data, d => {
            if (gain_1 && gain_7 && d[3] > gain_1 && d[4] > gain_7) {
                up_coin.push(d)
            }
            // else if(drop_1 && drop_7 && d[3] < -drop_1 && d[4] < -drop_7) {
            //     down_coin.push(d)
            // }else return
        })
        // console.log(up_coin,down_coin)
    })
    return up_coin
}

async function getChainsData() {
    const url_name = await getUrlName();
    const url_set = await getChainsUrl(url_name);
    console.log(url_name,'111',url_set,'111')
    const up_chain = [];
    _.forEach(url_set, async u => {
        const row_data = await axios(u[1]);
        const hd = await transformChainsData(u[0], row_data);
        if (hd) {
            up_chain.push(hd)
        } else return
        // console.log(row_data)
    })
    return up_chain
}

async function transformChainsData(chain_name, data) {
    if (data && data.length && data.length > 7) {
        const date_data_new = data.at(-1);
        const data_1d = data.at(-2).totalLiquidityUSD;
        const data_7d = data.at(-7).totalLiquidityUSD;
        const gain_1d = ((date_data_new.totalLiquidityUSD - data_1d) / data_1d);
        const gain_7d = ((date_data_new.totalLiquidityUSD - data_7d) / data_7d);
        if (gain_1d > 0.05 || gain_7d > 0.1) {
            const g1 = Number(gain_1d * 100).toFixed(2);
            const g7 = Number(gain_7d * 100).toFixed(2);
            const g_1 = g1 + "%";
            const g_7 = g7 + "%";
            var hd = [chain_name, date_data_new.date, g_1, g_7];
            return hd
        } else return
    } else return
}

async function transformDate(row_data) {
    const chain_name = row_data.pageProps.chain;
    const filteredProtocols = row_data.pageProps.filteredProtocols;
    const handle_data = [];
    _.forEach(filteredProtocols, d => {
        const change_7d = d.change_7d;
        const change_1d = d.change_1d;
        const coin_name = d.symbol;
        const name = d.name;
        const hd = [chain_name, name, coin_name, change_1d, change_7d];
        handle_data.push(hd);
    })
    // console.log(handle_data)
    return handle_data
}

module.exports = {
    getChainsCoinData,
    getChainsData
}