const runTask = require('../scrape_scripts/json_based_scraping/json_scrape_script')
const taskRunner = require('../scrape_scripts/improved_scripts/pure_scraping_script')
const domains = require('../tasks/catalog_of_tasks')
const delay = ms => new Promise(res => setTimeout(res, ms));

async function get_title(req,res){
    const {browser, page} = req.puppeteer
    const data = await page.title()
    console.log(data)
    res.json(data)
}

async function custom_scrape(req, res){
    const {browser, page} = req.puppeteer
    const {task} = req.body
    console.log(task);
    try{
        const data = await taskRunner(page, task)
        console.log(data);
        if(typeof data.success !== 'undefined' && data.success === false){
            return res.status(400).json({
                success:data.success,
                message:data.message
            })
        }
        return res.json({
            success:true,
            data:data,
            message:"Data fetched successfully",
        })
    }catch(err){
        return res.json({
            success:false,
            message:"Request Failed (or) No result for given data",
            error:err.message
        })
    }
}

async function fetchMagnetLinks(torrents_data_array, details_task, browser) {
    const fetchMagnetLinkPromises = torrents_data_array.map(async (torrent_data) => {
        const page = await browser.newPage()
        const details_url = `https://1337x.unblockit.rsvp${torrent_data['torrent_details_page_link']}`;
        details_task.params['torent_details_url'].value = details_url;
        const {magnet_link}  = await taskRunner(page, details_task);
        page.close()
        return { ...torrent_data, magnet_link };
    });
  
    return await Promise.all(fetchMagnetLinkPromises);
  }

async function getDataFrom1337x(req,res){
    const {browser, page} = req.puppeteer
    const {search_text} = req.body
    const search_task = domains.find((e)=>e['domain_name']==="1337x").urls.find((e)=>e['name']==="Search").task
    const details_task = domains.find((e)=>e['domain_name']==="1337x").urls.find((e)=>e['name']==="Details").task
    console.log(search_task.params['search_text'].value);
    
    
    search_task.params['search_text'].value = search_text
    let torrents_data_with_magnet_links
    try{
        let torrents_data_array = await taskRunner(page, search_task)
        torrents_data_with_magnet_links = await fetchMagnetLinks(torrents_data_array, details_task, browser);
    }catch(err){
        return res.json({
            success:false,
            message:"Request Failed (or) No data for given data",
            error:err.message
        })
    }
    
    console.log(torrents_data_with_magnet_links);


    return res.json(torrents_data_with_magnet_links)

    /* Takes ~11s to run */
    /* for(let i=0; i<torrents_data_array.length; i++){
        details_task.params['torent_details_url'].value = `https://1337x.unblockit.rsvp${torrents_data_array[i]['torrent_details_page_link']}`

        const {magnet_link} = await taskRunner(page, details_task)
        torrents_data_array[i].magnet_link = magnet_link
    }
    console.log(torrents_data_array); */

    /* Still sync code take same as above */
    /* torrents_data_array = await Promise.allSettled(torrents_data_array.map(async(data)=>{
        details_task.params['torent_details_url'].value = `https://1337x.unblockit.rsvp${data['torrent_details_page_link']}`

        const {magnet_link} = await taskRunner(page, details_task)
        data.magnet_link = magnet_link
    })) */

    /* async optimized take ~5s to run */
}

async function getDomains(req, res){
    res.json({
        success:true,
        data:domains,
        message:"Data fetched successfully"
    })
}


module.exports = {
    get_title,
    custom_scrape,
    getDomains,
    getDataFrom1337x
}