const _ = require('lodash');
const axios = require('axios');
const cheerio = require('cheerio');
const { config } = require('../config/index');

async function getUrlName() {
    const { difi_url, class_key_data, class_key_name } = config;
    var chains_set = [];
    await axios(difi_url).then((res) => {
        const $ = cheerio.load(res.data);
        const cs = $(class_key_name);
        // const cd = $(class_key_data);
        // const chains_data = [];
        cs.each((i,v) => {
            const name = $(v).text().trim();
            const n = name.indexOf('(')
            if (n>0) {
                const hd = name.substr(0,n).replace(' ','')
                chains_set.push(hd);
            }else if (n<0) {
                chains_set.push(name)
            }
        })
        // cd.each((i,v) => {
        //     const data = $(v).text().trim();
        //     chains_data.push(data);
        //     console.log(data)
        // })
        // setTimeout(() => {
            // console.log(chains_set)
        // }, 5000);
    })
    return chains_set
}

// getUrlName()

module.exports = {
    getUrlName
}