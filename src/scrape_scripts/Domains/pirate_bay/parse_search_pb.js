const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const useProxy = require('puppeteer-page-proxy');
puppeteer.use(StealthPlugin())

const proxylist_pb = require('./proxy_list_pb')


const scrape_strat_pb = async (page) => {

    const base_item_selector_pb = '.list-entry'

    const parse_strat_pb = (elements)=>{
    
        return elements.map((e)=>({
            type:{
                category: e.querySelector('.list-item.item-type').firstChild.innerText,
                subCategory: e.querySelector('.list-item.item-type').lastChild.innerText
            },
            title: e.querySelector('.item-name.item-title a').innerText,
            uploadedOn: e.querySelector('.item-uploaded label').getAttribute('title'),
            seeders: e.querySelector('.item-seed').innerText,
            leechers: e.querySelector('.item-leech').innerText,
            uploaded_by: ((e.querySelector('.item-user a')) ? e.querySelector('.item-user a').innerText : e.querySelector('.item-user').innerText),
            size: e.querySelector('.list-item.item-size').innerText,
            magnetlink: e.querySelector('.item-icons a').getAttribute('href')
        }))
    }
    
    const url = proxylist_pb[0];
    try {
        await page.goto(url+'search.php?q=avengers');

        const data = await page.$$eval(base_item_selector_pb, parse_strat_pb);

        return data
    } catch (err) {
        console.log(err);
        return [{message:'failed to fetch data'}]
    }
};

module.exports = {scrape_strat_pb}
