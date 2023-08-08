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
    const {browser} = req.puppeteer
    const page = await browser.newpage()
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
    }finally{
        page.close()
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
    const {browser} = req.puppeteer
    const page = await browser.newPage()
    const {keyword} = req.query
    const search_task = domains.find((e)=>e['domain_name']==="1337x").urls.find((e)=>e['name']==="Search").task
    const details_task = domains.find((e)=>e['domain_name']==="1337x").urls.find((e)=>e['name']==="Details").task
    
    
    
    search_task.params['search_text'].value = keyword
    
    try{

        let torrents_data_array = await taskRunner(page, search_task)
        torrents_data_array =  await fetchMagnetLinks(torrents_data_array, details_task, browser);
    
        console.log(torrents_data_array);
        
        return res.json({
            success:true,
            data:torrents_data_array,
            message:'Data Fetched Successfully'
        })

    }catch(err){
        
        return res.json({
            success:false,
            message:"Request Failed (or) No data for given data",
            error:err.message
        })
    }finally{
        page.close()
    }
    
    

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

async function getDataFromPirateBay(req,res){
    const {browser} = req.puppeteer
    const page = await browser.newPage()
    const {keyword} = req.query
    const search_task = domains.find((e)=>e['domain_name']==="Pirate-Bay").urls.find((e)=>e['name']==="Search").task

    search_task.params['search_text'].value = keyword

    try{
        const torrents_data_array = await taskRunner(page, search_task)
        console.log(torrents_data_array);

        if(torrents_data_array[0].title === 'No results returned'){
            return res.status(404).json({
                success:false,
                message:"No Data found for given Keyword"
            })
        }
       
        return res.json({
            success:true,
            data:torrents_data_array,
            message:'Data Fetched Successfully'
        })
    }catch(err){
        
        return res.json({
            success:false,
            message:"Request Failed (or) No data for given keyword",
            error:err.message
        })
    }finally{
        page.close()
    }
}

async function getDataFromBingeWatch(req, res){
    const {browser} = req.puppeteer
    const page = await browser.newPage()
    const {keyword} = req.query
    const search_task = domains.find((e)=>e['domain_name']==="Binge-Watch").urls.find((e)=>e['name']==="Search").task

    search_task.params['search_text'].value = keyword

    try{
        const streams_data_array = await taskRunner(page, search_task)
        console.log(streams_data_array);
        res.json({
            success: true,
            data: streams_data_array,
            message: 'Data Fectched Successfully'
        })

    }catch(err){
        console.log(err);
        return res.json({
            success:false,
            message:"Request Failed (or) No data for given keyword",
            error:err.message
        })
    }finally{
        page.close()
    }
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
    getDataFrom1337x,
    getDataFromPirateBay,
    getDataFromBingeWatch
}