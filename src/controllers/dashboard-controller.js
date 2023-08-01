const {scrape_strat_pb} = require('../scrape_scripts/Domains/pirate_bay/parse_search_pb')

/* async function get_domains(req,res){
    const {browser, page} = req.puppeteer
    const data = await scrape_strat_pb(page)
    console.log(data.length)
    res.json(data)
} */

async function get_title(req,res){
    const {browser, page} = req.puppeteer
    const data = await page.title()
    console.log(data)
    res.json(data)
}




module.exports = {
    get_domains,
    get_title
}